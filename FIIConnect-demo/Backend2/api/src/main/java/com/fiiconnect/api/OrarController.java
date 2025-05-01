package com.fiiconnect.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController // îmi returnează un json
@RequestMapping({"/orar", "/orar-secretariat"}) // toate rutele vor începe cu /orar
public class OrarController {

    @Autowired // pentru a face operații CRUD
    private OrarRepository repository;

    @GetMapping
    public List<com.fiiconnect.api.Orar> toateOrele() {
        return repository.findAll(); // îți returnează toate rândurile din orar
    }

    @GetMapping("/{id}")
    public com.fiiconnect.api.Orar getOrarById(@PathVariable Integer id) {
        return repository.findById(id).orElseThrow(); // returnează un orar după id
    }

    @PostMapping
    public com.fiiconnect.api.Orar adaugaOrar(@RequestBody com.fiiconnect.api.Orar orar) {
        return repository.save(orar); // primește un body orar din request și îl afișează în DB
    }

    @DeleteMapping("/{id}")
    public void stergeOrar(@PathVariable Integer id) {
        repository.deleteById(id); // șterge înregistrările din DB după id
    }

    @GetMapping("/discipline")
    public List<String> getDiscipline() {
        // Obține lista unică de discipline din baza de date
        return repository.findAll().stream()
                .map(Orar::getDisciplina) // Extrage numele disciplinelor
                .filter(disciplina -> disciplina != null && !disciplina.isEmpty()) // Elimină valorile null sau goale
                .distinct() // Elimină duplicatele
                .collect(Collectors.toList()); // Returnează ca listă
    }

    @GetMapping("/profesori")
    public List<String> getProfesori() {
        // Obține lista unică de profesori din baza de date
        return repository.findAll().stream()
                .map(Orar::getProfesor) // Extrage numele profesorilor
                .filter(profesor -> profesor != null && !profesor.isEmpty()) // Elimină valorile null sau goale
                .distinct() // Elimină duplicatele
                .collect(Collectors.toList()); // Returnează ca listă
    }

    @GetMapping({"/studenti/{an}/{grupa}", "/grupa/{an}/{grupa}"})
    public List<OrarDTO> getOrarByAnAndGrupa(@PathVariable String an, @PathVariable String grupa) {
        List<Orar> orarList = repository.findByAnAndGrupa(an, grupa);

        System.out.println("📋 Am găsit " + orarList.size() + " înregistrări pentru anul " + an + ", grupa " + grupa);

        for (Orar orar : orarList) {
            if (orar.getOraStart() == null || orar.getOraEnd() == null) {
                System.out.println("⚠️ Ora Start sau End este null pentru: " + orar);
            }
        }

        // Conversie Orar -> OrarDTO și includerea câmpului 'an'
        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));

            // Creăm un OrarDTO cu anul și profesorul
            return new OrarDTO(
                    orar.getZi(),
                    oraStart + " - " + oraEnd,  // Aici combinăm intervalul de timp
                    orar.getDisciplina(),
                    orar.getTip(),
                    orar.getGrupa(),
                    orar.getSala(),
                    orar.getProfesor(),  // Adăugăm profesorul
                    orar.getAn(),  // Adăugăm anul
                    orar.getId()
            );
        }).collect(Collectors.toList());
    }

    @GetMapping("/profesor/{profesor}")
    public List<OrarDTO> getOrarByProfesor(@PathVariable String profesor) {
        // Elimină spațiile înainte și după numele profesorului
        String profesorTrimmed = profesor.trim();  // Trim pentru a elimina spațiile de la început și sfârșit
    
        System.out.println("Căutăm orar pentru profesorul: " + profesorTrimmed);  // Log pentru depanare
    
        // Obținem lista de orare din baza de date pe baza profesorului
        List<Orar> orarList = repository.findByProfesor(profesorTrimmed);
        
        System.out.println("Număr de orare găsite: " + orarList.size());  // Log pentru numărul de rezultate
    
        // Conversie Orar -> OrarDTO
        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    
            return new OrarDTO(
                orar.getZi(),
                oraStart + " - " + oraEnd,  // Aici combinăm intervalul de timp
                orar.getDisciplina(),
                orar.getTip(),
                orar.getGrupa(),
                orar.getSala(),
                orar.getProfesor(),
                orar.getAn(),
                orar.getId()
            );
        }).collect(Collectors.toList());
    }
    

    @GetMapping("/sala/{sala}")
    public List<OrarDTO> getOrarBySala(@PathVariable String sala) {
        System.out.println("Căutăm orar pentru sala: " + sala);
        List<Orar> orarList = repository.findBySala(sala);
        System.out.println("Număr de orare găsite: " + orarList.size());
        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            return new OrarDTO(
                orar.getZi(),
                oraStart + " - " + oraEnd,
                orar.getDisciplina(),
                orar.getTip(),
                orar.getGrupa(),
                orar.getSala(),
                orar.getProfesor(),
                orar.getAn(),
                orar.getId()
            );
        }).collect(Collectors.toList());
    }
    
    @GetMapping("/disciplina/{disciplina}")
    public List<OrarDTO> getOrarByDisciplina(@PathVariable String disciplina) {
        System.out.println("Căutăm orar pentru disciplina: " + disciplina);
        List<Orar> orarList = repository.findByDisciplina(disciplina);
        System.out.println("Număr de orare găsite: " + orarList.size());
        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            return new OrarDTO(
                orar.getZi(),
                oraStart + " - " + oraEnd,
                orar.getDisciplina(),
                orar.getTip(),
                orar.getGrupa(),
                orar.getSala(),
                orar.getProfesor(),
                orar.getAn(),
                orar.getId()
            );
        }).collect(Collectors.toList());
    }


    @PutMapping("/{id}")
    public ResponseEntity<com.fiiconnect.api.Orar> updateOrar(@PathVariable Integer id, @RequestBody com.fiiconnect.api.Orar orar) {
        // Găsește obiectul de tip Orar pe baza ID-ului
        com.fiiconnect.api.Orar existingOrar = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orar not found with id " + id));

        // Actualizează numai unde informațiile nu sunt null
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
        
        if (orar.getAn() != null) {
            existingOrar.setAn(orar.getAn());
        }

        // Salvează
        com.fiiconnect.api.Orar updatedOrar = repository.save(existingOrar);

        return ResponseEntity.ok(updatedOrar);
    }
}
