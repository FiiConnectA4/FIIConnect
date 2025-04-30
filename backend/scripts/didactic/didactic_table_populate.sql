declare
    type id_table is table of integer;

    student_ids id_table := id_table();
    course_ids id_table := id_table();
    professor_ids id_table := id_table();
    formula_ids id_table := id_table();
    formula_component_ids id_table := id_table();
    material_ids id_table := id_table();
begin

for v_index in 1..6 loop
    student_ids.extend;
    student_ids(student_ids.last) := seq_student_id.nextval;
end loop;

delete student;
insert into student values(student_ids(1), 5010101010011, '45619201RSL231000', 'Vasile', 'Capsunaru', 1, 'E3');
insert into student values(student_ids(2), 6020821010209, '45619201RSL231001', 'Laura', 'Pricop', 1, 'A4');
insert into student values(student_ids(3), 5011109071001, '45619201RSL231002', 'Ion', 'Baltag', 2, 'B1');
insert into student values(student_ids(4), 6010515033322, '45619201RSL231003', 'Mioara', 'Miorita', 2, 'A2');
insert into student values(student_ids(5), 5020103010013, '45619201RSL231004', 'Leon', 'Traian', 3, 'B2');
insert into student values(student_ids(6), 6011225117620, '45619201RSL231005', 'Narcisa', 'Grecu', 3, 'E1');

for v_index in 1..12 loop
    course_ids.extend;
    course_ids(course_ids.last) := seq_course_id.nextval;
end loop;

delete course;
insert into course values(course_ids(1), 'FIICSBSC2024010001', 'Introducere in programare', 4, 1, 1, 1, sysdate - 180);
insert into course values(course_ids(2), 'FIICSBSC2024010002', 'Sisteme de operare', 6, 1, 2, 0, sysdate);
insert into course values(course_ids(3), 'FIICSBSC2024020001', 'Programare Rust', 5, 2, 1, 1, sysdate - 180);
insert into course values(course_ids(4), 'FIICSBSC2024020002', 'Tehnologii Web', 6, 2, 2, 0, sysdate);
insert into course values(course_ids(5), 'FIICSBSC2024030001', 'Introducere in Python', 4, 3, 1, 1, sysdate - 180);
insert into course values(course_ids(6), 'FIICSBSC2024030002', 'Retele Petri', 5, 3, 2, 0, sysdate);
insert into course values(course_ids(7), 'FIICSBSC2022010001', 'Introducere in programare', 4, 1, 1, 1, sysdate - 2*365 - 180);
insert into course values(course_ids(8), 'FIICSBSC2022010002', 'Sisteme de operare', 6, 1, 2, 1, sysdate - 2*365);
insert into course values(course_ids(9), 'FIICSBSC2023020001', 'Programare Rust', 5, 2, 1, 1, sysdate - 365 - 180);
insert into course values(course_ids(10), 'FIICSBSC2023020002', 'Tehnologii Web', 6, 2, 2, 1, sysdate - 365);
insert into course values(course_ids(11), 'FIICSBSC2023010001', 'Introducere in programare', 4, 1, 1, 1, sysdate - 365 - 180);
insert into course values(course_ids(12), 'FIICSBSC2023010002', 'Sisteme de operare', 6, 1, 2, 1, sysdate - 365);

for v_index in 1..6 loop
    professor_ids.extend;
    professor_ids(professor_ids.last) := seq_professor_id.nextval;
end loop;

delete professor;
insert into professor values(professor_ids(1), 1801108010011, 'Marius', 'Titus', 'lect');
insert into professor values(professor_ids(2), 2810523044951, 'Ana', 'Blandiana', 'prof univ');
insert into professor values(professor_ids(3), 1820229130218, 'Silviu', 'Candale', 'asist');
insert into professor values(professor_ids(4), 2750301436710, 'Emanuela', 'Cerchez', 'conf');
insert into professor values(professor_ids(5), 1850718095915, 'Dan', 'Pracsiu', 'drd');
insert into professor values(professor_ids(6), 2950107139992, 'Ligia', 'Deca', 'colab');

