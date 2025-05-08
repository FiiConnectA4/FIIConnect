package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Entity
public class Course{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "course_id_gen")
	@SequenceGenerator(name="course_id_gen", sequenceName = "seq_course_id", allocationSize = 1, initialValue = 1)
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
	private List<Grade> grades = null;

	@Transient
	private String description = null;

	@Transient
	private String icon_url = null;

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
}
