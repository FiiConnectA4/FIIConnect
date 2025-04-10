package com.fiiconnect.api.social_secretary;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "obiectexemplu")
public class ObiectExemplu {
    private @Id
    @GeneratedValue Integer id;
    private String nume;
    private double medie;

    ObiectExemplu()
    {

    }

    ObiectExemplu(String nume, double medie)
    {
        this.nume = nume;
        this.medie = medie;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public double getMedie() {
        return medie;
    }

    public void setMedie(double medie) {
        this.medie = medie;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof ObiectExemplu that)) return false;
        return Double.compare(getMedie(), that.getMedie()) == 0 && Objects.equals(getId(), that.getId()) && Objects.equals(getNume(), that.getNume());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getNume(), getMedie());
    }

    @Override
    public String toString() {
        return "ObiectExemplu{" +
                "id=" + id +
                ", nume='" + nume + '\'' +
                ", medie=" + medie +
                '}';
    }
}
