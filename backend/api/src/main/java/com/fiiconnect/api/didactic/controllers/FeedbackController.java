package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.FeedbackForProfessorNotFound;
import com.fiiconnect.api.didactic.exceptions.FeedbackFromStudentNotFound;
import com.fiiconnect.api.didactic.exceptions.FeedbackNotFound;
import com.fiiconnect.api.didactic.models.Feedback;
import com.fiiconnect.api.didactic.models.FeedbackCompositeKey;
import com.fiiconnect.api.didactic.repositories.FeedbackRepository;
import jakarta.websocket.server.PathParam;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
public class FeedbackController {
    private final FeedbackRepository repository;

    @GetMapping("/didactic/feedback")
    public List<Feedback> getFeedback() {
        return repository.findAll();
    }

    @GetMapping("/didactic/feedback/")
    public ResponseEntity<?> getFeedbackByDidacticId(@RequestParam Long studentId, @RequestParam Long profId) {
        if(studentId == null && profId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if(profId == null) {
            var feedbackList = repository.findAllByIdIdStud(studentId);
            if(feedbackList.isEmpty())
                throw new FeedbackFromStudentNotFound(studentId);
            return ResponseEntity.status(HttpStatus.OK).body(
                    feedbackList
            );
        }
        if(studentId == null) {
            var feedbackList = repository.findAllByIdIdProf(profId);
            if(feedbackList.isEmpty())
                throw new FeedbackForProfessorNotFound(profId);
            return ResponseEntity.status(HttpStatus.OK).body(
                    feedbackList
            );
        }
        FeedbackCompositeKey key = new FeedbackCompositeKey(studentId, profId);
        if (!repository.existsById(key)) {
            throw new FeedbackNotFound(studentId, profId);
        }
        return ResponseEntity.ok().body(repository.findAllById(List.of(key)));
    }

    @PostMapping("/didactic/feedback")
    public ResponseEntity<?> createFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(feedback));
    }

    @DeleteMapping("/didactic/feedback")
    public ResponseEntity<?> deleteFeedback(@RequestParam Long studentId, @RequestParam Long profId) {
        if(studentId == null && profId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if(profId == null) {
            var feedbackList = repository.findAllByIdIdStud(studentId);
            if(feedbackList.isEmpty())
                throw new FeedbackFromStudentNotFound(studentId);
            repository.deleteAllByIdIdStud(studentId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        if(studentId == null) {
            var feedbackList = repository.findAllByIdIdProf(profId);
            if(feedbackList.isEmpty())
                throw new FeedbackForProfessorNotFound(profId);
            repository.deleteAllByIdIdProf(profId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        FeedbackCompositeKey key = new FeedbackCompositeKey(studentId, profId);
        if (!repository.existsById(key)) {
            throw new FeedbackNotFound(studentId, profId);
        }
        return ResponseEntity.ok().body(repository.findAllById(List.of(key)));
    }
}
