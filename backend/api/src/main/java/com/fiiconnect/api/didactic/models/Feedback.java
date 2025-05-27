package com.fiiconnect.api.didactic.models;


import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
@Entity
@Table(name = "feedback")
@NoArgsConstructor
public class Feedback {

    @EmbeddedId
    private FeedbackCompositeKey id;

    private String feedbackText;
    private int teachingGrade;
    private  int materialsGrade;
    private int evaluationGrade;
}
