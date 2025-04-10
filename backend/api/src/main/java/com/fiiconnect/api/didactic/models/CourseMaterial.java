package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;

import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "course_material")
public class CourseMaterial {
    private @Id @GeneratedValue Long id;
    private Long idCourse;
    @Column(name = "idProf")
    private Long idProfessor;

    private String filename;
    private Date uploadDate;
    private Date updateDate;


    public CourseMaterial() {
    }

    public CourseMaterial(Long id, Long idCourse, Long idProfessor, String filename, Date uploadDate, Date updateDate) {
        this.id = id;
        this.idCourse = idCourse;
        this.idProfessor = idProfessor;
        this.filename = filename;
        this.uploadDate = uploadDate;
        this.updateDate = updateDate;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof CourseMaterial that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(idCourse, that.idCourse) && Objects.equals(idProfessor, that.idProfessor) && Objects.equals(filename, that.filename) && Objects.equals(uploadDate, that.uploadDate) && Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, idCourse, idProfessor, filename, uploadDate, updateDate);
    }

    @Override
    public String toString() {
        return "CourseMaterial{" +
                "id=" + id +
                ", idCourse=" + idCourse +
                ", idProfessor=" + idProfessor +
                ", filename='" + filename + '\'' +
                ", uploadDate=" + uploadDate +
                ", updateDate=" + updateDate +
                '}';
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCourse() {
        return idCourse;
    }

    public void setIdCourse(Long idCourse) {
        this.idCourse = idCourse;
    }

    public Long getIdProfessor() {
        return idProfessor;
    }

    public void setIdProfessor(Long idProfessor) {
        this.idProfessor = idProfessor;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public Date getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(Date uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}
