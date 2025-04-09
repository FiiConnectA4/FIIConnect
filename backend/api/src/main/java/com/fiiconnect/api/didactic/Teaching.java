package com.fiiconnect.api.didactic;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Teaching {
    @EmbeddedId
    private TeachingCompositeKey id;
    @ManyToOne
    @MapsId("idProf")
    @JoinColumn(name = "idProf", referencedColumnName = "id")
    private Professor professor;
    private String role;


    public Teaching() {
    }

    public Teaching(Professor professor, String role) {
        this.professor = professor;
        this.role = role;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    @Override
    public String toString() {
        return "Teaching{" +
                "professor=" + professor +
                ", role='" + role + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Teaching teaching)) return false;
        return Objects.equals(getProfessor(), teaching.getProfessor()) && Objects.equals(getRole(), teaching.getRole());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getProfessor(), getRole());
    }
}
