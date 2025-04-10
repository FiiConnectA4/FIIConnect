package com.fiiconnect.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orar")
public class OrarController {

    @Autowired
    private OrarRepository repository;

    @GetMapping
    public List<com.fiiconnect.api.Orar> toateOrele() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public com.fiiconnect.api.Orar getOrarById(@PathVariable Integer id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping
    public com.fiiconnect.api.Orar adaugaOrar(@RequestBody com.fiiconnect.api.Orar orar) {
        return repository.save(orar);
    }

    @DeleteMapping("/{id}")
    public void stergeOrar(@PathVariable Integer id) {
        repository.deleteById(id);
    }

    // Endpoint pentru a obține orarul pe baza grupei
    @GetMapping("/grupa/{grupa}")
    public List<Orar> getOrarByGrupa(@PathVariable String grupa) {
        return repository.findByGrupa(grupa);
    }

    // Endpoint pentru a obține orarul pe baza numelui profesorului
    @GetMapping("/profesor/{profesor}")
    public List<Orar> getOrarByProfesor(@PathVariable String profesor) {
        return repository.findByProfesor(profesor);
    }
}