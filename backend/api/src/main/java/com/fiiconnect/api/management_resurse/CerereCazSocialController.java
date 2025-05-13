package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // GET: cereri după student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CerereCazSocial>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(
                repository.findAll().stream()
                        .filter(c -> c.getStudent().getId().equals(studentId))
                        .toList()
        );
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
