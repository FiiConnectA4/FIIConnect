package com.fiiconnect.api.management_resurse.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "cereri_adeverinta_student")
public class CerereAdeverintaStudent extends CerereGenerica {

    private String adresa;

    public CerereAdeverintaStudent() {
        this.tip = "ADEVERINTA_STUDENT";
    }

    public CerereAdeverintaStudent(String adresa) {
        this.adresa = adresa;
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    @Override
    public String toString() {
        return "CerereAdeverintaStudent{" +
                "adresa='" + adresa + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        CerereAdeverintaStudent that = (CerereAdeverintaStudent) o;
        return Objects.equals(adresa, that.adresa);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), adresa);
    }
}
