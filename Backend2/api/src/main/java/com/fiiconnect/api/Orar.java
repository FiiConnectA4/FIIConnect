<<<<<<< HEAD
package com.fiiconnect.api;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "orar")
public class Orar {
    @Id
@SequenceGenerator(name = "orar_seq", sequenceName = "ORAR_SEQ", allocationSize = 1)
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orar_seq")
private Integer id;

    private String zi;
    private String oraStart;
    private String oraEnd;
    private String saptamana;
    private String sala;
    private String disciplina;
    private String profesor;
    private String grupa;
    private String tip;
    private String an;

    public Orar() {}

    public Orar(String zi, String oraStart, String oraEnd, String saptamana,
                String sala, String disciplina, String profesor,
                String grupa, String tip, String an) {
        this.zi = zi;
        this.oraStart = oraStart;
        this.oraEnd = oraEnd;
        this.saptamana = saptamana;
        this.sala = sala;
        this.disciplina = disciplina;
        this.profesor = profesor;
        this.grupa = grupa;
        this.tip = tip;
        this.an = an;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getZi() {
        return zi;
    }

    public void setZi(String zi) {
        this.zi = zi;
    }

    public String getOraStart() {
        return oraStart;
    }

    public void setOraStart(String oraStart) {
        this.oraStart = oraStart;
    }

    public String getOraEnd() {
        return oraEnd;
    }

    public void setOraEnd(String oraEnd) {
        this.oraEnd = oraEnd;
    }

    public String getSaptamana() {
        return saptamana;
    }

    public void setSaptamana(String saptamana) {
        this.saptamana = saptamana;
    }

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
    }

    public String getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(String disciplina) {
        this.disciplina = disciplina;
    }

    public String getProfesor() {
        return profesor;
    }

    public void setProfesor(String profesor) {
        this.profesor = profesor;
    }

    public String getGrupa() {
        return grupa;
    }

    public void setGrupa(String grupa) {
        this.grupa = grupa;
    }

    public String getTip() {
        return tip;
    }

    public void setTipActivitate(String tip) {
        this.tip = tip;
    }

    public void setAn(String an) {
        this.an = an;
    }

    public String getAn() {
      return an;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Orar)) return false;
        Orar orar = (Orar) o;
        return Objects.equals(id, orar.id) &&
                Objects.equals(zi, orar.zi) &&
                Objects.equals(oraStart, orar.oraStart) &&
                Objects.equals(oraEnd, orar.oraEnd) &&
                Objects.equals(saptamana, orar.saptamana) &&
                Objects.equals(sala, orar.sala) &&
                Objects.equals(disciplina, orar.disciplina) &&
                Objects.equals(profesor, orar.profesor) &&
                Objects.equals(grupa, orar.grupa) &&
                Objects.equals(tip, orar.tip) &&
                Objects.equals(an, orar.an);

    }

    @Override
    public int hashCode() {
        return Objects.hash(id, zi, oraStart, oraEnd, saptamana, sala, disciplina, profesor, grupa, tip,an);
    }

    @Override
    public String toString() {
        return "Orar{" +
                "id=" + id +
                ", zi='" + zi + '\'' +
                ", oraStart='" + oraStart + '\'' +
                ", oraEnd='" + oraEnd + '\'' +
                ", saptamana='" + saptamana + '\'' +
                ", sala='" + sala + '\'' +
                ", disciplina='" + disciplina + '\'' +
                ", profesor='" + profesor + '\'' +
                ", grupa='" + grupa + '\'' +
                ", tipActivitate='" + tip + '\'' +
                ", an='" + an + '\'' +
                '}';
    }
}

=======
package com.fiiconnect.api;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "orar")
public class Orar {
    @Id
@SequenceGenerator(name = "orar_seq", sequenceName = "ORAR_SEQ", allocationSize = 1)
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orar_seq")
private Integer id;

    private String zi;
    private String oraStart;
    private String oraEnd;
    private String saptamana;
    private String sala;
    private String disciplina;
    private String profesor;
    private String grupa;
    private String tipActivitate;
    private String an;

    public Orar() {}

    public Orar(String zi, String oraStart, String oraEnd, String saptamana,
                String sala, String disciplina, String profesor,
                String grupa, String tipActivitate, String an) {
        this.zi = zi;
        this.oraStart = oraStart;
        this.oraEnd = oraEnd;
        this.saptamana = saptamana;
        this.sala = sala;
        this.disciplina = disciplina;
        this.profesor = profesor;
        this.grupa = grupa;
        this.tipActivitate = tipActivitate;
        this.an = an;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getZi() {
        return zi;
    }

    public void setZi(String zi) {
        this.zi = zi;
    }

    public String getOraStart() {
        return oraStart;
    }

    public void setOraStart(String oraStart) {
        this.oraStart = oraStart;
    }

    public String getOraEnd() {
        return oraEnd;
    }

    public void setOraEnd(String oraEnd) {
        this.oraEnd = oraEnd;
    }

    public String getSaptamana() {
        return saptamana;
    }

    public void setSaptamana(String saptamana) {
        this.saptamana = saptamana;
    }

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
    }

    public String getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(String disciplina) {
        this.disciplina = disciplina;
    }

    public String getProfesor() {
        return profesor;
    }

    public void setProfesor(String profesor) {
        this.profesor = profesor;
    }

    public String getGrupa() {
        return grupa;
    }

    public void setGrupa(String grupa) {
        this.grupa = grupa;
    }

    public String getTipActivitate() {
        return tipActivitate;
    }

    public void setTipActivitate(String tipActivitate) {
        this.tipActivitate = tipActivitate;
    }

    public void setAn(String an) {
        this.an = an;
    }

    public String getAn() {
      return an;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Orar)) return false;
        Orar orar = (Orar) o;
        return Objects.equals(id, orar.id) &&
                Objects.equals(zi, orar.zi) &&
                Objects.equals(oraStart, orar.oraStart) &&
                Objects.equals(oraEnd, orar.oraEnd) &&
                Objects.equals(saptamana, orar.saptamana) &&
                Objects.equals(sala, orar.sala) &&
                Objects.equals(disciplina, orar.disciplina) &&
                Objects.equals(profesor, orar.profesor) &&
                Objects.equals(grupa, orar.grupa) &&
                Objects.equals(tipActivitate, orar.tipActivitate) &&
                Objects.equals(an, orar.an);

    }

    @Override
    public int hashCode() {
        return Objects.hash(id, zi, oraStart, oraEnd, saptamana, sala, disciplina, profesor, grupa, tipActivitate,an);
    }

    @Override
    public String toString() {
        return "Orar{" +
                "id=" + id +
                ", zi='" + zi + '\'' +
                ", oraStart='" + oraStart + '\'' +
                ", oraEnd='" + oraEnd + '\'' +
                ", saptamana='" + saptamana + '\'' +
                ", sala='" + sala + '\'' +
                ", disciplina='" + disciplina + '\'' +
                ", profesor='" + profesor + '\'' +
                ", grupa='" + grupa + '\'' +
                ", tipActivitate='" + tipActivitate + '\'' +
                ", an='" + an + '\'' +
                '}';
    }
}

>>>>>>> 7139cfcef716dc3db2ee65277bd1c22c0e149812
