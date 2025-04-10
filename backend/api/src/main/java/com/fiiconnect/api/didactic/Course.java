package com.fiiconnect.api.didactic;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
public class Course{
    private @Id @GeneratedValue Long id;
	String code, title;
	int credits, year, semester, archived;
	Date academicYear;

	@Transient
	private List<CourseMaterial> materials;

	@Transient
	private List<Teaching> professors = null;

	public Course() {}

	public Course(Long id, String code, String title, int credits, int year, int semester, int archived, Date academicYear) {
		this.id = id;
		this.code = code;
		this.title = title;
		this.credits = credits;
		this.year = year;
		this.semester = semester;
		this.archived = archived;
		this.academicYear = academicYear;
	}

	public String getCode() {
		return code;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getArchived() {
		return archived;
	}

	public void setArchived(int archived) {
		this.archived = archived;
	}

	public int getSemester() {
		return semester;
	}

	public void setSemester(int semester) {
		this.semester = semester;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getCredits() {
		return credits;
	}

	public void setCredits(int credits) {
		this.credits = credits;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<CourseMaterial> getMaterials() {
		return materials;
	}

	public void setMaterials(List<CourseMaterial> materials) {
		this.materials = materials;
	}

	public List<Teaching> getProfessors() {
		return professors;
	}

	public void setProfessors(List<Teaching> professors) {
		this.professors = professors;
	}

	public Date getAcademicYear() {
		return academicYear;
	}

	public void setAcademicYear(Date academicYear) {
		this.academicYear = academicYear;
	}

	@Override
	public String toString() {
		return "Course{" +
				"id=" + id +
				", code='" + code + '\'' +
				", title='" + title + '\'' +
				", credits=" + credits +
				", year=" + year +
				", semester=" + semester +
				", archived=" + archived +
				", academicYear=" + academicYear +
				'}';
	}

	@Override
	public boolean equals(Object o) {
		if (o == null || getClass() != o.getClass()) return false;
		Course course = (Course) o;
		return credits == course.credits && year == course.year && semester == course.semester && archived == course.archived && Objects.equals(id, course.id) && Objects.equals(code, course.code) && Objects.equals(title, course.title) && Objects.equals(academicYear, course.academicYear);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, code, title, credits, year, semester, archived, academicYear);
	}
}
