package com.fiiconnect.api.didactic;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.Objects;

@Entity
public class Professor {
    private @Id @GeneratedValue Long id;
    private String cnp;
    private String firstName;
    private String lastName;
    private String rank;

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
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Professor professor)) return false;
        return Objects.equals(getId(), professor.getId()) && Objects.equals(getCnp(), professor.getCnp()) && Objects.equals(getFirstName(), professor.getFirstName()) && Objects.equals(getLastName(), professor.getLastName()) && Objects.equals(getRank(), professor.getRank());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getCnp(), getFirstName(), getLastName(), getRank());
    }
}
