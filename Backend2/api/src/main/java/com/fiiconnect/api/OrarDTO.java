package com.fiiconnect.api;

public class OrarDTO {
    private String zi;
    private String interval;
    private String disciplina;
    private String tipActivitate;
    private String grupa;
    private String sala;

    public OrarDTO(String zi, String interval, String disciplina, String tipActivitate, String grupa, String sala) {
        this.zi = zi;
        this.interval = interval;
        this.disciplina = disciplina;
        this.tipActivitate = tipActivitate;
        this.grupa = grupa;
        this.sala = sala;
    }

    // Getters
    public String getZi() { return zi; }
    public String getInterval() { return interval; }
    public String getDisciplina() { return disciplina; }
    public String getTipActivitate() { return tipActivitate; }
    public String getGrupa() { return grupa; }
    public String getSala() { return sala; }
}
