package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.auth_userMgmt.dtos.personDTO.PersonInfoDTO;
import com.fiiconnect.api.didactic.models.FeedbackCompositeKey;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {
    public boolean allowFeedbackViewing(PersonInfoDTO person, FeedbackCompositeKey idFeedback)
    {
        if(person.role().equals("ROLE_ADMIN"))
            return true;
        if(person.role().equals("ROLE_PROFESOR"))
            return idFeedback.getIdProf().equals(person.professor().id());

        //ROLE_STUDENT
        return idFeedback.getIdStud().equals(person.student().id());
    }

    public boolean authorizeFeedbackOperation(PersonInfoDTO person, FeedbackCompositeKey idFeedback)
    {
        if(person.role().equals("ROLE_ADMIN"))
            return true;
        if(person.role().equals("ROLE_PROFESOR"))
            return false;

        //ROLE_STUDENT
        return idFeedback.getIdStud().equals(person.student().id());
    }
}
