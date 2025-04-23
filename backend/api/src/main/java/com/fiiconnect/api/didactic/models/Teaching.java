package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Teaching {
    @EmbeddedId
    private TeachingCompositeKey id;

    @Transient
    private Course course = null;

    @Transient
    private Professor professor = null;

    private String role;

    public Teaching() {
    }

    public Teaching(TeachingCompositeKey id, Course course, Professor professor, String role) {
        this.id = id;
        this.course = course;
        this.professor = professor;
        this.role = role;
    }

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

    public TeachingCompositeKey getId() {
        return id;
    }

    public void setId(TeachingCompositeKey id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
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
}
