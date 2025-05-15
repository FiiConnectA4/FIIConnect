package com.fiiconnect.api.management_resurse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.CourseRepository;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController 
@RequestMapping({"/orar", "/orar-secretariat"}) 
public class OrarController {

    @Autowired 
    private OrarRepository repository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CourseRepository courseRepository;


    @GetMapping
    public List<com.fiiconnect.api.management_resurse.Orar> toateOrele() {
        return repository.findAll(); 
    }

    @GetMapping("/{id}")
    public com.fiiconnect.api.management_resurse.Orar getOrarById(@PathVariable Integer id) {
        return repository.findById(id).orElseThrow(); 
    }

    @PostMapping
    public com.fiiconnect.api.management_resurse.Orar adaugaOrar(@RequestBody com.fiiconnect.api.management_resurse.Orar orar) {
        return repository.save(orar); 
    }

    @DeleteMapping("/{id}")
    public void stergeOrar(@PathVariable Integer id) {
        repository.deleteById(id); 
    }

    @GetMapping("/discipline")
    public List<Course> getDiscipline() {
        // Obține lista unică de discipline din baza de date
        return repository.findAll().stream()
                .map(Orar::getDisciplina) 
                .filter(disciplina -> disciplina != null) 
                .distinct() 
                .collect(Collectors.toList()); 
    }

    @GetMapping("/profesori")
    public List<Professor> getProfesori() {
        // Obține lista unică de profesori din baza de date
        return repository.findAll().stream()
                .map(Orar::getProfesor) 
                .filter(profesor -> profesor != null) 
                .distinct() 
                .collect(Collectors.toList()); 
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

        
        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));

           
            return new OrarDTO(
                    orar.getZi(),
                    oraStart + " - " + oraEnd, 
                    orar.getDisciplina().getTitle(),
                    orar.getTip(),
                    orar.getGrupa(),
                    orar.getSala(),
                    orar.getProfesor().getFirstName() + " " + orar.getProfesor().getLastName(),  
                    orar.getAn(),  
                    orar.getId()
            );
        }).collect(Collectors.toList());
    }


    

    @GetMapping("/profesor/{nume}/{prenume}")
    public List<OrarDTO> getOrarByProfesor(@PathVariable String nume, @PathVariable String prenume) {
        Professor profesor = professorRepository.findAll().stream()
            .filter(p -> p.getFirstName().equalsIgnoreCase(prenume) && p.getLastName().equalsIgnoreCase(nume))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Profesorul nu a fost găsit: " + prenume + " " + nume));
    
        System.out.println("Căutăm orar pentru profesorul: " + nume + prenume);  // Log pentru depanare
    
        List<Orar> orarList = repository.findByProfesor(profesor);
        
        System.out.println("Număr de orare găsite: " + orarList.size()); 
        
        return orarList.stream().map(orar -> {
            LocalTime oraStartTime = LocalTime.parse(orar.getOraStart(), DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime oraEndTime = LocalTime.parse(orar.getOraEnd(), DateTimeFormatter.ofPattern("HH:mm"));
            String oraStart = oraStartTime.format(DateTimeFormatter.ofPattern("HH:mm"));
            String oraEnd = oraEndTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    
            return new OrarDTO(
                orar.getZi(),
                oraStart + " - " + oraEnd, 
                orar.getDisciplina().getTitle(),
                orar.getTip(),
                orar.getGrupa(),
                orar.getSala(),
                orar.getProfesor().getFirstName() + " " + orar.getProfesor().getLastName(),
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
                orar.getDisciplina().getTitle(),
                orar.getTip(),
                orar.getGrupa(),
                orar.getSala(),
                orar.getProfesor().getFirstName() + " " + orar.getProfesor().getLastName(),
                orar.getAn(),
                orar.getId()
            );
        }).collect(Collectors.toList());
    }
    
    @GetMapping("/disciplina/{disciplinaNume}")
    public List<OrarDTO> getOrarByDisciplina(@PathVariable String disciplinaNume) {
        System.out.println("Căutăm orar pentru disciplina: " + disciplinaNume);
        Course disciplina = courseRepository.findAll().stream()
            .filter(c -> c.getTitle().equalsIgnoreCase(disciplinaNume))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Disciplina nu a fost găsită: " + disciplinaNume));
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
                orar.getDisciplina().getTitle(),
                orar.getTip(),
                orar.getGrupa(),
                orar.getSala(),
                orar.getProfesor().getFirstName() + " " + orar.getProfesor().getLastName(),
                orar.getAn(),
                orar.getId()
            );
        }).collect(Collectors.toList());
    }


    @PutMapping("/{id}")
    public ResponseEntity<com.fiiconnect.api.management_resurse.Orar> updateOrar(@PathVariable Integer id, @RequestBody com.fiiconnect.api.management_resurse.Orar orar) {
        // Găsește obiectul de tip Orar pe baza ID-ului
        com.fiiconnect.api.management_resurse.Orar existingOrar = repository.findById(id)
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
        com.fiiconnect.api.management_resurse.Orar updatedOrar = repository.save(existingOrar);

        return ResponseEntity.ok(updatedOrar);
    }
}
