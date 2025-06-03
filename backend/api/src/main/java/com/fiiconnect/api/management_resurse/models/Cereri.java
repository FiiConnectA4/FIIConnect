package com.fiiconnect.api.management_resurse.models;

import com.fiiconnect.api.didactic.models.Student;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "cereri")
public class Cereri {

    @Id
    @SequenceGenerator(name = "cereri_seq", sequenceName = "CERERI_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cereri_seq")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_student", referencedColumnName = "id", nullable = false)
    private Student student;

    private String tip;
    private String status;
    private String dataTrimitere;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String continut;

    private String comentariu;

    public Cereri() {}

    public Cereri(Integer id, Student student, String tip, String status, String dataTrimitere, String continut, String comentariu) {
        this.id = id;
        this.student = student;
        this.tip = tip;
        this.status = status;
        this.dataTrimitere = dataTrimitere;
        this.continut = continut;
        this.comentariu = comentariu;
    }

    public Integer getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public String getTip() {
        return tip;
    }

    public String getStatus() {
        return status;
    }

    public String getDataTrimitere() {
        return dataTrimitere;
    }

    public String getContinut() {
        return continut;
    }

    public String getComentariu() {
        return comentariu;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setTip(String tip) {
        this.tip = tip;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDataTrimitere(String dataTrimitere) {
        this.dataTrimitere = dataTrimitere;
    }

    public void setContinut(String continut) {
        this.continut = continut;
    }

    public void setComentariu(String comentariu) {
        this.comentariu = comentariu;
    }

    @Override
    public String toString() {
        return "Cereri{" +
                "id=" + id +
                ", student=" + (student != null ? student.getId() : null) +
                ", tip='" + tip + '\'' +
                ", status='" + status + '\'' +
                ", dataTrimitere='" + dataTrimitere + '\'' +
                ", continut='" + continut + '\'' +
                ", comentariu='" + comentariu + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cereri cereri)) return false;
        return Objects.equals(id, cereri.id) &&
                Objects.equals(student, cereri.student) &&
                Objects.equals(tip, cereri.tip) &&
                Objects.equals(status, cereri.status) &&
                Objects.equals(dataTrimitere, cereri.dataTrimitere) &&
                Objects.equals(continut, cereri.continut) &&
                Objects.equals(comentariu, cereri.comentariu);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, student, tip, status, dataTrimitere, continut, comentariu);
    }
}