delete grade;
insert into grade values(student_ids(1), course_ids(1), 10, sysdate - 80);
insert into grade values(student_ids(2), course_ids(1), 10, sysdate - 80);
insert into grade values(student_ids(3), course_ids(11), 10, sysdate - 80 - 365);
insert into grade values(student_ids(3), course_ids(12), 10, sysdate - 365);
insert into grade values(student_ids(3), course_ids(3), 10, sysdate - 80);
insert into grade values(student_ids(4), course_ids(11), 10, sysdate - 80 - 365);
insert into grade values(student_ids(4), course_ids(12), 10, sysdate - 365);
insert into grade values(student_ids(4), course_ids(3), 10, sysdate - 80);
insert into grade values(student_ids(5), course_ids(7), 10, sysdate - 80 - 2*365);
insert into grade values(student_ids(5), course_ids(8), 10, sysdate - 2*365);
insert into grade values(student_ids(5), course_ids(9), 10, sysdate - 80 - 365);
insert into grade values(student_ids(5), course_ids(10), 10, sysdate - 365);
insert into grade values(student_ids(5), course_ids(5), 10, sysdate - 80);
insert into grade values(student_ids(6), course_ids(7), 10, sysdate - 80 - 2*365);
insert into grade values(student_ids(6), course_ids(8), 10, sysdate - 2*365);
insert into grade values(student_ids(6), course_ids(9), 10, sysdate - 80 - 365);
insert into grade values(student_ids(6), course_ids(10), 10, sysdate - 365);
insert into grade values(student_ids(6), course_ids(5), 10, sysdate - 80);

delete teaching;
insert into teaching values(professor_ids(1), course_ids(1), 'titular');
insert into teaching values(professor_ids(1), course_ids(2), 'titular');
insert into teaching values(professor_ids(2), course_ids(1), 'seminar');
insert into teaching values(professor_ids(2), course_ids(2), 'laborator');
insert into teaching values(professor_ids(2), course_ids(3), 'titular');
insert into teaching values(professor_ids(3), course_ids(4), 'titular');
insert into teaching values(professor_ids(4), course_ids(5), 'titular');
insert into teaching values(professor_ids(5), course_ids(6), 'titular');
insert into teaching values(professor_ids(5), course_ids(1), 'seminar');
insert into teaching values(professor_ids(6), course_ids(3), 'laborator');
insert into teaching values(professor_ids(1), course_ids(7), 'titular');
insert into teaching values(professor_ids(1), course_ids(8), 'titular');
insert into teaching values(professor_ids(2), course_ids(7), 'seminar');
insert into teaching values(professor_ids(2), course_ids(8), 'laborator');
insert into teaching values(professor_ids(2), course_ids(9), 'titular');
insert into teaching values(professor_ids(3), course_ids(10), 'titular');
insert into teaching values(professor_ids(5), course_ids(7), 'seminar');
insert into teaching values(professor_ids(6), course_ids(8), 'laborator');
insert into teaching values(professor_ids(1), course_ids(11), 'titular');
insert into teaching values(professor_ids(1), course_ids(12), 'titular');
insert into teaching values(professor_ids(2), course_ids(11), 'seminar');
insert into teaching values(professor_ids(2), course_ids(12), 'laborator');

for v_index in 1..12 loop
    formula_ids.extend;
    formula_ids(formula_ids.last) := seq_formula_id.nextval;
end loop;

delete formula;
insert into formula values(formula_ids(1), course_ids(1), '(lab+examen)/2');
insert into formula values(formula_ids(2), course_ids(2), 'min(10, examen+bonus)');
insert into formula values(formula_ids(3), course_ids(3), 'lab');
insert into formula values(formula_ids(4), course_ids(4), 'min(10, 0.4*lab+0.5*examen+0.1*bonus)');
insert into formula values(formula_ids(5), course_ids(5), '(proiect+examen)/2');
insert into formula values(formula_ids(6), course_ids(6), 'proiect');
insert into formula values(formula_ids(7), course_ids(7), '(lab+examen)/2');
insert into formula values(formula_ids(8), course_ids(8), 'min(10, examen+bonus)');
insert into formula values(formula_ids(9), course_ids(9), 'lab');
insert into formula values(formula_ids(10), course_ids(10), 'min(10, 0.4*lab+0.5*examen+0.1*bonus)');
insert into formula values(formula_ids(11), course_ids(11), '(lab+examen)/2');
insert into formula values(formula_ids(12), course_ids(12), 'min(10, examen+bonus)');

