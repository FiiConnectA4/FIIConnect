package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cereri/adeverinta-student")
public class CerereAdeverintaStudentController {

    private final CerereAdeverintaStudentRepository repository;
    private final StudentRepository studentRepository;

    public CerereAdeverintaStudentController(CerereAdeverintaStudentRepository repository, StudentRepository studentRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CerereAdeverintaStudentDTO dto) {
        var studentOpt = studentRepository.findById(dto.getStudentId());
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student inexistent");
        CerereAdeverintaStudent cerere = new CerereAdeverintaStudent();
        cerere.setStudent(studentOpt.get());
        cerere.setStatus(dto.getStatus());
        cerere.setDataTrimitere(dto.getDataTrimitere());
        cerere.setComentariu(dto.getComentariu());
        cerere.setAdresa(dto.getAdresa());
        return ResponseEntity.ok(repository.save(cerere));
    }

    @GetMapping
    public List<CerereAdeverintaStudent> toateCererileAdeverintaStudent() {
        return repository.findAll(); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CerereAdeverintaStudent>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(repository.findAll().stream()
                .filter(c -> c.getStudent().getId().equals(studentId)).toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id,
                                          @RequestParam String status,
                                          @RequestParam(required = false) String comentariu) {
        var opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        var cerere = opt.get();
        cerere.setStatus(status);
        cerere.setComentariu(comentariu);
        return ResponseEntity.ok(repository.save(cerere));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
