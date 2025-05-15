package com.fiiconnect.api.didactic.models;

import jakarta.persistence.Embeddable;
import lombok.*;

@Setter
@Getter
@EqualsAndHashCode
@ToString
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class ComponentScoreCompositeKey {
    private Long idStud;
    private Long idComponent;
}
