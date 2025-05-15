package com.fiiconnect.api.management_resurse;

public class CerereCazSocialViewDTO {
    private Integer id;
    private String status;
    private String comentariu;
    private String dataTrimitere;
    private String tip;

    private String documentePath;
    private String justificare;

    private Long studentId;
    private String nume;
    private String prenume;
    private String regNumber;
    private String grupa;
    private Integer an;

    // Getteri & Setteri

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getComentariu() { return comentariu; }
    public void setComentariu(String comentariu) { this.comentariu = comentariu; }

    public String getDataTrimitere() { return dataTrimitere; }
    public void setDataTrimitere(String dataTrimitere) { this.dataTrimitere = dataTrimitere; }

    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }

    public String getDocumentePath() { return documentePath; }
    public void setDocumentePath(String documentePath) { this.documentePath = documentePath; }

    public String getJustificare() { return justificare; }
    public void setJustificare(String justificare) { this.justificare = justificare; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getNume() { return nume; }
    public void setNume(String nume) { this.nume = nume; }

    public String getPrenume() { return prenume; }
    public void setPrenume(String prenume) { this.prenume = prenume; }

    public String getRegNumber() { return regNumber; }
    public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

    public String getGrupa() { return grupa; }
    public void setGrupa(String grupa) { this.grupa = grupa; }

    public Integer getAn() { return an; }
    public void setAn(Integer an) { this.an = an; }
}
