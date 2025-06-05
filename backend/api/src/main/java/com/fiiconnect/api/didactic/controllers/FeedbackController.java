package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.BulkNotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.NotificationService;
import com.fiiconnect.api.didactic.exceptions.FeedbackForProfessorNotFound;
import com.fiiconnect.api.didactic.exceptions.FeedbackFromStudentNotFound;
import com.fiiconnect.api.didactic.exceptions.FeedbackNotFound;
import com.fiiconnect.api.didactic.exceptions.UnauthorizedOperationException;
import com.fiiconnect.api.didactic.models.Feedback;
import com.fiiconnect.api.didactic.models.FeedbackCompositeKey;
import com.fiiconnect.api.didactic.models.GlobalConstant;
import com.fiiconnect.api.didactic.repositories.FeedbackRepository;
import com.fiiconnect.api.didactic.repositories.GlobalConstantRepository;
import com.fiiconnect.api.didactic.services.FeedbackService;
import com.fiiconnect.api.didactic.services.ProfessorService;
import jakarta.websocket.server.PathParam;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
public class FeedbackController {
    private final FeedbackRepository repository;
    private final FeedbackService service;
    private final PersonController personController;
    private final GlobalConstantRepository globalConstantRepository;
    private final ProfessorService professorService;

    @GetMapping("/didactic/feedbacks")
    public List<Feedback> getFeedback() {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        return repository.findAll().stream().filter(f -> service.allowFeedbackViewing(person, f.getId())).toList();
    }

    @GetMapping("/didactic/feedback")
    public ResponseEntity<?> getFeedbackByDidacticId(@RequestParam(required = false) Long studentId, @RequestParam Long profId) {
        if(studentId == null && profId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(profId == null) {
            var feedbackList = repository.findAllByIdIdStud(studentId).stream().filter(f -> service.allowFeedbackViewing(person, f.getId())).toList();
            if(feedbackList.isEmpty())
                throw new FeedbackFromStudentNotFound(studentId);
            return ResponseEntity.status(HttpStatus.OK).body(
                    feedbackList
            );
        }
        if(studentId == null) {
            var feedbackList = repository.findAllByIdIdProf(profId).stream().filter(f -> service.allowFeedbackViewing(person, f.getId())).toList();
            if(feedbackList.isEmpty())
                throw new FeedbackForProfessorNotFound(profId);
            return ResponseEntity.status(HttpStatus.OK).body(
                    feedbackList
            );
        }
        FeedbackCompositeKey key = new FeedbackCompositeKey(studentId, profId);
        if(!service.allowFeedbackViewing(person, key))
            throw new UnauthorizedOperationException("Only the student who made the feedback or the professor whom the feedback is adressed to may see it");

        if (!repository.existsById(key)) {
            throw new FeedbackNotFound(studentId, profId);
        }
        return ResponseEntity.ok().body(repository.findAllById(List.of(key)));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/didactic/feedback")
    public ResponseEntity<?> createFeedback(@RequestBody Feedback feedback) {
        GlobalConstant feedbacksAllowed = globalConstantRepository.findByName("feedbacksAllowed");
        if(feedbacksAllowed == null || !feedbacksAllowed.getValue().equals("true"))
            throw new UnauthorizedOperationException("Feedbacks are currently disabled");

        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.authorizeFeedbackOperation(person, feedback.getId()))
            throw new UnauthorizedOperationException("Only students can create feedbacks");

        feedback.getId().setIdStud(person.student().id());

        Feedback addedFeedback = repository.save(feedback);
        professorService.notifyProfessorUser(feedback.getId().getIdProf(), "Feedback notification", "You have received a new feedback", "feedback");

        return ResponseEntity.status(HttpStatus.CREATED).body(addedFeedback);
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    @DeleteMapping("/didactic/feedback")
    public ResponseEntity<?> deleteFeedback(@RequestParam Long studentId, @RequestParam Long profId) {
        if(studentId == null && profId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(profId == null) {
            var feedbackList = repository.findAllByIdIdStud(studentId).stream().filter(f -> service.authorizeFeedbackOperation(person, f.getId())).toList();
            if(feedbackList.isEmpty())
                throw new FeedbackFromStudentNotFound(studentId);
            repository.deleteAllByIdIdStud(studentId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        if(studentId == null) {
            var feedbackList = repository.findAllByIdIdProf(profId).stream().filter(f -> service.authorizeFeedbackOperation(person, f.getId())).toList();
            if(feedbackList.isEmpty())
                throw new FeedbackForProfessorNotFound(profId);
            repository.deleteAllByIdIdProf(profId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        FeedbackCompositeKey key = new FeedbackCompositeKey(studentId, profId);
        if(!service.authorizeFeedbackOperation(person, key))
            throw new UnauthorizedOperationException("Only students can delete feedbacks");

        if (!repository.existsById(key)) {
            throw new FeedbackNotFound(studentId, profId);
        }
        return ResponseEntity.ok().body(repository.findAllById(List.of(key)));
    }
}
