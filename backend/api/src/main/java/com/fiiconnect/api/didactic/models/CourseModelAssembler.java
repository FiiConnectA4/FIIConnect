package com.fiiconnect.api.didactic.models;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.fiiconnect.api.didactic.controllers.CourseController;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class CourseModelAssembler implements RepresentationModelAssembler<Course, EntityModel<Course>> {
    @Override
    public EntityModel<Course> toModel(Course course) {
        return EntityModel.of(course,
                linkTo(methodOn(CourseController.class).one(course.getId())).withSelfRel(),
                linkTo(methodOn(CourseController.class).all()).withRel("/didactic/course"));
    }
}
