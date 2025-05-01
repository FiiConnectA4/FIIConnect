package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.repositories.CourseMaterialRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class CourseMaterialService {
    private final CourseMaterialRepository repository;
    private final SftpService sftpService;

    public CourseMaterialService(CourseMaterialRepository repository, SftpService sftpService) {
        this.repository = repository;
        this.sftpService = sftpService;
    }

    public void deleteMaterial(CourseMaterial material) throws IOException {
        sftpService.deleteFile("faculty_files/didactic/course-" + material.getIdCourse() + "/materials/" + material.getFilename(), false);
        repository.delete(material);
    }
}
