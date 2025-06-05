package com.fiiconnect.api.didactic.models;

import com.fiiconnect.api.didactic.helpers.formula.tree.AbstractTreeNode;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
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

    @OneToMany(mappedBy = "idFormula", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FormulaComponent> components;

    @Transient
    private AbstractTreeNode treeRoot;
}