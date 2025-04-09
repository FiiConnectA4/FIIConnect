package com.fiiconnect.api.didactic;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

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