for v_index in 1..23 loop
    formula_component_ids.extend;
    formula_component_ids(formula_component_ids.last) := seq_formula_component_id.nextval;
end loop;

delete formula_component;
insert into formula_component values(formula_component_ids(1), formula_ids(1), 'lab');
insert into formula_component values(formula_component_ids(2), formula_ids(1), 'examen');
insert into formula_component values(formula_component_ids(3), formula_ids(2), 'examen');
insert into formula_component values(formula_component_ids(4), formula_ids(2), 'bonus');
insert into formula_component values(formula_component_ids(5), formula_ids(3), 'lab');
insert into formula_component values(formula_component_ids(6), formula_ids(4), 'lab');
insert into formula_component values(formula_component_ids(7), formula_ids(4), 'examen');
insert into formula_component values(formula_component_ids(8), formula_ids(4), 'bonus');
insert into formula_component values(formula_component_ids(9), formula_ids(5), 'proiect');
insert into formula_component values(formula_component_ids(10), formula_ids(5), 'examen');
insert into formula_component values(formula_component_ids(11), formula_ids(6), 'proiect');
insert into formula_component values(formula_component_ids(12), formula_ids(7), 'lab');
insert into formula_component values(formula_component_ids(13), formula_ids(7), 'examen');
insert into formula_component values(formula_component_ids(14), formula_ids(8), 'examen');
insert into formula_component values(formula_component_ids(15), formula_ids(8), 'bonus');
insert into formula_component values(formula_component_ids(16), formula_ids(9), 'lab');
insert into formula_component values(formula_component_ids(17), formula_ids(10), 'lab');
insert into formula_component values(formula_component_ids(18), formula_ids(10), 'examen');
insert into formula_component values(formula_component_ids(19), formula_ids(10), 'bonus');
insert into formula_component values(formula_component_ids(20), formula_ids(11), 'lab');
insert into formula_component values(formula_component_ids(21), formula_ids(11), 'examen');
insert into formula_component values(formula_component_ids(22), formula_ids(12), 'examen');
insert into formula_component values(formula_component_ids(23), formula_ids(12), 'bonus');

delete component_score;
insert into component_score values(student_ids(1), formula_component_ids(1), 5);
insert into component_score values(student_ids(1), formula_component_ids(2), 7);
insert into component_score values(student_ids(2), formula_component_ids(1), 10);
insert into component_score values(student_ids(2), formula_component_ids(2), 10);
insert into component_score values(student_ids(3), formula_component_ids(20), 9);
insert into component_score values(student_ids(3), formula_component_ids(21), 9);
insert into component_score values(student_ids(3), formula_component_ids(22), 8);
insert into component_score values(student_ids(3), formula_component_ids(23), 4);
insert into component_score values(student_ids(3), formula_component_ids(5), 8);
insert into component_score values(student_ids(4), formula_component_ids(20), 6);
insert into component_score values(student_ids(4), formula_component_ids(21), 5);
insert into component_score values(student_ids(4), formula_component_ids(22), 3);
insert into component_score values(student_ids(4), formula_component_ids(23), 10);
insert into component_score values(student_ids(4), formula_component_ids(5), 10);
insert into component_score values(student_ids(5), formula_component_ids(12), 7);
insert into component_score values(student_ids(5), formula_component_ids(13), 6.5);
insert into component_score values(student_ids(5), formula_component_ids(14), 8);
insert into component_score values(student_ids(5), formula_component_ids(15), 8.8);
insert into component_score values(student_ids(5), formula_component_ids(16), 10);
insert into component_score values(student_ids(5), formula_component_ids(17), 10);
insert into component_score values(student_ids(5), formula_component_ids(18), 1);
insert into component_score values(student_ids(5), formula_component_ids(19), 0);
insert into component_score values(student_ids(5), formula_component_ids(9), 10);
insert into component_score values(student_ids(5), formula_component_ids(10), 10);
insert into component_score values(student_ids(6), formula_component_ids(12), 8);
insert into component_score values(student_ids(6), formula_component_ids(13), 7);
insert into component_score values(student_ids(6), formula_component_ids(14), 7.5);
insert into component_score values(student_ids(6), formula_component_ids(15), 5.3);
insert into component_score values(student_ids(6), formula_component_ids(16), 6.1);
insert into component_score values(student_ids(6), formula_component_ids(17), 9);
insert into component_score values(student_ids(6), formula_component_ids(18), 9.49);
insert into component_score values(student_ids(6), formula_component_ids(19), 9.5);
insert into component_score values(student_ids(6), formula_component_ids(9), 10);
insert into component_score values(student_ids(6), formula_component_ids(10), 10);


