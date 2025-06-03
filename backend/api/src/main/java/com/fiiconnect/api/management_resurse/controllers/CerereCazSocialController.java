package com.fiiconnect.api.management_resurse.controllers;

import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;

import com.fiiconnect.api.management_resurse.dtos.CerereCazSocialDTO;
import com.fiiconnect.api.management_resurse.viewdtos.CerereCazSocialViewDTO;
import com.fiiconnect.api.management_resurse.models.CerereCazSocial;
import com.fiiconnect.api.management_resurse.repositories.CerereCazSocialRepository;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import org.springframework.http.MediaType;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cereri/caz-social")
public class CerereCazSocialController {

    private final CerereCazSocialRepository repository;
    private final StudentRepository studentRepository;

    public CerereCazSocialController(CerereCazSocialRepository repository, StudentRepository studentRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
    }

    // POST: creare cerere caz social
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CerereCazSocialDTO dto) {
        Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student inexistent");

        CerereCazSocial cerere = new CerereCazSocial();
        cerere.setStudent(studentOpt.get());
        cerere.setStatus(dto.getStatus());
        cerere.setComentariu(dto.getComentariu());
        cerere.setDataTrimitere(dto.getDataTrimitere());
        cerere.setJustificare(dto.getJustificare());
        cerere.setDocumentePath(dto.getDocumentePath());

        return ResponseEntity.ok(repository.save(cerere));
    }

    // GET: cerere după ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

@GetMapping("/{id}/document")
public ResponseEntity<?> getDocument(@PathVariable Integer id) {
    Optional<CerereCazSocial> opt = repository.findById(id);
    if (opt.isEmpty()) return ResponseEntity.notFound().build();

    CerereCazSocial cerere = opt.get();
    String path = cerere.getDocumentePath(); // presupunem că e calea completă sau relativă

    if (path == null || path.isBlank()) {
        return ResponseEntity.badRequest().body("Documentul nu este disponibil.");
    }

    File file = new File(path);
    if (!file.exists()) {
        return ResponseEntity.notFound().build();
    }

    try {
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=" + file.getName())
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    } catch (FileNotFoundException e) {
        return ResponseEntity.status(500).body("Eroare la deschiderea fișierului.");
    }
}



    // GET: cereri după student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CerereCazSocial>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(
                repository.findAll().stream()
                        .filter(c -> c.getStudent().getId().equals(studentId))
                        .toList()
        );
    }

    @GetMapping("/toate")
public ResponseEntity<List<CerereCazSocialViewDTO>> getAllView() {
    List<CerereCazSocialViewDTO> result = repository.findAll().stream().map(c -> {
        CerereCazSocialViewDTO dto = new CerereCazSocialViewDTO();
        dto.setId(c.getId());
        dto.setStatus(c.getStatus());
        dto.setComentariu(c.getComentariu());
        dto.setDataTrimitere(c.getDataTrimitere());
        dto.setTip(c.getTip());
        dto.setDocumentePath(c.getDocumentePath());
        dto.setJustificare(c.getJustificare());

        var student = c.getStudent();
        dto.setStudentId(student.getId());
        dto.setNume(student.getLastName());
        dto.setPrenume(student.getFirstName());
        dto.setRegNumber(student.getRegNumber());
        dto.setGrupa(student.getFacultyGroup());
        dto.setAn(student.getYear());

        return dto;
    }).toList();

    return ResponseEntity.ok(result);
}


    // PUT: actualizare status și comentariu
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id,
                                          @RequestParam String status,
                                          @RequestParam(required = false) String comentariu) {
        Optional<CerereCazSocial> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        CerereCazSocial cerere = opt.get();
        cerere.setStatus(status);
        cerere.setComentariu(comentariu);
        return ResponseEntity.ok(repository.save(cerere));
    }

    // DELETE: ștergere cerere
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
