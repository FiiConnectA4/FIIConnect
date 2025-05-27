set sqlblanklines on;

drop table USERS cascade constraints;
drop table ROLES cascade constraints;
drop table USER_PROFILE cascade constraints;
drop table USER_PROFILE_ACHIEVEMENTS cascade constraints;
drop table USER_PROFILE_EXPERTISE cascade constraints;
drop table USERS_PROFESSORS cascade constraints;
drop table USERS_STUDENTS cascade constraints;
drop table USERS_ROLES cascade constraints;
drop table NOTIFICATIONS cascade constraints;
drop table PASSWORD_RESET_TOKEN cascade constraints;

commit;



CREATE TABLE USERS (
                       ID                        NUMBER(19)        NOT NULL,
                       USERNAME                  VARCHAR2(255)     NOT NULL,
                       PASSWORD                  VARCHAR2(255)     NOT NULL,
                       EMAIL                     VARCHAR2(255),
                       TWO_FACTOR_SECRET         VARCHAR2(255),
                       IS_ACTIVE                 NUMBER(1)         DEFAULT 0  NOT NULL,
                       PENDING_TWO_FACTOR_SECRET VARCHAR2(255),
                       TWO_FACTOR_ENABLED        NUMBER(1)         DEFAULT 0  NOT NULL,
                       PROFILE_ID                NUMBER(19),         -- FK adăugat după ce există USER_PROFILE
                       CONSTRAINT PK_USERS           PRIMARY KEY (ID),
                       CONSTRAINT UQ_USERS_USERNAME  UNIQUE (USERNAME),
                       CONSTRAINT UQ_USERS_EMAIL     UNIQUE (EMAIL),
                       CONSTRAINT CK_USERS_IS_ACTIVE CHECK (IS_ACTIVE IN (0,1)),
                       CONSTRAINT CK_USERS_TWO_FACTOR_ENABLED CHECK (TWO_FACTOR_ENABLED IN (0,1))
);

CREATE OR REPLACE TRIGGER USERS_BIU
BEFORE INSERT ON USERS
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
SELECT USERS_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END;
/

/* ---------- 1.2  ROLES ----------------------------------*/
CREATE TABLE ROLES (
                       ID         NUMBER(19)    NOT NULL,
                       ROLE_NAME  VARCHAR2(255) NOT NULL,
                       CONSTRAINT PK_ROLES            PRIMARY KEY (ID),
                       CONSTRAINT UQ_ROLES_ROLE_NAME  UNIQUE (ROLE_NAME)
);

CREATE OR REPLACE TRIGGER ROLES_BIU
BEFORE INSERT ON ROLES
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
SELECT ROLES_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END;
/

/* ---------- 1.3  USER_PROFILE ---------------------------*/
CREATE TABLE USER_PROFILE (
                              ID                    NUMBER(19)      NOT NULL,
                              FIRST_NAME            VARCHAR2(255),
                              LAST_NAME             VARCHAR2(255),
                              EMAIL                 VARCHAR2(255),
                              PHONE                 VARCHAR2(50),
                              ABOUT                 VARCHAR2(1000),
                              TWO_FACTOR_ENABLED    NUMBER(1)       DEFAULT 0 NOT NULL,
                              KYC_STATUS            VARCHAR2(50),
                              CURRENT_YEAR          VARCHAR2(20),
                              RATING                NUMBER(10,2)    DEFAULT 0,
                              PROFILE_PICTURE_URL   VARCHAR2(512),
                              USER_ID               NUMBER(19)      NOT NULL,        -- FK spre USERS (unic)
                              CONSTRAINT PK_USER_PROFILE        PRIMARY KEY (ID),
                              CONSTRAINT UQ_UP_USER             UNIQUE (USER_ID),
                              CONSTRAINT CK_UP_TWO_FACTOR       CHECK (TWO_FACTOR_ENABLED IN (0,1)),
                              CONSTRAINT FK_UP_USER             FOREIGN KEY (USER_ID)
                                  REFERENCES USERS (ID) ON DELETE CASCADE
);

CREATE OR REPLACE TRIGGER USER_PROFILE_BIU
BEFORE INSERT ON USER_PROFILE
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
SELECT USER_PROFILE_SEQUENCE.NEXTVAL INTO :NEW.ID FROM DUAL;
END;
/

/* ---------- 1.4  PASSWORD_RESET_TOKEN -------------------*/
CREATE TABLE PASSWORD_RESET_TOKEN (
                                      ID              NUMBER(19)    NOT NULL,
                                      TOKEN           VARCHAR2(255) NOT NULL,
                                      EXPIRATION_DATE TIMESTAMP     NOT NULL,
                                      USER_ID         NUMBER(19)    NOT NULL,
                                      CONSTRAINT PK_PRT         PRIMARY KEY (ID),
                                      CONSTRAINT UQ_PRT_TOKEN   UNIQUE (TOKEN),
                                      CONSTRAINT UQ_PRT_USER    UNIQUE (USER_ID),
                                      CONSTRAINT FK_PRT_USER    FOREIGN KEY (USER_ID)
                                          REFERENCES USERS (ID) ON DELETE CASCADE
);

CREATE OR REPLACE TRIGGER PRT_BIU
BEFORE INSERT ON PASSWORD_RESET_TOKEN
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
SELECT PASSWORD_RESET_TOKEN_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END;
/

