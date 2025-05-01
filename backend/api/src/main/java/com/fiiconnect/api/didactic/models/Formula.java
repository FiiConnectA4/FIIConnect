package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Objects;

@Getter
@Setter
@Entity
@Table(name = "formula")
public class Formula {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "formula_id_gen")
    @SequenceGenerator(name = "formula_id_gen", sequenceName = "seq_formula_id", allocationSize = 1, initialValue = 1)
    private Long id;

    @Column(name = "idCourse", nullable = false, unique = true)
    private Long idCourse;

    @Column(name = "text", nullable = false, length = 300)
    private String text;

    @ManyToOne
    @JoinColumn(name = "idCourse", insertable = false, updatable = false)
    private Course course;

    @OneToMany(mappedBy = "formula", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FormulaComponent> components;

    public Formula() {}

    public Formula(Long id, Long idCourse, String text) {
        this.id = id;
        this.idCourse = idCourse;
        this.text = text;
    }

    @Override
    public String toString() {
        return "Formula{" +
                "id=" + id +
                ", idCourse=" + idCourse +
                ", text='" + text + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Formula formula)) return false;
        return Objects.equals(getId(), formula.getId()) &&
                Objects.equals(getIdCourse(), formula.getIdCourse()) &&
                Objects.equals(getText(), formula.getText());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getIdCourse(), getText());
    }
}