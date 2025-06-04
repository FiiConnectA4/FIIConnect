set sqlblanklines on;

drop table feedback;
drop table material;
drop table enrollment;
drop table grade;
drop table teaching;
drop table transfer_request;
drop table component_score;
drop table formula_component;
drop table formula;
drop table student cascade constraints;
drop table course cascade constraints;
drop table professor cascade constraints;
drop table global_constant;

commit;

create table global_constant(
    name varchar2(256) primary key,
    value varchar2(256)
);

create table student(
    id integer constraint c_student_pk_id primary key,
    cnp varchar2(13) 
        constraint c_student_nn_cnp not null
        constraint c_student_uq_cnp unique,
    regNumber varchar2(30) 
        constraint c_student_nn_regNumber not null
        constraint c_sutdent_uq_regNumber unique,
    firstName varchar2(20) constraint c_student_nn_firstName not null,
    lastName varchar2(20) constraint c_student_nn_lastName not null,
    year number(1) constraint c_student_nn_year not null,
    facultyGroup varchar2(3) constraint c_student_nn_facultyGroup not null
);

create table course(
    id integer constraint c_course_pk_id primary key,
    code varchar2(30) 
        constraint c_course_nn_code not null
        constraint c_course_uq_code unique,
    title varchar2(50) constraint c_course_nn_title not null,
    credits number(1) constraint c_course_nn_credits not null,
    year number(1) constraint c_course_nn_year not null,
    semester number(1) constraint c_course_nn_semester not null,
    archived number(1) constraint c_course_nn_archived not null,
    academicYear date constraint c_course_nn_academicYear not null
);

create table professor(
    id integer constraint c_professor_pk_id primary key,
    cnp varchar2(13) 
        constraint c_professor_nn_cnp not null
        constraint c_professor_uq_cnp unique,
    firstName varchar2(20) constraint c_professor_nn_firstName not null,
    lastName varchar2(20) constraint c_professor_nn_lastName not null,
    rank varchar2(20) constraint c_professor_nn_rank not null
);

create table grade(
    idStud integer constraint c_grade_nn_idStud not null,
    idCourse integer constraint c_grade_nn_idCourse not null,
    value number(4,2) constraint c_grade_nn_value not null,
    gradingDate date constraint c_grade_nn_gradingDate not null,

    constraint c_grade_fk_idStud foreign key (idStud) references student(id) on delete cascade,
    constraint c_grade_fk_idCourse foreign key (idCourse) references course(id) on delete cascade,
    
    constraint c_grade_uq_compkey unique(idStud, idCourse)
);

create table teaching(
    idProf integer constraint c_teaching_nn_idProf not null,
    idCourse integer constraint c_teaching_nn_idCourse not null,
    role varchar2(20) constraint c_teaching_nn_role not null,

    constraint c_teaching_fk_idProf foreign key (idProf) references professor(id) on delete cascade,
    constraint c_teaching_fk_idCourse foreign key (idCourse) references course(id) on delete cascade,
    
    constraint c_teaching_uq_compkey unique(idProf, idCourse)
);

create table formula(
    id integer constraint c_formula_pk_id primary key,
    idCourse integer
        constraint c_formula_nn_idCourse not null
        constraint c_formula_uq_idCourse unique,
    text varchar2(300) constraint c_formula_nn_text not null,
    
    constraint c_formula_fk_idCourse foreign key (idCourse) references course(id) on delete cascade
);

create table formula_component(
    id integer constraint c_frm_comp_pk_id primary key,
    idFormula integer constraint c_frm_comp_nn_idFormula not null,
    name varchar2(20) constraint c_frm_comp_nn_name not null,
    
    constraint c_frm_comp_fk_idFormula foreign key (idFormula) references formula(id) on delete cascade,
    
    constraint c_frm_comp_uq_compkey unique(idFormula, name)
);

create table component_score(
    idStud integer constraint c_comp_score_nn_idStud not null,
    idComponent integer constraint c_comp_score_nn_idComponent not null,
    value number(4,2) constraint c_comp_score_nn_value not null,
    
    constraint c_comp_score_fk_idStud foreign key (idStud) references student(id) on delete cascade,
    constraint c_comp_score_fk_idComponent foreign key (idComponent) references formula_component(id) on delete cascade,
    
    constraint c_comp_score_uq_compkey unique(idStud, idComponent)
);

create table enrollment(
    idStud integer constraint c_enrollment_nn_idStud not null,
    idCourse integer constraint c_enrollment_nn_idCourse not null,
    facultyGroup varchar2(3) constraint c_enrollment_nn_facultyGroup not null,
    
    constraint c_enrollment_fk_idStud foreign key (idStud) references student(id) on delete cascade,
    constraint c_enrollment_fk_idCourse foreign key (idCourse) references course(id) on delete cascade,
    
    constraint c_enrollment_uq_compkey unique(idStud, idCourse)
);

create table transfer_request(
    idStud integer constraint c_tr_req_nn_idStud not null,
    idCourse integer constraint c_tr_req_nn_idCourse not null,
    facultyGroup varchar2(3) constraint c_tr_req_nn_facultyGroup not null,
    reasonText varchar2(300) constraint c_tr_req_nn_reasonText not null,
    requestDate date constraint c_tr_req_nn_requestDate not null,
    
    constraint c_tr_req_fk_idStud foreign key (idStud) references student(id) on delete cascade,
    constraint c_tr_req_fk_idCourse foreign key (idCourse) references course(id) on delete cascade,
    
    constraint c_tr_req_uq_compkey unique(idStud, idCourse)
);

create table feedback(
    idStud integer constraint c_feedback_nn_idStud not null,
    idProf integer constraint c_feedback_nn_idProf not null,
    feedbackText varchar2(500) constraint c_feedback_nn_feedbackText not null,
    teachingGrade number(4,2) constraint c_feedback_nn_teachingGrade not null,
    materialsGrade number(4,2) constraint c_feedback_nn_materialsGrade not null,
    evaluationGrade number(4,2) constraint c_feedback_nn_evaluationGrade not null,
    
    constraint c_feedback_fk_idStud foreign key (idStud) references student(id) on delete cascade,
    constraint c_feedback_fk_idProf foreign key (idProf) references professor(id) on delete cascade,
    
    constraint c_feedback_uniq_compkey unique(idStud, idProf)
);

create table material(
    id integer constraint c_material_pk_id primary key,
    idCourse integer constraint c_material_nn_idCourse not null,
    idProf integer constraint c_material_nn_idProf not null,
    filename varchar2(255) constraint c_material_nn_filename not null,
    uploadDate date constraint c_material_nn_uploadDate not null,
    updateDate date constraint c_material_nn_updateDate not null,

    constraint c_material_fk_idCourse foreign key (idCourse) references course(id) on delete cascade,
    constraint c_material_fk_idProf foreign key (idProf) references professor(id) on delete cascade,
    
    constraint c_material_uq_fname_per_course unique(idCourse, filename)
);

commit;