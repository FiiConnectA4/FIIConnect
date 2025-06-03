package com.fiiconnect.api.management_resurse.models;

import jakarta.persistence.*;
///import jakarta.validation.constraints.Max;
////import jakarta.validation.constraints.Min;

@Entity
@Table(name = "sali")
public class Sala {
    @Id
    @SequenceGenerator(name = "sala_seq", sequenceName = "SALA_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sala_seq")
    private Long id;

    private String nume;
    private Integer capacitate;
    private String tipSala;
    private String locatie;
    private String imagineUrl;
    private String dotari;
    private String observatii;

    // 0 = liber, 1 = rezervat
    /// @Min(0)
    ///@Max(1)
    private Integer rezervat = 0;

    private String profesorRezervare;     // ex: "Popescu Ion"
    private String oraStartRezervare;     // ex: "10:00"
    private String oraEndRezervare;       // ex: "12:00"

    public Sala() {}

    public Sala(String nume, Integer capacitate, String tipSala, String locatie,
                String imagineUrl, String dotari, String observatii) {
        this.nume = nume;
        this.capacitate = capacitate;
        this.tipSala = tipSala;
        this.locatie = locatie;
        this.imagineUrl = imagineUrl;
        this.dotari = dotari;
        this.observatii = observatii;
    }

    // Getters și Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNume() { return nume; }
    public void setNume(String nume) { this.nume = nume; }

    public Integer getCapacitate() { return capacitate; }
    public void setCapacitate(Integer capacitate) { this.capacitate = capacitate; }

    public String getTipSala() { return tipSala; }
    public void setTipSala(String tipSala) { this.tipSala = tipSala; }

    public String getLocatie() { return locatie; }
    public void setLocatie(String locatie) { this.locatie = locatie; }

    public String getImagineUrl() { return imagineUrl; }
    public void setImagineUrl(String imagineUrl) { this.imagineUrl = imagineUrl; }

    public String getDotari() { return dotari; }
    public void setDotari(String dotari) { this.dotari = dotari; }

    public String getObservatii() { return observatii; }
    public void setObservatii(String observatii) { this.observatii = observatii; }

    public Integer getRezervat() { return rezervat; }
    public void setRezervat(Integer rezervat) { this.rezervat = rezervat; }

    public String getProfesorRezervare() { return profesorRezervare; }
    public void setProfesorRezervare(String profesorRezervare) { this.profesorRezervare = profesorRezervare; }

    public String getOraStartRezervare() { return oraStartRezervare; }
    public void setOraStartRezervare(String oraStartRezervare) { this.oraStartRezervare = oraStartRezervare; }

    public String getOraEndRezervare() { return oraEndRezervare; }
    public void setOraEndRezervare(String oraEndRezervare) { this.oraEndRezervare = oraEndRezervare; }
}