/* ---------- 1.5  NOTIFICATIONS --------------------------*/
CREATE TABLE NOTIFICATIONS (
                               ID        NUMBER(19)     NOT NULL,
                               TITLE     VARCHAR2(255)  NOT NULL,
                               CONTENT   VARCHAR2(255)  NOT NULL,
                               TYPE      VARCHAR2(100),
                               IS_READ   NUMBER(1)      DEFAULT 0 NOT NULL,
                               TS        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP NOT NULL,
                               USER_ID   NUMBER(19)     NOT NULL,
                               CONSTRAINT PK_NOTIFICATIONS  PRIMARY KEY (ID),
                               CONSTRAINT CK_NOTIF_IS_READ  CHECK (IS_READ IN (0,1)),
                               CONSTRAINT FK_NOTIF_USER     FOREIGN KEY (USER_ID)
                                   REFERENCES USERS (ID) ON DELETE CASCADE
);

CREATE OR REPLACE TRIGGER NOTIFICATIONS_BIU
BEFORE INSERT ON NOTIFICATIONS
FOR EACH ROW
WHEN (NEW.ID IS NULL)
BEGIN
SELECT NOTIFICATIONS_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END;
/

/* =========================================================
 * SECTIUNEA 2. TABELE PIVOT / COLECȚII
 * (toate depind de USERS, ROLES, USER_PROFILE etc. — deja create)
 * =======================================================*/

/* -- 2.1  USERS_STUDENTS (1-to-1) -------------------------*/
CREATE TABLE USERS_STUDENTS (
                                USER_ID    NUMBER(19) NOT NULL,
                                STUDENT_ID NUMBER(19) NOT NULL,
                                CONSTRAINT PK_USERS_STUDENTS          PRIMARY KEY (USER_ID),
                                CONSTRAINT UQ_USERS_STUDENTS_STUDENT  UNIQUE (STUDENT_ID),
                                CONSTRAINT FK_USERS_STUD_USER FOREIGN KEY (USER_ID)
                                    REFERENCES USERS (ID) ON DELETE CASCADE,
                                CONSTRAINT FK_USERS_STUD_STU  FOREIGN KEY (STUDENT_ID)
                                    REFERENCES STUDENT (ID)
);

/* -- 2.2  USERS_PROFESSORS (1-to-1) -----------------------*/
CREATE TABLE USERS_PROFESSORS (
                                  USER_ID      NUMBER(19) NOT NULL,
                                  PROFESSOR_ID NUMBER(19) NOT NULL,
                                  CONSTRAINT PK_USERS_PROFESSORS          PRIMARY KEY (USER_ID),
                                  CONSTRAINT UQ_USERS_PROFESSORS_PROF     UNIQUE (PROFESSOR_ID),
                                  CONSTRAINT FK_USERS_PROF_USER FOREIGN KEY (USER_ID)
                                      REFERENCES USERS (ID) ON DELETE CASCADE,
                                  CONSTRAINT FK_USERS_PROF_PROF FOREIGN KEY (PROFESSOR_ID)
                                      REFERENCES PROFESSOR(ID)
);

/* -- 2.3  USERS_ROLES (many-to-many) ----------------------*/
CREATE TABLE USERS_ROLES (
                             USER_ID NUMBER(19) NOT NULL,
                             ROLE_ID NUMBER(19) NOT NULL,
                             CONSTRAINT PK_USERS_ROLES     PRIMARY KEY (USER_ID, ROLE_ID),
                             CONSTRAINT FK_USERS_ROLES_USER FOREIGN KEY (USER_ID)
                                 REFERENCES USERS (ID) ON DELETE CASCADE,
                             CONSTRAINT FK_USERS_ROLES_ROLE FOREIGN KEY (ROLE_ID)
                                 REFERENCES ROLES (ID) ON DELETE CASCADE
);

/* -- 2.4  USER_PROFILE_EXPERTISE -------------------------*/
CREATE TABLE USER_PROFILE_EXPERTISE (
                                        USER_PROFILE_ID NUMBER(19) NOT NULL,
                                        EXPERTISE       VARCHAR2(255) NOT NULL,
                                        CONSTRAINT PK_UP_EXPERTISE     PRIMARY KEY (USER_PROFILE_ID, EXPERTISE),
                                        CONSTRAINT FK_UP_EXP_UP FOREIGN KEY (USER_PROFILE_ID)
                                            REFERENCES USER_PROFILE (ID) ON DELETE CASCADE
);

/* -- 2.5  USER_PROFILE_ACHIEVEMENTS ----------------------*/
CREATE TABLE USER_PROFILE_ACHIEVEMENTS (
                                           USER_PROFILE_ID NUMBER(19) NOT NULL,
                                           ACHIEVEMENT     VARCHAR2(255) NOT NULL,
                                           CONSTRAINT PK_UP_ACHIEVEMENTS  PRIMARY KEY (USER_PROFILE_ID, ACHIEVEMENT),
                                           CONSTRAINT FK_UP_ACH_UP FOREIGN KEY (USER_PROFILE_ID)
                                               REFERENCES USER_PROFILE (ID) ON DELETE CASCADE
);

/* =========================================================
 * SECTIUNEA 3. CONSTRÂNGERE CIRCULARĂ USERS → USER_PROFILE
 * (se adaugă doar acum, când ambele tabele există)
 * =======================================================*/
ALTER TABLE USERS
    ADD CONSTRAINT FK_USERS_PROFILE
        FOREIGN KEY (PROFILE_ID)
            REFERENCES USER_PROFILE (ID)
            ON DELETE SET NULL;

commit;