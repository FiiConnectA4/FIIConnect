package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.ComponentScore;
import com.fiiconnect.api.didactic.models.ComponentScoreCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ComponentScoreRepository extends JpaRepository<ComponentScore, ComponentScoreCompositeKey> {
    List<ComponentScore> findByIdIdStudAndIdIdComponentIn(Long idStud, Collection<Long> idComponents);
    List<ComponentScore> findByIdIdStud(Long idStud);
    List<ComponentScore> findByIdIdComponent(Long idComponent);
}
