package com.fiiconnect.api.management_resurse;

public class SalaDTO {
    
    private Integer capacitate;
    private String dotari;
    private String observatii;
    private String locatie;

    public SalaDTO(Integer capacitate, String dotari, String observatii, String locatie) {
        this.capacitate = capacitate;
        this.dotari = dotari;
        this.observatii = observatii;
        this.locatie = locatie;
    }

    public Integer getCapacitate() { return capacitate;}
    public String getDotari() { return dotari; }
    public String getObservatii() { return observatii; }
    public String getLocatie() { return locatie; }
}

