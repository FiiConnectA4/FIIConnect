package com.fiiconnect.api.management_resurse.controllers;

import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.management_resurse.dtos.CerereBursaSocialaDTO;
import com.fiiconnect.api.management_resurse.viewdtos.CerereBursaSocialaViewDTO;
import com.fiiconnect.api.management_resurse.models.CerereBursaSociala;
import com.fiiconnect.api.management_resurse.repositories.CerereBursaSocialaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cereri/bursa-sociala")
public class CerereBursaSocialaController {

    private final CerereBursaSocialaRepository repository;
    private final StudentRepository studentRepository;

    public CerereBursaSocialaController(CerereBursaSocialaRepository repository, StudentRepository studentRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
    }

    // POST: creare cerere bursă
   @PostMapping
public ResponseEntity<?> create(@RequestBody CerereBursaSocialaDTO dto) {
    System.out.println("Cerere primita DTO: " + dto);
    Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
    
    if (studentOpt.isEmpty()) {
        System.out.println("Student inexistent cu id: " + dto.getStudentId());
        return ResponseEntity.badRequest().body("Student inexistent");
    }

    try {
        CerereBursaSociala cerere = new CerereBursaSociala();
        cerere.setStudent(studentOpt.get());
        cerere.setStatus(dto.getStatus());
        cerere.setComentariu(dto.getComentariu());
        cerere.setDataTrimitere(dto.getDataTrimitere());
        cerere.setAnStudent(dto.getAnStudent());
        cerere.setFacultate(dto.getFacultate());
        cerere.setDosarPath(dto.getDosarPath());

        CerereBursaSociala saved = repository.save(cerere);
        System.out.println("Cerere salvata cu id: " + saved.getId());

        return ResponseEntity.ok(saved);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Eroare la salvare cerere: " + e.getMessage());
    }
}


    // GET: cerere după ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: cereri după student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CerereBursaSociala>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(
                repository.findAll().stream()
                        .filter(c -> c.getStudent().getId().equals(studentId))
                        .toList()
        );
    }

    @GetMapping("/toate")
public ResponseEntity<List<CerereBursaSocialaViewDTO>> getAllView() {
    List<CerereBursaSocialaViewDTO> result = repository.findAll().stream().map(c -> {
        CerereBursaSocialaViewDTO dto = new CerereBursaSocialaViewDTO();
        dto.setId(c.getId());
        dto.setStatus(c.getStatus());
        dto.setComentariu(c.getComentariu());
        dto.setDataTrimitere(c.getDataTrimitere());
        dto.setTip(c.getTip());
        dto.setAnStudent(c.getAnStudent());
        dto.setDosarPath(c.getDosarPath());
        dto.setFacultate(c.getFacultate());

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
        Optional<CerereBursaSociala> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        CerereBursaSociala cerere = opt.get();
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
