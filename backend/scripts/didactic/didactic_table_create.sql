drop table feedback;
drop table enrollment;
drop table grade;
drop table teaching;
drop table transfer_request;
drop table component_score;
drop table formula_component;
drop table formula;
drop table student;
drop table course;
drop table professor;

commit;

create table student(
    id integer primary key,
    cnp varchar2(13) unique not null,
    regNumber varchar2(30) unique not null,
    firstName varchar2(20) not null,
    lastName varchar2(20) not null,
    birthDate date not null,
    year number(1) not null,
    facultyGroup varchar2(3) not null
);

create table course(
    id integer primary key,
    code varchar2(30) not null,
    title varchar2(50) not null,
    credits number(1) not null,
    year number(1) not null,
    semester number(1) not null,
    archived number(1) not null
);

create table professor(
    id integer primary key,
    cnp varchar2(13) not null,
    firstName varchar2(20) not null,
    lastName varchar2(20) not null,
    birthDate date not null,
    rank varchar2(20) not null
);

create table grade(
    idStud integer not null,
    idCourse integer not null,
    value number(4,2) not null,
    gradingDate date not null,
    foreign key (idStud) references student(id) on delete cascade,
    foreign key (idCourse) references course(id) on delete cascade,
    unique(idStud, idCourse)
);

create table teaching(
    idProf integer not null,
    idCourse integer not null,
    role varchar2(20) not null,
    foreign key (idProf) references professor(id) on delete cascade,
    foreign key (idCourse) references course(id) on delete cascade,
    unique(idProf, idCourse)
);

create table formula(
    id integer primary key,
    idCourse integer not null,
    formulaText varchar2(300),
    foreign key (idCourse) references course(id) on delete cascade
);

create table formula_component(
    id integer primary key,
    idFormula integer not null,
    name varchar2(20),
    foreign key (idFormula) references formula(id) on delete cascade
);

create table component_score(
    idStud integer not null,
    idComponent integer not null,
    value number(4,2) not null,
    foreign key (idStud) references student(id) on delete cascade,
    foreign key (idComponent) references formula_component(id) on delete cascade,
    unique(idStud, idComponent)
);

create table enrollment(
    idStud integer not null,
    idCourse integer not null,
    facultyGroup varchar2(3) not null,
    foreign key (idStud) references student(id) on delete cascade,
    foreign key (idCourse) references course(id) on delete cascade,
    unique(idStud, idCourse)
);

create table transfer_request(
    idStud integer not null,
    idCourse integer not null,
    facultyGroup varchar2(3) not null,
    reasonText varchar2(300) not null,
    foreign key (idStud) references student(id) on delete cascade,
    foreign key (idCourse) references course(id) on delete cascade,
    unique(idStud, idCourse)
);

create table feedback(
    idStud integer not null,
    idProf integer not null,
    feedbackText varchar2(500) not null,
    teachingGrade number(4,2) not null,
    materialsGrade number(4,2) not null,
    evaluationGrade number(4,2) not null,
    foreign key (idStud) references student(id) on delete cascade,
    foreign key (idProf) references professor(id) on delete cascade,
    unique(idStud, idProf)
);

commit;