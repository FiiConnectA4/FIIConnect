package com.fiiconnect.api.management_resurse;

public class SalaDTO {

    private Integer capacitate;
    private String dotari;
    private String observatii;
    private String locatie;

    private Integer rezervat;

    private String profesorRezervare;
    private String oraStartRezervare;
    private String oraEndRezervare;

    public SalaDTO(Integer capacitate, String dotari, String observatii, String locatie,
                   Integer rezervat, String profesorRezervare,
                   String oraStartRezervare, String oraEndRezervare) {
        this.capacitate = capacitate;
        this.dotari = dotari;
        this.observatii = observatii;
        this.locatie = locatie;
        this.rezervat = rezervat;
        this.profesorRezervare = profesorRezervare;
        this.oraStartRezervare = oraStartRezervare;
        this.oraEndRezervare = oraEndRezervare;
    }

    // Getters
    public Integer getCapacitate() { return capacitate; }
    public String getDotari() { return dotari; }
    public String getObservatii() { return observatii; }
    public String getLocatie() { return locatie; }

    public Integer getRezervat() { return rezervat; }
    public String getProfesorRezervare() { return profesorRezervare; }
    public String getOraStartRezervare() { return oraStartRezervare; }
    public String getOraEndRezervare() { return oraEndRezervare; }
}