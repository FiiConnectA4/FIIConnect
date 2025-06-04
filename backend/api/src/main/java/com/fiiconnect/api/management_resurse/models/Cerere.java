package com.fiiconnect.api.management_resurse.models;

import com.fiiconnect.api.didactic.models.Student;

public interface Cerere {
    Integer getId();
    Student getStudent();
    String getTip(); // poate fi "DECONT", "ADEVERINTA_STUDENT", etc.
    String getStatus();
    String getDataTrimitere();
    String getComentariu();
    String getContinut(); // JSON-ul cu datele specifice cererii

    void setId(Integer id);
    void setStudent(Student student);
    void setTip(String tip);
    void setStatus(String status);
    void setDataTrimitere(String dataTrimitere);
    void setComentariu(String comentariu);
    void setContinut(String continut);
}
