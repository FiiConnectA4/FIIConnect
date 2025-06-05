package com.fiiconnect.api.didactic.models;


import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Embeddable
public class FeedbackCompositeKey {
    private Long idStud;
    private Long idProf;
}
