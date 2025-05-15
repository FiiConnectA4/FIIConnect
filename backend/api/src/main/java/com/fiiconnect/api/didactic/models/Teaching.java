package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Teaching {
    @EmbeddedId
    private TeachingCompositeKey id;

    @Transient
    private Course course = null;

    @Transient
    private Professor professor = null;

    private String role;

    @Override
    public String toString() {
        return "Teaching{" +
                "id=" + id +
                ", course=" + course +
                ", professor=" + professor +
                ", role='" + role + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Teaching teaching = (Teaching) o;
        return Objects.equals(id, teaching.id) && Objects.equals(role, teaching.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, role);
    }
}
