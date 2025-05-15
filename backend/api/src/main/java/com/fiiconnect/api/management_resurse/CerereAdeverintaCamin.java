package com.fiiconnect.api.management_resurse;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "cereri_adeverinta_camin")
public class CerereAdeverintaCamin extends CerereGenerica {

    private String camin;

    public CerereAdeverintaCamin() {
        this.tip = "ADEVERINTA_CAMIN";
    }

    public String getCamin() {
        return camin;
    }

    public void setCamin(String camin) {
        this.camin = camin;
    }

    public CerereAdeverintaCamin(String camin) {
        this.camin = camin;
    }

    @Override
    public String toString() {
        return "CerereAdeverintaCamin{" +
                "camin='" + camin + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        CerereAdeverintaCamin that = (CerereAdeverintaCamin) o;
        return Objects.equals(camin, that.camin);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), camin);
    }
}
