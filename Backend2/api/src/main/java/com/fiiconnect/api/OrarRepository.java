package com.fiiconnect.api;
import java.util.List;



import org.springframework.data.jpa.repository.JpaRepository;

public interface OrarRepository extends JpaRepository<com.fiiconnect.api.Orar, Integer> {
    List<Orar> findByAnAndGrupa(String an, String grupa); //imi returneaza automat select * from orar where an = and grupa =
    List<Orar> findByProfesor(String profesor); // select * from orar where profesor =
}
