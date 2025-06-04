declare
    type id_table is table of integer;
    TYPE role_tab IS TABLE OF VARCHAR2(255);
    v_roles role_tab := role_tab(
        'ROLE_ADMIN',
        'ROLE_PROFESOR',
        'ROLE_STUDENT',
        'ROLE_SECRETARY'
    );

    student_ids id_table := id_table();
    course_ids id_table := id_table();
    professor_ids id_table := id_table();
    formula_ids id_table := id_table();
    formula_component_ids id_table := id_table();
    material_ids id_table := id_table();
    orar_ids id_table :=id_table();
    sala_ids id_table :=id_table();
    tag_ids id_table := id_table();
    channel_ids id_table := id_table();

begin

--DIDACTIC

insert into global_constant values('feedbacksAllowed', 'false');

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

--SECRETARIAT

for v_index in 1..15 loop
    sala_ids.extend;
    sala_ids(sala_ids.last) := seq_sala_id.nextval;
end loop;

delete SALI;
INSERT INTO SALI (ID, NUME, CAPACITATE, TIPSALA, LOCATIE, IMAGINEURL, DOTARI, OBSERVATII) VALUES (sala_ids(1), 'C112', 100, 'Curs', 'Corp C, Etajul -1', 'https://fii.example.com/img/C112.jpg', 'Proiector, Tabla, Prize', 'Mai multe prize');
INSERT INTO SALI VALUES (sala_ids(2), 'C210', 35, 'Seminar/Laborator', 'Corp C, Parter', 'https://fii.example.com/img/C210.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(3), 'C308', 50, 'Curs', 'Corp C, Etajul 1', 'https://fii.example.com/img/C308.jpg', 'Proiector, Tabla, Prize', 'Mai multe prize');
INSERT INTO SALI VALUES (sala_ids(4), 'C309', 60, 'Curs', 'Corp C, Etajul 1', 'https://fii.example.com/img/C309.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(5), 'C401', 30, 'Laborator', 'Corp C, Etajul 2', 'https://fii.example.com/img/C401.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(6), 'C403', 30, 'Laborator', 'Corp C, Etajul 2', 'https://fii.example.com/img/C403.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(7), 'C405', 30, 'Laborator', 'Corp C, Etajul 2', 'https://fii.example.com/img/C405.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(8), 'C409', 30, 'Laborator', 'Corp C, Etajul 2', 'https://fii.example.com/img/C409.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(9), 'C411', 30, 'Laborator', 'Corp C, Etajul 2', 'https://fii.example.com/img/C411.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(10), 'C412', 30, 'Laborator', 'Corp C, Etajul 2', 'https://fii.example.com/img/C412.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(11), 'C413', 30, 'Laborator', 'Corp C, Etajul 2', 'https://fii.example.com/img/C413.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(12), 'C901', 30, 'Seminar', 'Corp C, Etajul 7', 'https://fii.example.com/img/C901.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(13), 'C903', 30, 'Seminar', 'Corp C, Etajul 7', 'https://fii.example.com/img/C903.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(14), 'C905', 30, 'Seminar', 'Corp C, Etajul 7', 'https://fii.example.com/img/C905.jpg', 'Proiector, Tabla, Prize', '');
INSERT INTO SALI VALUES (sala_ids(15), 'C909', 30, 'Seminar', 'Corp C, Etajul 7', 'https://fii.example.com/img/C909.jpg', 'Proiector, Tabla, Prize', '');

for v_index in 1..18 loop
    orar_ids.extend;
    orar_ids(orar_ids.last) := seq_orar_id.nextval;
end loop;

delete ORAR;
INSERT INTO ORAR VALUES (orar_ids(1), 'Luni', '08:00', '10:00', '1-14', course_ids(1), professor_ids(1), 'A1', 'C2', 'Curs', '1');
INSERT INTO ORAR VALUES (orar_ids(2), 'Luni', '10:00', '12:00', '1-14', course_ids(2), professor_ids(2), 'A1', 'C2', 'Curs', '1');
INSERT INTO ORAR VALUES (orar_ids(3), 'Luni', '16:00', '20:00', '1-14', course_ids(5), professor_ids(3), 'A1', NULL, 'Practic', '1');
INSERT INTO ORAR VALUES (orar_ids(4), 'Marti', '08:00', '10:00', '1-14', course_ids(3), professor_ids(4), 'A1', 'C2', 'Curs', '1');
INSERT INTO ORAR VALUES (orar_ids(5), 'Marti', '10:00', '12:00', '1-14', course_ids(1), professor_ids(5), 'A1', 'C413', 'Laborator', '1');
INSERT INTO ORAR VALUES (orar_ids(6), 'Marti', '12:00', '14:00', '1-14', course_ids(2), professor_ids(6), 'A1', 'C2', 'Curs', '1');
INSERT INTO ORAR VALUES (orar_ids(7), 'Marti', '14:00', '16:00', '1-14', course_ids(4), professor_ids(2), 'A1', 'C2', 'Curs', '1');
INSERT INTO ORAR VALUES (orar_ids(8), 'Miercuri', '08:00', '10:00', '1-14', course_ids(3), professor_ids(1), 'A1', 'C412', 'Seminar', '1');
INSERT INTO ORAR VALUES (orar_ids(9), 'Miercuri', '10:00', '12:00', '1-14', course_ids(2), professor_ids(3), 'A1', 'C308', 'Seminar', '1');
INSERT INTO ORAR VALUES (orar_ids(10), 'Miercuri', '14:00', '16:00', '1-14', course_ids(7), professor_ids(1), 'A1', 'C901', 'Seminar', '1');
INSERT INTO ORAR VALUES (orar_ids(11), 'Miercuri', '16:00', '20:00', '1-14', course_ids(5), professor_ids(3), 'A1', NULL, 'Practic', '1');
INSERT INTO ORAR VALUES (orar_ids(12), 'Miercuri', '16:00', '18:00', '1-14', course_ids(10), professor_ids(4), 'A1', 'C401', 'Laborator', '1');
INSERT INTO ORAR VALUES (orar_ids(13), 'Joi', '10:00', '12:00', '1-14', course_ids(11), professor_ids(5), 'A1', 'C412', 'Laborator', '1');
INSERT INTO ORAR VALUES (orar_ids(14), 'Joi', '16:00', '20:00', '1-14', course_ids(7), professor_ids(1), 'A1', NULL, 'Practic', '1');
INSERT INTO ORAR VALUES (orar_ids(15), 'Joi', '16:00', '20:00', '1-14', course_ids(8), professor_ids(2), 'A1', 'C210', 'Seminar Facultativ', '1');
INSERT INTO ORAR VALUES (orar_ids(16), 'Vineri', '08:00', '10:00', '1-14', course_ids(9), professor_ids(3), 'A1', 'C901', 'Seminar', '1');
INSERT INTO ORAR VALUES (orar_ids(17), 'Vineri', '10:00', '12:00', '1-14', course_ids(11), professor_ids(4), 'A1', 'C112', 'Seminar', '1');
INSERT INTO ORAR VALUES (orar_ids(18), 'Sambata', '10:00', '12:00', '1-14', course_ids(12), professor_ids(5), 'A1', 'C909', 'Seminar Facultativ', '1');

--AUTH

FOR i IN 1 .. v_roles.COUNT LOOP
        MERGE INTO roles r
        USING (SELECT v_roles(i) AS role_name FROM dual) src
        ON (r.role_name = src.role_name)
        WHEN NOT MATCHED THEN
            INSERT (id, role_name)
            VALUES (ROLES_SEQ.NEXTVAL, src.role_name);
END LOOP;

--SOCIAL

for v_index in 1..18 loop
    tag_ids.extend;
    tag_ids(tag_ids.last) := tag_seq.nextval;
end loop;

delete tag;
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'GENERAL', 'GENERAL');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1A', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1B', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1E', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1X', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2A', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2B', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2E', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2X', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3A', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3B', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3E', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3X', 'SEMIAN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1', 'AN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2', 'AN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3', 'AN');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1A1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1A2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1A3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1A4', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1A5', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1B1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1B2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1B3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1B4', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1E1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1E2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1E3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '1X', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2A1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2A2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2A3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2A4', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2A5', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2B1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2B2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2B3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2B4', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2E1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2E2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2E3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '2X', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3A1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3A2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3A3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3A4', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3A5', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3B1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3B2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3B3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3B4', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3E1', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3E2', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3E3', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '3X', 'GRUPA');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'MATEMATICA', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'LOGICA', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'INTRODUCERE IN PROGRAMARE', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'ARHITECTURA CALCULATOARELOR SI SISTEMELOR DE OPERARE', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'ENGLEZA1', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'STRUCTURI DE DATE', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'SISTEME DE OPERARE', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'PROBABILITATI SI STATISTICA', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'PROIECTAREA ALGORITMILOR', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'PROGRAMARE ORIENTATA-OBIECT', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'ENGLEZA2', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'FUNDAMENTELE ALGEBRICE ALE INFORMATICII', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'RETELE DE CALCUTATOARE', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'ALGORITMICA GRAFURILOR', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'BAZE DE DATE', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'LIMBAJE FORMALE AUTOMATE SI COMPILATOARE', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'ENGLEZA3', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'PROGRAMARE RUST', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'TEHNOLOGII WEB', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'SGBD', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'PROGRAMARE AVANDATA', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'INGINERIA PROGRAMARII', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'ENGLEZA4', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'PROGRAMARE FUNCTIONALA', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'SECURITATEA INFORMATIEI', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'PROGRAMARE IN PYTHON', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'INTELIGENTA ARTIFICIALA', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'INVATARE AUTOMATA', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'ANIMATIE 3D', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, '.NET', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'GRAFICA PE CALCULATOR', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'CALCUL NUMERIC', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'CLOUD COMPUTING', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'ANALIZA RETELELOR MEDIA SOCIALE', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'PSIHOLOGIA COMUNICARII PROFESIONALE IN DOMENIUL IT', 'MATERIE');
INSERT INTO TAG (ID, NAME, TYPE) VALUES (tag_seq.NEXTVAL, 'TOPICI AVANSATE IN .NET', 'MATERIE');

