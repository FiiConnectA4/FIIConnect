package com.fiiconnect.api.management_resurse.dtos;

public class RezervareDTO {
    private String sala;
    private String zi;
    private String oraStart;
    private String oraEnd;
    private String saptamana;       // optional, dacă folosești
    private Integer profesorId;     // FK către profesor
    private Integer disciplinaId;   // FK către disciplină
    private String grupa;
    private String tip;             // tipul activității
    private String an;

    public RezervareDTO() {}

    // Getteri și setteri

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
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

    public Integer getProfesorId() {
        return profesorId;
    }

    public void setProfesorId(Integer profesorId) {
        this.profesorId = profesorId;
    }

    public Integer getDisciplinaId() {
        return disciplinaId;
    }

    public void setDisciplinaId(Integer disciplinaId) {
        this.disciplinaId = disciplinaId;
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

    public void setTip(String tip) {
        this.tip = tip;
    }

    public String getAn() {
        return an;
    }

    public void setAn(String an) {
        this.an = an;
    }
}