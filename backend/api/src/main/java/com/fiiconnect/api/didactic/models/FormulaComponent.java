package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@Entity
@Table(name = "formula_component")
public class FormulaComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "formula_component_id_gen")
    @SequenceGenerator(name = "formula_component_id_gen", sequenceName = "seq_formula_component_id", allocationSize = 1, initialValue = 1)
    private Long id;

    @Column(name = "idFormula", nullable = false)
    private Long idFormula;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @ManyToOne
    @JoinColumn(name = "idFormula", insertable = false, updatable = false)
    private Formula formula;

    public FormulaComponent() {}

    public FormulaComponent(Long id, Long idFormula, String name) {
        this.id = id;
        this.idFormula = idFormula;
        this.name = name;
    }

    @Override
    public String toString() {
        return "FormulaComponent{" +
                "id=" + id +
                ", idFormula=" + idFormula +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof FormulaComponent component)) return false;
        return Objects.equals(getId(), component.getId()) &&
                Objects.equals(getIdFormula(), component.getIdFormula()) &&
                Objects.equals(getName(), component.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getIdFormula(), getName());
    }
}