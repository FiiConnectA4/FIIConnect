package com.fiiconnect.api;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaRepository extends JpaRepository<Sala, Long> {
    List<Sala> findByNume(String nume);
}