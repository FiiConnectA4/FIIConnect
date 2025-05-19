set sqlblanklines on;

drop table orar cascade constraints;
drop table sali cascade constraints;

commit;

CREATE TABLE ORAR (
                      ID NUMBER PRIMARY KEY,
                      ZI VARCHAR2(20),
                      ORA_START VARCHAR2(5),
                      ORA_END VARCHAR2(5),
                      SAPTAMANA VARCHAR2(20),
                      ID_DISCIPLINA integer,
                      ID_PROFESOR integer,
                      GRUPA VARCHAR2(10),
                      SALA VARCHAR2(10),
                      TIP_ACTIVITATE VARCHAR2(50),
                      AN VARCHAR2(5),
                      CONSTRAINT fk_disciplina FOREIGN KEY (ID_DISCIPLINA) REFERENCES course(id) ON DELETE CASCADE,
                      CONSTRAINT fk_profesor FOREIGN KEY (ID_PROFESOR) REFERENCES professor(id) ON DELETE CASCADE
);
CREATE TABLE SALI (
                      ID NUMBER PRIMARY KEY,
                      NUME VARCHAR2(50),
                      CAPACITATE NUMBER,
                      TIPSALA VARCHAR2(50),
                      LOCATIE VARCHAR2(100),
                      IMAGINEURL VARCHAR2(200),
                      DOTARI VARCHAR2(200),
                      OBSERVATII VARCHAR2(200)
);

commit;
exit;