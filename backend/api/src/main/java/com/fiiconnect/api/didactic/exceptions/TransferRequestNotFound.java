package com.fiiconnect.api.didactic.exceptions;

import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;

public class TransferRequestNotFound extends RuntimeException {
    public TransferRequestNotFound(StudCourseCompositeKey id) {
      super("Transfer request not found: " + id);
    }
}
