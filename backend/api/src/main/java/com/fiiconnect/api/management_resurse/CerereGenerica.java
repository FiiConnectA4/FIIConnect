package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.management_resurse.Cerere;
import jakarta.persistence.*;

import java.util.Objects;

@MappedSuperclass
public abstract class CerereGenerica implements Cerere {

    @Id
    @SequenceGenerator(name = "cereri_seq", sequenceName = "CERERI_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cereri_seq")
    protected Integer id;

    @ManyToOne
    @JoinColumn(name = "id_student", referencedColumnName = "id", nullable = false)
    protected Student student;

    protected String tip;
    protected String status;
    protected String dataTrimitere;

    @Lob
    @Column(columnDefinition = "CLOB")
    protected String continut;

    protected String comentariu;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getTip() {
        return tip;
    }

    public void setTip(String tip) {
        this.tip = tip;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDataTrimitere() {
        return dataTrimitere;
    }

    public void setDataTrimitere(String dataTrimitere) {
        this.dataTrimitere = dataTrimitere;
    }

    public String getContinut() {
        return continut;
    }

    public void setContinut(String continut) {
        this.continut = continut;
    }

    public String getComentariu() {
        return comentariu;
    }

    public void setComentariu(String comentariu) {
        this.comentariu = comentariu;
    }

    @Override
    public String toString() {
        return "CerereGenerica{" +
                "id=" + id +
                ", student=" + student +
                ", tip='" + tip + '\'' +
                ", status='" + status + '\'' +
                ", dataTrimitere='" + dataTrimitere + '\'' +
                ", continut='" + continut + '\'' +
                ", comentariu='" + comentariu + '\'' +
                '}';
    }


    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        CerereGenerica that = (CerereGenerica) o;
        return Objects.equals(id, that.id) && Objects.equals(student, that.student) && Objects.equals(tip, that.tip) && Objects.equals(status, that.status) && Objects.equals(dataTrimitere, that.dataTrimitere) && Objects.equals(continut, that.continut) && Objects.equals(comentariu, that.comentariu);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, student, tip, status, dataTrimitere, continut, comentariu);
    }
}
