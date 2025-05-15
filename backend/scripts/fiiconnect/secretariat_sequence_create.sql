drop sequence seq_sala_id;
drop sequence seq_orar_id;
commit;

CREATE SEQUENCE seq_sala_id START WITH 1 INCREMENT BY 1 minvalue 1 nomaxvalue;
create sequence seq_orar_id start with 1 increment by 1 minvalue 1 nomaxvalue ;

commit;
exit;