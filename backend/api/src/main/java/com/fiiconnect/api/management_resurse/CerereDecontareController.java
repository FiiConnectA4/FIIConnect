package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/secretariat/cerere-decontare")
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

        System.out.println("📩 ID student primit: " + dto.getStudentId());

        if (studentRepository.findAll().isEmpty()) {
            System.out.println("❌ Repository gol");
        } else {
            System.out.println("✅ Repository conține studenți");
        }


        Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
        if (studentOpt.isEmpty())
            return ResponseEntity.badRequest().body("Student inexistent");

        Student student = studentOpt.get();

        CerereDecontare cerere = new CerereDecontare();
        cerere.setStudent(student); // Aici e cheia!
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

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CerereDecontare>> getCereriByStudent(@PathVariable Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(repository.findAll().stream()
                .filter(c -> c.getStudent().getId().equals(studentId))
                .toList());
    }


    @GetMapping("/view")
public ResponseEntity<List<CerereDecontareViewDTO>> getAllView() {
    List<CerereDecontareViewDTO> result = repository.findAll().stream().map(c -> {
        CerereDecontareViewDTO dto = new CerereDecontareViewDTO();
        dto.setId(c.getId());
        dto.setComentariu(c.getComentariu());
        dto.setContinut(c.getContinut());
        dto.setDataTrimitere(c.getDataTrimitere());
        dto.setStatus(c.getStatus());
        dto.setTip(c.getTip());

        dto.setChitantaAbonamentPath(c.getChitantaAbonamentPath());
        dto.setDataAchizitie(c.getDataAchizitie());
        dto.setDovadaPlataPath(c.getDovadaPlataPath());
        dto.setDurataAbonament(c.getDurataAbonament());
        dto.setIban(c.getIban());
        dto.setNumarBonFiscal(c.getNumarBonFiscal());
        dto.setNumarCardTransport(c.getNumarCardTransport());
        dto.setProcentSolicitat(c.getProcentSolicitat());
        dto.setSerieBonFiscal(c.getSerieBonFiscal());
        dto.setSerieCardTransport(c.getSerieCardTransport());
        dto.setTipAbonament(c.getTipAbonament());

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
