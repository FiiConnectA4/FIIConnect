package com.fiiconnect.api.didactic.models;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Entity
@Table(name = "component_score")
public class ComponentScore {
    @EmbeddedId
    private ComponentScoreCompositeKey id;
    private Double value;
}
