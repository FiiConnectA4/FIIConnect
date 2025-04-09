package com.fiiconnect.api.modulexemplu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ExempluController {
    @Autowired
    private ObiectExempluRepository repository;

    ExempluController()
    {

    }

    @GetMapping("/test")
    String exemplu()
    {
        return "bravo!!";
    }

    @GetMapping("/test/{id}")
    ObiectExemplu cautare(@PathVariable Integer id)
    {
        return repository.findById(id).orElseThrow();
    }

    @GetMapping("/test/toate")
    List<ObiectExemplu> toate()
    {
        return repository.findAll();
    }

    @PutMapping("/altceva")
    String altceva(@RequestBody ObiectExemplu exemplu)
    {
        if(exemplu.getId() == 3)
            return ":)";
        else
            return ":(";
    }
}
