package com.fiiconnect.api.management_resurse.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "cereri_decontare")
public class CerereDecontare extends CerereGenerica {

    private String iban;
    private String dataAchizitie;
    private String tipAbonament; // Fizic sau Online

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

    public CerereDecontare() {
        this.tip = "DECONTARE";
    }

    public CerereDecontare(String iban, String dataAchizitie, String tipAbonament, String serieCardTransport, String numarCardTransport, String serieBonFiscal, String numarBonFiscal, String chitantaAbonamentPath, String dovadaPlataPath, String durataAbonament, Integer procentSolicitat) {
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

    public Long getStudentId()
    {return student.getId(); }


    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getDataAchizitie() {
        return dataAchizitie;
    }

    public void setDataAchizitie(String dataAchizitie) {
        this.dataAchizitie = dataAchizitie;
    }

    public String getTipAbonament() {
        return tipAbonament;
    }

    public void setTipAbonament(String tipAbonament) {
        this.tipAbonament = tipAbonament;
    }

    public String getSerieCardTransport() {
        return serieCardTransport;
    }

    public void setSerieCardTransport(String serieCardTransport) {
        this.serieCardTransport = serieCardTransport;
    }

    public String getNumarCardTransport() {
        return numarCardTransport;
    }

    public void setNumarCardTransport(String numarCardTransport) {
        this.numarCardTransport = numarCardTransport;
    }

    public String getSerieBonFiscal() {
        return serieBonFiscal;
    }

    public void setSerieBonFiscal(String serieBonFiscal) {
        this.serieBonFiscal = serieBonFiscal;
    }

    public String getNumarBonFiscal() {
        return numarBonFiscal;
    }

    public void setNumarBonFiscal(String numarBonFiscal) {
        this.numarBonFiscal = numarBonFiscal;
    }

    public String getChitantaAbonamentPath() {
        return chitantaAbonamentPath;
    }

    public void setChitantaAbonamentPath(String chitantaAbonamentPath) {
        this.chitantaAbonamentPath = chitantaAbonamentPath;
    }

    public String getDovadaPlataPath() {
        return dovadaPlataPath;
    }

    public void setDovadaPlataPath(String dovadaPlataPath) {
        this.dovadaPlataPath = dovadaPlataPath;
    }

    public String getDurataAbonament() {
        return durataAbonament;
    }

    public void setDurataAbonament(String durataAbonament) {
        this.durataAbonament = durataAbonament;
    }

    public Integer getProcentSolicitat() {
        return procentSolicitat;
    }

    public void setProcentSolicitat(Integer procentSolicitat) {
        this.procentSolicitat = procentSolicitat;
    }


    @Override
    public String toString() {
        return "CerereDecontare{" +
                "iban='" + iban + '\'' +
                ", dataAchizitie='" + dataAchizitie + '\'' +
                ", tipAbonament='" + tipAbonament + '\'' +
                ", serieCardTransport='" + serieCardTransport + '\'' +
                ", numarCardTransport='" + numarCardTransport + '\'' +
                ", serieBonFiscal='" + serieBonFiscal + '\'' +
                ", numarBonFiscal='" + numarBonFiscal + '\'' +
                ", chitantaAbonamentPath='" + chitantaAbonamentPath + '\'' +
                ", dovadaPlataPath='" + dovadaPlataPath + '\'' +
                ", durataAbonament='" + durataAbonament + '\'' +
                ", procentSolicitat=" + procentSolicitat +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        CerereDecontare that = (CerereDecontare) o;
        return Objects.equals(iban, that.iban) && Objects.equals(dataAchizitie, that.dataAchizitie) && Objects.equals(tipAbonament, that.tipAbonament) && Objects.equals(serieCardTransport, that.serieCardTransport) && Objects.equals(numarCardTransport, that.numarCardTransport) && Objects.equals(serieBonFiscal, that.serieBonFiscal) && Objects.equals(numarBonFiscal, that.numarBonFiscal) && Objects.equals(chitantaAbonamentPath, that.chitantaAbonamentPath) && Objects.equals(dovadaPlataPath, that.dovadaPlataPath) && Objects.equals(durataAbonament, that.durataAbonament) && Objects.equals(procentSolicitat, that.procentSolicitat);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), iban, dataAchizitie, tipAbonament, serieCardTransport, numarCardTransport, serieBonFiscal, numarBonFiscal, chitantaAbonamentPath, dovadaPlataPath, durataAbonament, procentSolicitat);
    }
}
