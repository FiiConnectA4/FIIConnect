package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "formula_component")
public class FormulaComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "formula_component_id_gen")
    @SequenceGenerator(name = "formula_component_id_gen", sequenceName = "seq_formula_component_id", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idFormula")
    private Formula formula;

    @Column(name = "name")
    private String name;
}