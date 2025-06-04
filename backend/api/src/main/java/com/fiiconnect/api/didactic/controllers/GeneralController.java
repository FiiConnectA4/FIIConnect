package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.models.GlobalConstant;
import com.fiiconnect.api.didactic.repositories.GlobalConstantRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
public class GeneralController {
    private final StudentRepository studentRepository;
    private final GlobalConstantRepository globalConstantRepository;

    public GeneralController(StudentRepository studentRepository, GlobalConstantRepository globalConstantRepository) {
        this.studentRepository = studentRepository;
        this.globalConstantRepository = globalConstantRepository;
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

    @GetMapping("/didactic/globals/{name}")
    public GlobalConstant queryConstant(@PathVariable String name)
    {
        return globalConstantRepository.findByName(name);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/didactic/globals/{name}")
    public GlobalConstant setConstant(@PathVariable String name, @RequestParam String value)
    {
        GlobalConstant constant = globalConstantRepository.findByName(name);
        if(constant == null)
            constant = new GlobalConstant(name, value);
        else
            constant.setValue(value);

        globalConstantRepository.save(constant);
        return constant;
    }
}
