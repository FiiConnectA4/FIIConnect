package com.fiiconnect.api.didactic.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
@Entity
@ToString
@Table(name = "formula")
public class Formula {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "formula_id_gen")
    @SequenceGenerator(name = "formula_id_gen", sequenceName = "seq_formula_id", allocationSize = 1)
    @JsonInclude(JsonInclude.Include.ALWAYS)
    @Getter
    private Long id;

    @Column(name = "idCourse")
    private Long idCourse;

    @Column(name = "text")
    private String text;

    @JsonInclude(JsonInclude.Include.ALWAYS)
    @OneToMany(mappedBy = "idFormula", cascade = CascadeType.ALL, orphanRemoval = true)
    @Getter
    private List<FormulaComponent> components;

}