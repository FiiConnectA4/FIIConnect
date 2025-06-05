package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.InvalidArgumentsException;
import com.fiiconnect.api.didactic.exceptions.TextExceedingException;
import com.fiiconnect.api.didactic.exceptions.TransferRequestAlreadyRegisteredException;
import com.fiiconnect.api.didactic.exceptions.TransferRequestNotFound;
import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;
import com.fiiconnect.api.didactic.models.TransferRequest;
import com.fiiconnect.api.didactic.repositories.TransferRequestRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;


@AllArgsConstructor
@RestController
public class TransferRequestController {
    TransferRequestRepository repository;


    @GetMapping("/didactic/transfers")
    public List<TransferRequest> getAll() {
        return repository.findAll();
    }

    @GetMapping("didactic/transfer")
    public TransferRequest getById(@RequestParam Long idStud, @RequestParam Long idCourse) {
        if(idStud == null || idCourse == null) {
            throw new InvalidArgumentsException("Arguments provided idStud and idCourse are both required for transfer requests");
        }
        StudCourseCompositeKey compositeId = new StudCourseCompositeKey(idStud, idCourse);
        TransferRequest response = repository.findById(compositeId).orElse(null);
        if(response == null) {
            throw new TransferRequestNotFound(compositeId);
        }
        return response;
    }

    @PostMapping("didactic/transfer")
    @ResponseStatus(HttpStatus.CREATED)
    public TransferRequest create(@RequestBody TransferRequest transferRequest) {
        int textLength = transferRequest.getReasonText().length();
        if (textLength > 300) {
            throw new TextExceedingException(textLength, 300);
        }

        StudCourseCompositeKey id = transferRequest.getId();
        System.out.println(transferRequest.getId());
        if(id == null || id.getIdStud() == null || id.getIdCourse() == null) {
            throw new InvalidArgumentsException("Arguments provided idStud and idCourse are both required for transfer requests");
        }

        if (repository.existsById(id)) {
            throw new TransferRequestAlreadyRegisteredException(id);
        }

        if(transferRequest.getRequestDate() != null)
            transferRequest.setRequestDate(new Date()); // nu are sens sa adaugi un request cu o alta data
        return repository.save(transferRequest);
    }

    @DeleteMapping("didactic/transfer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestParam Long idStud, @RequestParam Long idCourse) {
        StudCourseCompositeKey compositeId = new StudCourseCompositeKey(idStud, idCourse);
        TransferRequest request = repository.findById(compositeId)
                .orElseThrow(() -> new TransferRequestNotFound(compositeId));
        repository.delete(request);
    }

}
