package com.fiiconnect.api.didactic.exceptions;

import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;

public class TransferRequestAlreadyRegisteredException extends RuntimeException {
    public TransferRequestAlreadyRegisteredException(StudCourseCompositeKey id) {
        super("Transfer request already registered - idCourse: " + id.getIdCourse() + " idStud: " + id.getIdStud());
    }
}
