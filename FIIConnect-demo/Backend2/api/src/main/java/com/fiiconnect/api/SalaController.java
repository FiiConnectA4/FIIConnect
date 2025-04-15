package com.fiiconnect.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sali")
public class SalaController {

    @Autowired
    private SalaRepository salaRepository;

    @GetMapping
    public List<Sala> getAll() {
        return salaRepository.findAll();
    }

    @PostMapping
    public Sala create(@RequestBody Sala sala) {
        return salaRepository.save(sala);
    }

    @GetMapping("/id/{id}")
    public Sala getById(@PathVariable Long id) {
        return salaRepository.findById(id).orElse(null);
    }

    @GetMapping("/nume/{nume}")
    public List<SalaDTO> getSalabyNume(@PathVariable String nume) { 
        // Obținem lista de orare din baza de date
        List<Sala> SalaList = salaRepository.findByNume(nume);

        // Mapează entitățile Orar în OrarDTO, fără a include frecventa
        return SalaList.stream().map(sala -> {
            // Creăm obiectul DTO
            return new SalaDTO(
                sala.getDotari(),
                sala.getObservatii(),
                sala.getLocatie()
            );
        }).collect(Collectors.toList());
    }
}