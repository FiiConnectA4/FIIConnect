package com.fiiconnect.api.management_resurse;

public class CerereCazSocialDTO {
    private Integer id;
    private Long studentId;
    private String studentName;
    private String status;
    private String dataTrimitere;
    private String comentariu;
    private String justificare;
    private String documentePath;

    public CerereCazSocialDTO() {}

    public CerereCazSocialDTO(Integer id, Long studentId, String studentName, String status,
                              String dataTrimitere, String comentariu,
                              String justificare, String documentePath) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.status = status;
        this.dataTrimitere = dataTrimitere;
        this.comentariu = comentariu;
        this.justificare = justificare;
        this.documentePath = documentePath;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDataTrimitere() { return dataTrimitere; }
    public void setDataTrimitere(String dataTrimitere) { this.dataTrimitere = dataTrimitere; }

    public String getComentariu() { return comentariu; }
    public void setComentariu(String comentariu) { this.comentariu = comentariu; }

    public String getJustificare() { return justificare; }
    public void setJustificare(String justificare) { this.justificare = justificare; }

    public String getDocumentePath() { return documentePath; }
    public void setDocumentePath(String documentePath) { this.documentePath = documentePath; }
}
