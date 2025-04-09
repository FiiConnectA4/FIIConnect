package com.fiiconnect.api.didactic;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.Objects;
@Entity
public class Course{
    private @Id @GeneratedValue Long id;
	String code, title;
	int credits, year, semester, archived;
	public Course() {}
	public Course(String code, String title, int credits, int year, int semester, int archived) {
		this.code = code;
		this.title = title;
		this.credits = credits;
		this.year = year;
		this.semester = semester;
		this.archived = archived;
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
				'}';
	}

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof Course course)) return false;
        return credits == course.credits && year == course.year && semester == course.semester && archived == course.archived && Objects.equals(id, course.id) && Objects.equals(code, course.code) && Objects.equals(title, course.title);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, code, title, credits, year, semester, archived);
	}

}
