package com.fiiconnect.api.management_resurse.dtos;

import com.fiiconnect.api.didactic.models.Student;

public class CerereDecontareDTO {
    private Integer id;
    private Long studentId;
    private String studentName;
    private String status;
    private String dataTrimitere;
    private String comentariu;

    private String iban;
    private String dataAchizitie;
    private String tipAbonament;

    // Doar dacă e Fizic
    private String serieCardTransport;
    private String numarCardTransport;
    private String serieBonFiscal;
    private String numarBonFiscal;

    // Doar dacă e Online
    private String chitantaAbonamentPath;
    private String dovadaPlataPath;

    private String durataAbonament;
    private Integer procentSolicitat;

    Student student;


    public CerereDecontareDTO() {}

    public CerereDecontareDTO(Integer id, Long studentId, String studentName, String status, String dataTrimitere,
                              String comentariu, String iban, String dataAchizitie, String tipAbonament,
                              String serieCardTransport, String numarCardTransport, String serieBonFiscal,
                              String numarBonFiscal, String chitantaAbonamentPath, String dovadaPlataPath,
                              String durataAbonament, Integer procentSolicitat) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.status = status;
        this.dataTrimitere = dataTrimitere;
        this.comentariu = comentariu;
        this.iban = iban;
        this.dataAchizitie = dataAchizitie;
        this.tipAbonament = tipAbonament;
        this.serieCardTransport = serieCardTransport;
        this.numarCardTransport = numarCardTransport;
        this.serieBonFiscal = serieBonFiscal;
        this.numarBonFiscal = numarBonFiscal;
        this.chitantaAbonamentPath = chitantaAbonamentPath;
        this.dovadaPlataPath = dovadaPlataPath;
        this.durataAbonament = durataAbonament;
        this.procentSolicitat = procentSolicitat;
    }

    // Getteri și setteri

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

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public String getDataAchizitie() { return dataAchizitie; }
    public void setDataAchizitie(String dataAchizitie) { this.dataAchizitie = dataAchizitie; }

    public String getTipAbonament() { return tipAbonament; }
    public void setTipAbonament(String tipAbonament) { this.tipAbonament = tipAbonament; }

    public String getSerieCardTransport() { return serieCardTransport; }
    public void setSerieCardTransport(String serieCardTransport) { this.serieCardTransport = serieCardTransport; }

    public String getNumarCardTransport() { return numarCardTransport; }
    public void setNumarCardTransport(String numarCardTransport) { this.numarCardTransport = numarCardTransport; }

    public String getSerieBonFiscal() { return serieBonFiscal; }
    public void setSerieBonFiscal(String serieBonFiscal) { this.serieBonFiscal = serieBonFiscal; }

    public String getNumarBonFiscal() { return numarBonFiscal; }
    public void setNumarBonFiscal(String numarBonFiscal) { this.numarBonFiscal = numarBonFiscal; }

    public String getChitantaAbonamentPath() { return chitantaAbonamentPath; }
    public void setChitantaAbonamentPath(String chitantaAbonamentPath) { this.chitantaAbonamentPath = chitantaAbonamentPath; }

    public String getDovadaPlataPath() { return dovadaPlataPath; }
    public void setDovadaPlataPath(String dovadaPlataPath) { this.dovadaPlataPath = dovadaPlataPath; }

    public String getDurataAbonament() { return durataAbonament; }
    public void setDurataAbonament(String durataAbonament) { this.durataAbonament = durataAbonament; }

    public Integer getProcentSolicitat() { return procentSolicitat; }
    public void setProcentSolicitat(Integer procentSolicitat) { this.procentSolicitat = procentSolicitat; }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
