package com.fiiconnect.api.management_resurse.dtos;

public class CereriDTO {
    private Integer id;
    private Long studentId;        // extragem doar id-ul studentului, nu tot obiectul
    private String studentName;    // opțional: numele studentului (ex: Popescu Ana)
    private String tip;
    private String status;
    private String dataTrimitere;
    private String continut;
    private String comentariu;

    // Constructor gol
    public CereriDTO() {}

    // Constructor complet
    public CereriDTO(Integer id, Long studentId, String studentName, String tip, String status, String dataTrimitere, String continut, String comentariu) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.tip = tip;
        this.status = status;
        this.dataTrimitere = dataTrimitere;
        this.continut = continut;
        this.comentariu = comentariu;
    }

    // Getteri și setteri
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDataTrimitere() { return dataTrimitere; }
    public void setDataTrimitere(String dataTrimitere) { this.dataTrimitere = dataTrimitere; }

    public String getContinut() { return continut; }
    public void setContinut(String continut) { this.continut = continut; }

    public String getComentariu() { return comentariu; }
    public void setComentariu(String comentariu) { this.comentariu = comentariu; }
}
