package com.fiiconnect.api.management_resurse.dtos;

public class CerereBursaSocialaDTO {
    private Integer id;
    private Long studentId;
    private String studentName;
    private String status;
    private String dataTrimitere;
    private String comentariu;
    private Integer anStudent;
    private String facultate;
    private String dosarPath;

    public CerereBursaSocialaDTO() {}

    public CerereBursaSocialaDTO(Integer id, Long studentId, String studentName, String status,
                                 String dataTrimitere, String comentariu,
                                 Integer anStudent, String facultate, String dosarPath) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.status = status;
        this.dataTrimitere = dataTrimitere;
        this.comentariu = comentariu;
        this.anStudent = anStudent;
        this.facultate = facultate;
        this.dosarPath = dosarPath;
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

    public Integer getAnStudent() { return anStudent; }
    public void setAnStudent(Integer anStudent) { this.anStudent = anStudent; }

    public String getFacultate() { return facultate; }
    public void setFacultate(String facultate) { this.facultate = facultate; }

    public String getDosarPath() { return dosarPath; }
    public void setDosarPath(String dosarPath) { this.dosarPath = dosarPath; }
}
