package com.fiiconnect.api.management_resurse;

import com.fiiconnect.api.management_resurse.CerereGenerica;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "cereri_caz_social")
public class CerereCazSocial extends CerereGenerica {

    private String justificare;
    private String documentePath; // PDF/imagini/zip etc.

    public CerereCazSocial() {
        this.tip = "CAZ_SOCIAL";
    }

    public CerereCazSocial(String justificare, String documentePath) {
        this.justificare = justificare;
        this.documentePath = documentePath;
    }

    public String getJustificare() {
        return justificare;
    }

    public void setJustificare(String justificare) {
        this.justificare = justificare;
    }

    public String getDocumentePath() {
        return documentePath;
    }

    public void setDocumentePath(String documentePath) {
        this.documentePath = documentePath;
    }

    @Override
    public String toString() {
        return "CerereCazSocial{" +
                "justificare='" + justificare + '\'' +
                ", documentePath='" + documentePath + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        CerereCazSocial that = (CerereCazSocial) o;
        return Objects.equals(justificare, that.justificare) && Objects.equals(documentePath, that.documentePath);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), justificare, documentePath);
    }
}
