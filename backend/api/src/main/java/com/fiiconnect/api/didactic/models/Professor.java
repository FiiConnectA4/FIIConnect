package com.fiiconnect.api.didactic.models;

import com.fiiconnect.api.auth_userMgmt.models.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Objects;

@Setter
@Getter
@Entity
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "professor_id_gen")
    @SequenceGenerator(name="professor_id_gen", sequenceName = "seq_professor_id", allocationSize = 1)
    private Long id;

    //Adauga relatia cu User
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

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

    public Professor() {}

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

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Professor professor = (Professor) o;
        return Objects.equals(id, professor.id) &&
                Objects.equals(cnp, professor.cnp) &&
                Objects.equals(firstName, professor.firstName) &&
                Objects.equals(lastName, professor.lastName) &&
                Objects.equals(rank, professor.rank);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, cnp, firstName, lastName, rank);
    }
}
