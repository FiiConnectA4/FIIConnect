package com.fiiconnect.api.management_resurse.repositories;
import java.util.List;


import com.fiiconnect.api.management_resurse.models.Orar;
import org.springframework.data.jpa.repository.JpaRepository;

import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.Professor;

public interface OrarRepository extends JpaRepository<Orar, Integer> {
    List<Orar> findByAnAndGrupa(String an, String grupa); //imi returneaza automat select * from orar where an = and grupa =
    List<Orar> findByProfesor(Professor profesor); // select * from orar where profesor =
    List<Orar> findBySala(String sala);
    List<Orar> findByDisciplina(Course disciplina);
    List<Orar> findBySalaAndZi(String sala, String zi);




}