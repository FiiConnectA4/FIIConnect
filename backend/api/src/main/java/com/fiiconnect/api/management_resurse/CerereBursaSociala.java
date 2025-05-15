package com.fiiconnect.api.management_resurse;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "cereri_bursa_sociala")
public class CerereBursaSociala extends CerereGenerica {

    private Integer anStudent;
    private String facultate;
    private String dosarPath; // .zip cu documentele

    public CerereBursaSociala() {
        this.tip = "BURSA_SOCIALA";
    }

    public CerereBursaSociala(Integer anStudent, String facultate, String dosarPath) {
        this.anStudent = anStudent;
        this.facultate = facultate;
        this.dosarPath = dosarPath;
    }

    public Integer getAnStudent() {
        return anStudent;
    }

    public void setAnStudent(Integer anStudent) {
        this.anStudent = anStudent;
    }

    public String getFacultate() {
        return facultate;
    }

    public void setFacultate(String facultate) {
        this.facultate = facultate;
    }

    public String getDosarPath() {
        return dosarPath;
    }

    public void setDosarPath(String dosarPath) {
        this.dosarPath = dosarPath;
    }

    @Override
    public String toString() {
        return "CerereBursaSociala{" +
                "anStudent=" + anStudent +
                ", facultate='" + facultate + '\'' +
                ", dosarPath='" + dosarPath + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        CerereBursaSociala that = (CerereBursaSociala) o;
        return Objects.equals(anStudent, that.anStudent) && Objects.equals(facultate, that.facultate) && Objects.equals(dosarPath, that.dosarPath);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), anStudent, facultate, dosarPath);
    }
}
