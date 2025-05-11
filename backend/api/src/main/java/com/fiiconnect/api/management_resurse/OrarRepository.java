package com.fiiconnect.api.management_resurse;
import java.util.List;



import org.springframework.data.jpa.repository.JpaRepository;

public interface OrarRepository extends JpaRepository<com.fiiconnect.api.management_resurse.Orar, Integer> {
    List<Orar> findByAnAndGrupa(String an, String grupa); //imi returneaza automat select * from orar where an = and grupa =
    List<Orar> findByProfesor(String profesor); // select * from orar where profesor =
    List<Orar> findBySala(String sala);
    List<Orar> findByDisciplina(String disciplina);
    

    
}
