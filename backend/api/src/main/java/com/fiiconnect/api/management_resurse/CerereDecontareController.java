package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping({"/cereri/cerere-decontare","/cereri-secretariat/cerere-decontare"})
public class CerereDecontareController {

    private final CerereDecontareRepository repository;
    private final StudentRepository studentRepository;

    public CerereDecontareController(CerereDecontareRepository repository, StudentRepository studentRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
    }

    @PostMapping
    public ResponseEntity<?> createCerere(@RequestBody CerereDecontareDTO dto) {
        if (dto.getStudentId() == null)
            return ResponseEntity.badRequest().body("studentId lipsă");

        Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
        if (studentOpt.isEmpty())
            return ResponseEntity.badRequest().body("Student inexistent");

        Student student = studentOpt.get();

        CerereDecontare cerere = new CerereDecontare();
        cerere.setStudent(student);
        cerere.setStatus(dto.getStatus());
        cerere.setComentariu(dto.getComentariu());
        cerere.setDataTrimitere(dto.getDataTrimitere());
        cerere.setIban(dto.getIban());
        cerere.setDataAchizitie(dto.getDataAchizitie());
        cerere.setTipAbonament(dto.getTipAbonament());
        cerere.setSerieCardTransport(dto.getSerieCardTransport());
        cerere.setNumarCardTransport(dto.getNumarCardTransport());
        cerere.setSerieBonFiscal(dto.getSerieBonFiscal());
        cerere.setNumarBonFiscal(dto.getNumarBonFiscal());
        cerere.setChitantaAbonamentPath(dto.getChitantaAbonamentPath());
        cerere.setDovadaPlataPath(dto.getDovadaPlataPath());
        cerere.setDurataAbonament(dto.getDurataAbonament());
        cerere.setProcentSolicitat(dto.getProcentSolicitat());

        return ResponseEntity.ok(repository.save(cerere));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCerereById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<CerereDecontare> toateCererileDecontare() {
        return repository.findAll(); 
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CerereDecontare>> getCereriByStudent(@PathVariable Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(repository.findAll().stream()
                .filter(c -> c.getStudent().getId().equals(studentId))
                .toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id,
                                          @RequestParam String status,
                                          @RequestParam(required = false) String comentariu) {
        Optional<CerereDecontare> cerereOpt = repository.findById(id);
        if (cerereOpt.isEmpty()) return ResponseEntity.notFound().build();

        CerereDecontare cerere = cerereOpt.get();
        cerere.setStatus(status);
        cerere.setComentariu(comentariu);
        return ResponseEntity.ok(repository.save(cerere));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCerere(@PathVariable Integer id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
