package com.fiiconnect.api.didactic;

import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
public class Course{
    private @Id @GeneratedValue Long id;
	String code, title;
	int credits, year, semester, archived;

	@OneToMany(mappedBy = "idCourse")
	private Set<CourseMaterial> materials;

	@OneToMany(mappedBy = "id.idCourse")
	private Set<Teaching> professors;

	public Course() {}

	public Course(Long id, String code, String title, int credits, int year, int semester, int archived, Set<CourseMaterial> materials, Set<Teaching> professors) {
		this.id = id;
		this.code = code;
		this.title = title;
		this.credits = credits;
		this.year = year;
		this.semester = semester;
		this.archived = archived;
		this.materials = materials;
		this.professors = professors;
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

	public Set<CourseMaterial> getMaterials() {
		return materials;
	}

	public void setMaterials(Set<CourseMaterial> materials) {
		this.materials = materials;
	}

	public Set<Teaching> getProfessors() {
		return professors;
	}

	public void setProfessors(Set<Teaching> professors) {
		this.professors = professors;
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
				", materials=" + materials +
				", professors=" + professors +
				'}';
	}

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof Course course)) return false;
        return getCredits() == course.getCredits() && getYear() == course.getYear() && getSemester() == course.getSemester() && getArchived() == course.getArchived() && Objects.equals(getId(), course.getId()) && Objects.equals(getCode(), course.getCode()) && Objects.equals(getTitle(), course.getTitle()) && Objects.equals(getMaterials(), course.getMaterials()) && Objects.equals(getProfessors(), course.getProfessors());
	}

	@Override
	public int hashCode() {
		return Objects.hash(getId(), getCode(), getTitle(), getCredits(), getYear(), getSemester(), getArchived(), getMaterials(), getProfessors());
	}
}
