package com.fiiconnect.api.management_resurse.controllers;


import com.fiiconnect.api.management_resurse.dtos.RezervareDTO;
import com.fiiconnect.api.management_resurse.models.Orar;
import com.fiiconnect.api.management_resurse.models.TimeSlot;
import com.fiiconnect.api.management_resurse.repositories.OrarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.CourseRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import java.util.Optional;


@RestController
@RequestMapping("/harta")
public class HartaController {

    private final OrarRepository repository;

    public HartaController(OrarRepository repository) {
        this.repository = repository;
    }

    
    @GetMapping("/sala-libera")
    public List<String> getIntervaleLibereSala(
            @RequestParam String sala,
            @RequestParam String zi) {

        List<Orar> ocupate = repository.findBySalaAndZi(sala, zi);

        
        List<TimeSlot> toateIntervalele = TimeSlot.generateDefaultSlots();

        List<TimeSlot> ocupateSlots = ocupate.stream()
                .map(orar -> new TimeSlot(orar.getOraStart(), orar.getOraEnd()))
                .collect(Collectors.toList());

        List<TimeSlot> libere = TimeSlot.excludeSlots(toateIntervalele, ocupateSlots);

        return libere.stream()
                .map(TimeSlot::toString)
                .collect(Collectors.toList());
    }

    // POST:   rezervă un interval (sala, zi, ora start și ora end)
    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CourseRepository courseRepository; // dacă vei avea nevoie pentru disciplina
    @PostMapping("/rezerva")
    public ResponseEntity<String> rezervaOra(@RequestBody RezervareDTO rezervare) {

        List<Orar> ocupate = repository.findBySalaAndZi(rezervare.getSala(), rezervare.getZi());

        TimeSlot intervalRezervare = new TimeSlot(rezervare.getOraStart(), rezervare.getOraEnd());

        boolean intersecteaza = ocupate.stream()
                .anyMatch(orar -> new TimeSlot(orar.getOraStart(), orar.getOraEnd()).overlapsWith(intervalRezervare));

        if (intersecteaza) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Intervalul este deja rezervat.");
        }

        // Convertim Integer in Long
        Long profesorIdLong = rezervare.getProfesorId().longValue();

        // Caut profesorul dupa id (Long)
        Optional<Professor> profesorOpt = professorRepository.findById(profesorIdLong);
        if (profesorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Profesorul nu a fost gasit.");
        }

        Orar rezervareNoua = new Orar();
        rezervareNoua.setSala(rezervare.getSala());
        rezervareNoua.setZi(rezervare.getZi());
        rezervareNoua.setOraStart(rezervare.getOraStart());
        rezervareNoua.setOraEnd(rezervare.getOraEnd());
        rezervareNoua.setProfesor(profesorOpt.get());

        // Dacă ai nevoie să setezi disciplina, grupa, tip, etc, adaugă aici

        repository.save(rezervareNoua);

        return ResponseEntity.ok("Rezervarea a fost realizată cu succes.");
    }

}