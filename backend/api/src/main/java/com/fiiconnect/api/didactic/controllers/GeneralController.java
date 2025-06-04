package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Set;

@RestController
public class GeneralController {
    private final StudentRepository studentRepository;

    public GeneralController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/didactic/advanceYear")
    public Set<Long> advanceYear()
    {
        Set<Long> eligibleStudentIds = new HashSet<>();
        for(int year = 1; year <= 3; year++)
            eligibleStudentIds.addAll(studentRepository.findStudentIdsEligibleForYearAdvance((year-1)*60+30));

        studentRepository.executeYearAdvance(eligibleStudentIds);

        return eligibleStudentIds;
    }
}