delete channel;
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'GENERAL');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1A');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1B');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1E');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1X');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2A');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2B');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2E');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2X');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3A');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3B');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3E');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3X');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1A1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1A2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1A3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1A4');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1A5');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1B1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1B2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1B3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1B4');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1E1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1E2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1E3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '1X');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2A1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2A2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2A3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2A4');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2A5');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2B1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2B2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2B3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2B4');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2E1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2E2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2E3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '2X');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3A1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3A2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3A3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3A4');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3A5');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3B1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3B2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3B3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3B4');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3E1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3E2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3E3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '3X');

-- Materii
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'MATEMATICA');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'LOGICA');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'INTRODUCERE IN PROGRAMARE');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'ARHITECTURA CALCULATOARELOR SI SISTEMELOR DE OPERARE');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'ENGLEZA1');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'STRUCTURI DE DATE');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'SISTEME DE OPERARE');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'PROBABILITATI SI STATISTICA');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'PROIECTAREA ALGORITMILOR');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'PROGRAMARE ORIENTATA-OBIECT');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'ENGLEZA2');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'FUNDAMENTELE ALGEBRICE ALE INFORMATICII');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'RETELE DE CALCUTATOARE');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'ALGORITMICA GRAFURILOR');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'BAZE DE DATE');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'LIMBAJE FORMALE AUTOMATE SI COMPILATOARE');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'ENGLEZA3');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'PROGRAMARE RUST');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'TEHNOLOGII WEB');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'SGBD');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'PROGRAMARE AVANDATA');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'INGINERIA PROGRAMARII');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'ENGLEZA4');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'PROGRAMARE FUNCTIONALA');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'SECURITATEA INFORMATIEI');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'PROGRAMARE IN PYTHON');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'INTELIGENTA ARTIFICIALA');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'INVATARE AUTOMATA');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'ANIMATIE 3D');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, '.NET');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'GRAFICA PE CALCULATOR');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'CALCUL NUMERIC');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'CLOUD COMPUTING');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'ANALIZA RETELELOR MEDIA SOCIALE');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'PSIHOLOGIA COMUNICARII PROFESIONALE IN DOMENIUL IT');
INSERT INTO CHANNEL (ID, NAME) VALUES (channel_seq.NEXTVAL, 'TOPICI AVANSATE IN .NET');
INSERT INTO CHANNEL_TAGS (CHANNEL_ID, TAG_ID)
SELECT c.ID, t.ID
FROM CHANNEL c, TAG t
WHERE c.NAME = t.NAME;



commit;

end;

/