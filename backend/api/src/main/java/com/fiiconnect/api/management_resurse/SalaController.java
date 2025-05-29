package com.fiiconnect.api.management_resurse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/sali","/harta"})
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
        List<Sala> salaList = salaRepository.findByNume(nume);

        return salaList.stream().map(sala -> new SalaDTO(
                sala.getCapacitate(),
                sala.getDotari(),
                sala.getObservatii(),
                sala.getLocatie(),
                sala.getRezervat(),
                sala.getProfesorRezervare(),
                sala.getOraStartRezervare(),
                sala.getOraEndRezervare()
        )).collect(Collectors.toList());

    }

    @PutMapping("/{id}")
    public ResponseEntity<Sala> updateSala(@PathVariable Long id, @RequestBody Sala sala) {
        Sala existingSala = salaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala not found with id " + id));

        // Actualizări standard
        if (sala.getNume() != null) existingSala.setNume(sala.getNume());
        if (sala.getCapacitate() != null) existingSala.setCapacitate(sala.getCapacitate());
        if (sala.getTipSala() != null) existingSala.setTipSala(sala.getTipSala());
        if (sala.getLocatie() != null) existingSala.setLocatie(sala.getLocatie());
        if (sala.getImagineUrl() != null) existingSala.setImagineUrl(sala.getImagineUrl());
        if (sala.getDotari() != null) existingSala.setDotari(sala.getDotari());
        if (sala.getObservatii() != null) existingSala.setObservatii(sala.getObservatii());

        // Actualizări pentru rezervare
        if (sala.getRezervat() != null) existingSala.setRezervat(sala.getRezervat());
        if (sala.getProfesorRezervare() != null) existingSala.setProfesorRezervare(sala.getProfesorRezervare());
        if (sala.getOraStartRezervare() != null) existingSala.setOraStartRezervare(sala.getOraStartRezervare());
        if (sala.getOraEndRezervare() != null) existingSala.setOraEndRezervare(sala.getOraEndRezervare());

        Sala updatedSala = salaRepository.save(existingSala);
        return ResponseEntity.ok(updatedSala);
    }


    @PutMapping("/{nume}")
    public ResponseEntity<Sala> updateSala(@PathVariable String nume, @RequestBody Sala sala) {
        List<Sala> salaList = salaRepository.findByNume(nume);
        Sala existingSala = salaList.getFirst();
        // Actualizări standard
        if (sala.getNume() != null) existingSala.setNume(sala.getNume());
        if (sala.getCapacitate() != null) existingSala.setCapacitate(sala.getCapacitate());
        if (sala.getTipSala() != null) existingSala.setTipSala(sala.getTipSala());
        if (sala.getLocatie() != null) existingSala.setLocatie(sala.getLocatie());
        if (sala.getImagineUrl() != null) existingSala.setImagineUrl(sala.getImagineUrl());
        if (sala.getDotari() != null) existingSala.setDotari(sala.getDotari());
        if (sala.getObservatii() != null) existingSala.setObservatii(sala.getObservatii());

        // Actualizări pentru rezervare
        if (sala.getRezervat() != null) existingSala.setRezervat(sala.getRezervat());
        if (sala.getProfesorRezervare() != null) existingSala.setProfesorRezervare(sala.getProfesorRezervare());
        if (sala.getOraStartRezervare() != null) existingSala.setOraStartRezervare(sala.getOraStartRezervare());
        if (sala.getOraEndRezervare() != null) existingSala.setOraEndRezervare(sala.getOraEndRezervare());

        Sala updatedSala = salaRepository.save(existingSala);
        return ResponseEntity.ok(updatedSala);
    }

}