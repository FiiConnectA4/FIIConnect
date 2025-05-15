drop sequence seq_student_id;
drop sequence seq_course_id;
drop sequence seq_professor_id;
drop sequence seq_formula_id;
drop sequence seq_formula_component_id;
drop sequence seq_material_id;

commit;

create sequence seq_student_id start with 1 increment by 1 minvalue 1 nomaxvalue;
create sequence seq_course_id start with 1 increment by 1 minvalue 1 nomaxvalue;
create sequence seq_professor_id start with 1 increment by 1 minvalue 1 nomaxvalue;
create sequence seq_formula_id start with 1 increment by 1 minvalue 1 nomaxvalue;
create sequence seq_formula_component_id start with 1 increment by 1 minvalue 1 nomaxvalue;
create sequence seq_material_id start with 1 increment by 1 minvalue 1 nomaxvalue;

commit;
exit;