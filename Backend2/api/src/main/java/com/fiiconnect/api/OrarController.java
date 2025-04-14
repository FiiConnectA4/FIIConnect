<<<<<<< HEAD
package com.fiiconnect.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

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

 @GetMapping("/grupa/{an}/{grupa}")
    public List<OrarDTO> getOrarByAnAndGrupa(@PathVariable String an, @PathVariable String grupa) {
        // Obținem lista de orare din baza de date
        List<Orar> orarList = repository.findByAnAndGrupa(an, grupa);

        // Mapează entitățile Orar în OrarDTO, fără a include frecventa
        return orarList.stream().map(orar -> {
            // Conversia oraStart și oraEnd din String în LocalTime
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            
            // Formatează oraStart și oraEnd ca String
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            
            // Creăm obiectul DTO fără frecventa
            return new OrarDTO(
                orar.getZi(),
                oraStart + " - " + oraEnd,  // Aici combinăm intervalul de timp
                orar.getDisciplina(),
                orar.getTip(),
                orar.getGrupa(),
                orar.getSala()
            );
        }).collect(Collectors.toList());
    }
    
    
    // Endpoint pentru a obține orarul pe baza numelui profesorului
    @GetMapping("/profesor/{profesor}")
    public List<Orar> getOrarByProfesor(@PathVariable String profesor) {
        return repository.findByProfesor(profesor);
    }
=======
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
    @GetMapping("/grupa/{an}/{grupa}")
    public List<Orar> getOrarByAnAndGrupa(@PathVariable String an, @PathVariable String grupa) {
    return repository.findByAnAndGrupa(an, grupa);
}

    // Endpoint pentru a obține orarul pe baza numelui profesorului
    @GetMapping("/profesor/{profesor}")
    public List<Orar> getOrarByProfesor(@PathVariable String profesor) {
        return repository.findByProfesor(profesor);
    }
>>>>>>> 7139cfcef716dc3db2ee65277bd1c22c0e149812
}