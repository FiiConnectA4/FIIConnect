package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@Entity
public class Course{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "course_id_gen")
	@SequenceGenerator(name="course_id_gen", sequenceName = "seq_course_id", allocationSize = 1)
	private Long id;
	String code, title;
	Integer credits, year, semester, archived;
	Date academicYear;

	@Transient
	private List<CourseMaterial> materials = null;

	@Transient
	private List<Teaching> professors = null;

	@Transient
	private List<Enrollment> enrollments = null;

	@Transient
	private String description = null;

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
		if (!(o instanceof Course course)) return false;
        return Objects.equals(getId(), course.getId()) && Objects.equals(getCode(), course.getCode()) && Objects.equals(getTitle(), course.getTitle()) && Objects.equals(getCredits(), course.getCredits()) && Objects.equals(getYear(), course.getYear()) && Objects.equals(getSemester(), course.getSemester()) && Objects.equals(getArchived(), course.getArchived()) && Objects.equals(getAcademicYear(), course.getAcademicYear()) && Objects.equals(getMaterials(), course.getMaterials()) && Objects.equals(getProfessors(), course.getProfessors());
	}

	@Override
	public int hashCode() {
		return Objects.hash(getId(), getCode(), getTitle(), getCredits(), getYear(), getSemester(), getArchived(), getAcademicYear(), getMaterials(), getProfessors());
	}
}
