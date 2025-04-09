package com.fiiconnect.api.orar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orar")
public class OrarController {

    @Autowired
    private OrarRepository repository;

    @GetMapping
    public List<com.fiiconnect.api.orar.Orar> toateOrele() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public com.fiiconnect.api.orar.Orar getOrarById(@PathVariable Integer id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping
    public com.fiiconnect.api.orar.Orar adaugaOrar(@RequestBody com.fiiconnect.api.orar.Orar orar) {
        return repository.save(orar);
    }

    @DeleteMapping("/{id}")
    public void stergeOrar(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
