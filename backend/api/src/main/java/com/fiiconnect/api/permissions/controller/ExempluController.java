package com.fiiconnect.api.permissions.controller;

import com.fiiconnect.api.permissions.model.ObiectExemplu;
import com.fiiconnect.api.permissions.repository.ObiectExempluRepository;
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


}
