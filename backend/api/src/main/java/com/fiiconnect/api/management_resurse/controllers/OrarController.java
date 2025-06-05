package com.fiiconnect.api.management_resurse.controllers;

import com.fiiconnect.api.management_resurse.dtos.OrarDTO;
import com.fiiconnect.api.management_resurse.models.Orar;
import com.fiiconnect.api.management_resurse.repositories.OrarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.CourseRepository;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/orar", "/orar-secretariat"})
public class OrarController {

    @Autowired
    private OrarRepository repository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CourseRepository courseRepository;


    @GetMapping
    public List<Orar> toateOrele() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Orar getOrarById(@PathVariable Integer id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping
    public Orar adaugaOrar(@RequestBody Orar orar) {
        return repository.save(orar);
    }

    @DeleteMapping("/{id}")
    public void stergeOrar(@PathVariable Integer id) {
        repository.deleteById(id);
    }

    @GetMapping("/discipline")
    public List<Course> getDiscipline() {
        // Obține lista unică de discipline din baza de date
        return repository.findAll().stream()
                .map(Orar::getDisciplina)
                .filter(disciplina -> disciplina != null)
                .distinct()
                .collect(Collectors.toList());
    }

    @GetMapping("/profesori")
    public List<Professor> getProfesori() {
        // Obține lista unică de profesori din baza de date
        return repository.findAll().stream()
                .map(Orar::getProfesor)
                .filter(profesor -> profesor != null)
                .distinct()
                .collect(Collectors.toList());
    }

    @GetMapping({"/studenti/{an}/{grupa}", "/grupa/{an}/{grupa}"})
    public List<OrarDTO> getOrarByAnAndGrupa(@PathVariable String an, @PathVariable String grupa) {
        List<Orar> orarList = repository.findByAnAndGrupa(an, grupa);

        System.out.println("📋 Am găsit " + orarList.size() + " înregistrări pentru anul " + an + ", grupa " + grupa);

        for (Orar orar : orarList) {
            if (orar.getOraStart() == null || orar.getOraEnd() == null) {
                System.out.println("⚠️ Ora Start sau End este null pentru: " + orar);
            }
        }


        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));


            return new OrarDTO(
                    orar.getZi(),
                    oraStart + " - " + oraEnd,
                    orar.getDisciplina().getTitle(),
                    orar.getTip(),
                    orar.getGrupa(),
                    orar.getSala(),
                    orar.getProfesor().getFirstName() + " " + orar.getProfesor().getLastName(),
                    orar.getAn(),
                    orar.getId()
            );
        }).collect(Collectors.toList());
    }




    @GetMapping("/profesor/{id}")
    public List<OrarDTO> getOrarByProfesorId(@PathVariable Long id) {
        Professor profesor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profesorul nu a fost găsit cu ID: " + id));

        List<Orar> orarList = repository.findByProfesor(profesor);

        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));

            return new OrarDTO(
                    orar.getZi(),
                    oraStart + " - " + oraEnd,
                    orar.getDisciplina().getTitle(),
                    orar.getTip(),
                    orar.getGrupa(),
                    orar.getSala(),
                    profesor.getFirstName() + " " + profesor.getLastName(),
                    orar.getAn(),
                    orar.getId()
            );
        }).collect(Collectors.toList());
    }


    @GetMapping("/sala/{sala}")
    public List<OrarDTO> getOrarBySala(@PathVariable String sala) {
        System.out.println("Căutăm orar pentru sala: " + sala);
        List<Orar> orarList = repository.findBySala(sala);
        System.out.println("Număr de orare găsite: " + orarList.size());
        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            return new OrarDTO(
                    orar.getZi(),
                    oraStart + " - " + oraEnd,
                    (orar.getDisciplina() != null ? orar.getDisciplina().getTitle() : "Rezervat"),

                    orar.getTip(),
                    orar.getGrupa(),
                    orar.getSala(),
                    orar.getProfesor().getFirstName() + " " + orar.getProfesor().getLastName(),
                    orar.getAn(),
                    orar.getId()
            );
        }).collect(Collectors.toList());
    }

    @GetMapping("/disciplina/{disciplinaNume}")
    public List<OrarDTO> getOrarByDisciplina(@PathVariable String disciplinaNume) {
        System.out.println("Căutăm orar pentru disciplina: " + disciplinaNume);
        Course disciplina = courseRepository.findAll().stream()
                .filter(c -> c.getTitle().equalsIgnoreCase(disciplinaNume))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Disciplina nu a fost găsită: " + disciplinaNume));
        List<Orar> orarList = repository.findByDisciplina(disciplina);
        System.out.println("Număr de orare găsite: " + orarList.size());
        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            return new OrarDTO(
                    orar.getZi(),
                    oraStart + " - " + oraEnd,
                    (orar.getDisciplina() != null ? orar.getDisciplina().getTitle() : "Rezervat"),
                    orar.getTip(),
                    orar.getGrupa(),
                    orar.getSala(),
                    orar.getProfesor().getFirstName() + " " + orar.getProfesor().getLastName(),
                    orar.getAn(),
                    orar.getId()
            );
        }).collect(Collectors.toList());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Orar> updateOrar(@PathVariable Integer id, @RequestBody Orar orar) {
        // Găsește obiectul de tip Orar pe baza ID-ului
        Orar existingOrar = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orar not found with id " + id));

        // Actualizează numai unde informațiile nu sunt null
        if (orar.getZi() != null) {
            existingOrar.setZi(orar.getZi());
        }
        if (orar.getOraStart() != null) {
            existingOrar.setOraStart(orar.getOraStart());
        }
        if (orar.getOraEnd() != null) {
            existingOrar.setOraEnd(orar.getOraEnd());
        }
        if (orar.getDisciplina() != null) {
            existingOrar.setDisciplina(orar.getDisciplina());
        }
        if (orar.getTip() != null) {
            existingOrar.setTipActivitate(orar.getTip());
        }
        if (orar.getGrupa() != null) {
            existingOrar.setGrupa(orar.getGrupa());
        }
        if (orar.getSala() != null) {
            existingOrar.setSala(orar.getSala());
        }
        if (orar.getProfesor() != null) {
            existingOrar.setProfesor(orar.getProfesor());
        }

        if (orar.getAn() != null) {
            existingOrar.setAn(orar.getAn());
        }

        // Salvează
        Orar updatedOrar = repository.save(existingOrar);

        return ResponseEntity.ok(updatedOrar);
    }

}