package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.GlobalConstant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlobalConstantRepository extends JpaRepository<GlobalConstant, String> {
    GlobalConstant findByName(String name);
}