delete enrollment;
insert into enrollment values(student_ids(1), course_ids(1), 'A3');
insert into enrollment values(student_ids(1), course_ids(2), 'B6');
insert into enrollment values(student_ids(2), course_ids(1), 'A1');
insert into enrollment values(student_ids(2), course_ids(2), 'A2');
insert into enrollment values(student_ids(3), course_ids(3), 'B1');
insert into enrollment values(student_ids(3), course_ids(4), 'B4');
insert into enrollment values(student_ids(4), course_ids(3), 'E1');
insert into enrollment values(student_ids(4), course_ids(4), 'A5');
insert into enrollment values(student_ids(5), course_ids(5), 'A2');
insert into enrollment values(student_ids(5), course_ids(6), 'E2');
insert into enrollment values(student_ids(6), course_ids(5), 'E1');
insert into enrollment values(student_ids(6), course_ids(6), 'B3');

delete transfer_request;
insert into transfer_request values(student_ids(1), course_ids(2), 'A2', 'profesor diferit', sysdate - 30);
insert into transfer_request values(student_ids(2), course_ids(2), 'A6', 'program imposibil', sysdate - 30);
insert into transfer_request values(student_ids(5), course_ids(6), 'E2', 'incompatibil', sysdate - 30);
insert into transfer_request values(student_ids(6), course_ids(6), 'B1', 'lucru in echipa', sysdate - 30);
insert into transfer_request values(student_ids(4), course_ids(4), 'B3', 'profesor licenta', sysdate - 30);

delete feedback;
insert into feedback values(student_ids(1), professor_ids(1), 'profesorul perfect', 10, 10, 10);
insert into feedback values(student_ids(1), professor_ids(2), 'materiale nefolositoare', 7, 4, 8);
insert into feedback values(student_ids(2), professor_ids(1), 'curs greu de inteles', 8, 3, 5);
insert into feedback values(student_ids(2), professor_ids(2), 'strict cu notarea', 9, 7.5, 1);
insert into feedback values(student_ids(5), professor_ids(5), 'foarte rabdator', 7, 9, 10);
insert into feedback values(student_ids(5), professor_ids(6), 'nu m-a ajutat', 6, 10, 8.5);
insert into feedback values(student_ids(4), professor_ids(1), 'colaborare excelenta', 10, 8, 10);
insert into feedback values(student_ids(6), professor_ids(1), 'experienta oribila', 3, 1, 2);
insert into feedback values(student_ids(3), professor_ids(3), 'il urasc', 1, 1, 1);

for v_index in 1..9 loop
    material_ids.extend;
    material_ids(material_ids.last) := seq_material_id.nextval;
end loop;

delete material;
insert into material values(material_ids(1), course_ids(11), professor_ids(1), 'curs1.pdf', sysdate - 3, sysdate - 2);
insert into material values(material_ids(2), course_ids(12), professor_ids(1), 'proiecte.pdf', sysdate - 3, sysdate - 2);
insert into material values(material_ids(3), course_ids(7), professor_ids(1), 'seminar1.ppt', sysdate - 3, sysdate - 2);
insert into material values(material_ids(4), course_ids(8), professor_ids(1), 'tema.docx', sysdate - 3, sysdate - 2);
insert into material values(material_ids(5), course_ids(9), professor_ids(2), 'note.xlsx', sysdate - 3, sysdate - 2);
insert into material values(material_ids(6), course_ids(1), professor_ids(1), 'amazon.pdf', sysdate - 3, sysdate - 2);
insert into material values(material_ids(7), course_ids(2), professor_ids(1), 'logo_rust.png', sysdate - 3, sysdate - 2);
insert into material values(material_ids(8), course_ids(3), professor_ids(2), 'cursuri.ppt', sysdate - 3, sysdate - 2);
insert into material values(material_ids(9), course_ids(4), professor_ids(3), 'notare.txt', sysdate - 3, sysdate - 2);

commit;

end;

/

exit;