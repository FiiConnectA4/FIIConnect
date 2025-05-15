package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping({"/cereri/bursa-sociala","/cereri-secretariat/bursa-sociala"})
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
        Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student inexistent");

        CerereBursaSociala cerere = new CerereBursaSociala();
        cerere.setStudent(studentOpt.get());
        cerere.setStatus(dto.getStatus());
        cerere.setComentariu(dto.getComentariu());
        cerere.setDataTrimitere(dto.getDataTrimitere());
        cerere.setAnStudent(dto.getAnStudent());
        cerere.setFacultate(dto.getFacultate());
        cerere.setDosarPath(dto.getDosarPath());

        return ResponseEntity.ok(repository.save(cerere));
    }

    @GetMapping
    public List<CerereBursaSociala> toateCererileBursaSociala() {
        return repository.findAll(); 
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
