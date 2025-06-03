package com.fiiconnect.api.management_resurse.repositories;

import java.util.List;

import com.fiiconnect.api.management_resurse.models.Sala;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaRepository extends JpaRepository<Sala, Long> {
    List<Sala> findByNume(String nume);

}