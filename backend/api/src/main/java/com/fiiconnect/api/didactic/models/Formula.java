package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "formula")
public class Formula {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "formula_id_gen")
    @SequenceGenerator(name = "formula_id_gen", sequenceName = "seq_formula_id", allocationSize = 1)
    private Long id;

    @Column(name = "idCourse")
    private Long idCourse;

    @Column(name = "text")
    private String text;

    @OneToMany(mappedBy = "formula", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FormulaComponent> components;
}