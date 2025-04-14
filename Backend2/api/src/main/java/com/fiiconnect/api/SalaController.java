package com.fiiconnect.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public Sala getById(@PathVariable Long id) {
        return salaRepository.findById(id).orElse(null);
    }
}
