package com.fiiconnect.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @DeleteMapping("/{id}")
    public void stergeSala(@PathVariable Long id) {
        salaRepository.deleteById(id); 
    }

    @GetMapping("/nume/{nume}")
    public List<SalaDTO> getSalabyNume(@PathVariable String nume) { 
        // Obținem lista de orare din baza de date
        List<Sala> SalaList = salaRepository.findByNume(nume);

        
        return SalaList.stream().map(sala -> {
           
            return new SalaDTO(
                sala.getCapacitate(),
                sala.getDotari(),
                sala.getObservatii(),
                sala.getLocatie()
            );
        }).collect(Collectors.toList());
    }

@PutMapping("/{id}")
public ResponseEntity<com.fiiconnect.api.Sala> updateSala(@PathVariable Long id, @RequestBody com.fiiconnect.api.Sala sala){
    com.fiiconnect.api.Sala existingSala = salaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala not found with id " + id));
    
    if (sala.getNume() != null) {
        existingSala.setNume(sala.getNume());
    }

    if (sala.getCapacitate() != null) {
        existingSala.setCapacitate(sala.getCapacitate());
    }

    if (sala.getTipSala() != null) {
        existingSala.setTipSala(sala.getTipSala());
    }

    if (sala.getLocatie() != null) {
        existingSala.setLocatie(sala.getLocatie());
    }
    
    if (sala.getImagineUrl() != null) {
        existingSala.setImagineUrl(sala.getImagineUrl());
    }

    if (sala.getDotari() != null) {
        existingSala.setDotari(sala.getDotari());
    }

    if (sala.getObservatii() != null) {
        existingSala.setObservatii(sala.getObservatii());
    }

    com.fiiconnect.api.Sala updatedSala = salaRepository.save(existingSala);
    return ResponseEntity.ok(updatedSala);

}

}