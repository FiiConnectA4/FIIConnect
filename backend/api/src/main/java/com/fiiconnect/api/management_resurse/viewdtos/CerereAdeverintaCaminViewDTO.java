package com.fiiconnect.api.management_resurse.viewdtos;

public class CerereAdeverintaCaminViewDTO {
    private Integer id;
    private String status;
    private String comentariu;
    private String dataTrimitere;
    private String camin;
    private String tip;

    private Long studentId;
    private String nume;
    private String prenume;
    private String regNumber;
    private String grupa;
    private Integer an;

    // Getters
    public Integer getId() { return id; }
    public String getStatus() { return status; }
    public String getComentariu() { return comentariu; }
    public String getDataTrimitere() { return dataTrimitere; }
    public String getCamin() { return camin; }
    public String getTip() { return tip; }

    public Long getStudentId() { return studentId; }
    public String getNume() { return nume; }
    public String getPrenume() { return prenume; }
    public String getRegNumber() { return regNumber; }
    public String getGrupa() { return grupa; }
    public Integer getAn() { return an; }

    // Setters
    public void setId(Integer id) { this.id = id; }
    public void setStatus(String status) { this.status = status; }
    public void setComentariu(String comentariu) { this.comentariu = comentariu; }
    public void setDataTrimitere(String dataTrimitere) { this.dataTrimitere = dataTrimitere; }
    public void setCamin(String camin) { this.camin = camin; }
    public void setTip(String tip) { this.tip = tip; }

    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setNume(String nume) { this.nume = nume; }
    public void setPrenume(String prenume) { this.prenume = prenume; }
    public void setRegNumber(String regNumber) { this.regNumber = regNumber; }
    public void setGrupa(String grupa) { this.grupa = grupa; }
    public void setAn(Integer an) { this.an = an; }
}
