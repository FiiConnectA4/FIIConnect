package com.fiiconnect.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController // imi returneaza un json
@RequestMapping("/orar") //toate rutele vor incepe cu /orar
public class OrarController {

    @Autowired // pentru a face operatii CRUD
    private OrarRepository repository;

    @GetMapping
    public List<com.fiiconnect.api.Orar> toateOrele() {
        return repository.findAll(); // iti returneaza toate randurile din orar
    }

    @GetMapping("/{id}")
    public com.fiiconnect.api.Orar getOrarById(@PathVariable Integer id) {
        return repository.findById(id).orElseThrow(); // returneaza un orar dupa id
    }

    @PostMapping
    public com.fiiconnect.api.Orar adaugaOrar(@RequestBody com.fiiconnect.api.Orar orar) {
        return repository.save(orar); // primeste un body orar din request si il afiseaza in DB
    }

    @DeleteMapping("/{id}")
    public void stergeOrar(@PathVariable Integer id) {
        repository.deleteById(id); //sterge inregistrarile din DB dupa id
    }

 @GetMapping("/grupa/{an}/{grupa}")
    public List<OrarDTO> getOrarByAnAndGrupa(@PathVariable String an, @PathVariable String grupa) { //cauta inregistrarile pentru o anumita grupa dintr un an dat si datele le transforma in DTO
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
        return repository.findByProfesor(profesor); //returneaza toate orele unui profesor
    }
    
    @GetMapping("/sala/{sala}")
    public List<OrarDTO> getOrarBySala(@PathVariable String sala) {
        // Obținem lista de orare din baza de date
        List<Orar> orarList = repository.findBySala(sala);

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

    @PutMapping("/{id}")
public ResponseEntity<com.fiiconnect.api.Orar> updateOrar(@PathVariable Integer id, @RequestBody com.fiiconnect.api.Orar orar) {
    // Gaseste obiectul de tip Orar pe baza ID-ului
    com.fiiconnect.api.Orar existingOrar = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Orar not found with id " + id));

    // Updateaza numai unde informatiile nu sunt null
    if (orar.getZi() != null) {
        existingOrar.setZi(orar.getZi());
    }
    if (orar.getOraStart() != null) {
        existingOrar.setOraStart(orar.getOraStart());
    }
    if (orar.getOraEnd() != null) {
        existingOrar.setOraEnd(orar.getOraEnd());
    }
    if (orar.getDisciplina() != null) {
        existingOrar.setDisciplina(orar.getDisciplina());
    }
    if (orar.getTip() != null) {
        existingOrar.setTipActivitate(orar.getTip());
    }
    if (orar.getGrupa() != null) {
        existingOrar.setGrupa(orar.getGrupa());
    }
    if (orar.getSala() != null) {
        existingOrar.setSala(orar.getSala());
    }
    if (orar.getProfesor() != null) {
        existingOrar.setProfesor(orar.getProfesor());
    }
    
    if (orar.getAn() != null){
        existingOrar.setAn(orar.getAn());
    }

    // Salveaza
    com.fiiconnect.api.Orar updatedOrar = repository.save(existingOrar);

    return ResponseEntity.ok(updatedOrar);
}
  
}