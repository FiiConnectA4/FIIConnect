package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.management_resurse.CerereAdeverintaCamin;
import com.fiiconnect.api.management_resurse.CerereAdeverintaCaminDTO;
import com.fiiconnect.api.management_resurse.CerereAdeverintaCaminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cereri/adeverinta-camin")
public class CerereAdeverintaCaminController {

    private final CerereAdeverintaCaminRepository repository;
    private final StudentRepository studentRepository;

    public CerereAdeverintaCaminController(CerereAdeverintaCaminRepository repository, StudentRepository studentRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
    }

    // POST: creare cerere nouă
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CerereAdeverintaCaminDTO dto) {
        Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student inexistent");

        CerereAdeverintaCamin cerere = new CerereAdeverintaCamin();
        cerere.setStudent(studentOpt.get());
        cerere.setStatus(dto.getStatus());
        cerere.setComentariu(dto.getComentariu());
        cerere.setDataTrimitere(dto.getDataTrimitere());
        cerere.setCamin(dto.getCamin());

        return ResponseEntity.ok(repository.save(cerere));
    }

    // GET: cerere după ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: toate cererile unui student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CerereAdeverintaCamin>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(
                repository.findAll().stream()
                        .filter(c -> c.getStudent().getId().equals(studentId))
                        .toList()
        );
    }


    @GetMapping("/toate")
public ResponseEntity<List<CerereAdeverintaCaminViewDTO>> getAllView() {
    List<CerereAdeverintaCaminViewDTO> result = repository.findAll().stream().map(c -> {
        var dto = new CerereAdeverintaCaminViewDTO();
        dto.setId(c.getId());
        dto.setStatus(c.getStatus());
        dto.setComentariu(c.getComentariu());
        dto.setDataTrimitere(c.getDataTrimitere());
        dto.setCamin(c.getCamin());
        dto.setTip(c.getTip());

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
        Optional<CerereAdeverintaCamin> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        CerereAdeverintaCamin cerere = opt.get();
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
