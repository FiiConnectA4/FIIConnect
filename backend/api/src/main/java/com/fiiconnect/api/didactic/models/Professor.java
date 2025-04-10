package com.fiiconnect.api.didactic.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

import java.util.List;
import java.util.Objects;

@Entity
public class Professor {
    private @Id @GeneratedValue Long id;
    private String cnp;
    private String firstName;
    private String lastName;
    private String rank;

    @Transient
    private List<Teaching> courses = null;

    public Professor(Long id, String cnp, String firstName, String lastName, String rank) {
        this.id = id;
        this.cnp = cnp;
        this.firstName = firstName;
        this.lastName = lastName;
        this.rank = rank;
    }

    public Professor() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCnp() {
        return cnp;
    }

    public void setCnp(String cnp) {
        this.cnp = cnp;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }


    @Override
    public String toString() {
        return "Professor{" +
                "id=" + id +
                ", cnp='" + cnp + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", rank='" + rank + '\'' +
                ", courses=" + courses +
                '}';
    }

    public List<Teaching> getCourses() {
        return courses;
    }

    public void setCourses(List<Teaching> courses) {
        this.courses = courses;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Professor professor = (Professor) o;
        return Objects.equals(id, professor.id) && Objects.equals(cnp, professor.cnp) && Objects.equals(firstName, professor.firstName) && Objects.equals(lastName, professor.lastName) && Objects.equals(rank, professor.rank);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, cnp, firstName, lastName, rank);
    }
}
