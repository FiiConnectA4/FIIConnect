set sqlblanklines on;


drop table USER_TAGS;
drop table CHANNEL_TAGS;
drop table ANNOUNCEMENT_TAGS;
drop table TAG;

drop table CHANNEL;

drop table ANNOUNCEMENT;
drop table ACHIEVEMENT;
drop table CHAT;

commit;

CREATE TABLE TAG (
                     ID NUMBER PRIMARY KEY,
                     NAME VARCHAR2(255),
                     TYPE VARCHAR2(50)
);

-- =======================
-- USER_TAGS (many-to-many)
-- =======================

CREATE TABLE USER_TAGS (
                           USER_ID NUMBER(19),
                           TAG_ID NUMBER,
                           PRIMARY KEY (USER_ID, TAG_ID),
                           CONSTRAINT FK_USER_TAG_USER FOREIGN KEY (USER_ID) REFERENCES USERS(ID) ON DELETE CASCADE,
                           CONSTRAINT FK_USER_TAG_TAG FOREIGN KEY (TAG_ID) REFERENCES TAG(ID) ON DELETE CASCADE
);

-- =======================
-- CHANNEL
-- =======================

CREATE TABLE CHANNEL (
                         ID NUMBER PRIMARY KEY,
                         NAME VARCHAR2(255)
);

-- =======================
-- CHANNEL_TAGS (many-to-many)
-- =======================

CREATE TABLE CHANNEL_TAGS (
                              CHANNEL_ID NUMBER,
                              TAG_ID NUMBER,
                              PRIMARY KEY (CHANNEL_ID, TAG_ID),
                              CONSTRAINT FK_CHANNEL_TAG_CHANNEL FOREIGN KEY (CHANNEL_ID) REFERENCES CHANNEL(ID) ON DELETE CASCADE,
                              CONSTRAINT FK_CHANNEL_TAG_TAG FOREIGN KEY (TAG_ID) REFERENCES TAG(ID) ON DELETE CASCADE
);

-- =======================
-- ANNOUNCEMENT
-- =======================

CREATE TABLE ANNOUNCEMENT (
                              ID NUMBER PRIMARY KEY,
                              TITLE VARCHAR2(255),
                              MESSAGE CLOB,
                              AUTHOR_ID NUMBER(19),
                              PUBLISHED_DATE DATE,
                              CONSTRAINT FK_ANNOUNCEMENT_AUTHOR FOREIGN KEY (AUTHOR_ID) REFERENCES USERS(ID) ON DELETE CASCADE
);

-- =======================
-- ANNOUNCEMENT_TAGS (many-to-many)
-- =======================

CREATE TABLE ANNOUNCEMENT_TAGS (
                                   ANNOUNCEMENT_ID NUMBER,
                                   TAG_ID NUMBER,
                                   PRIMARY KEY (ANNOUNCEMENT_ID, TAG_ID),
                                   CONSTRAINT FK_ANN_TAG_ANN FOREIGN KEY (ANNOUNCEMENT_ID) REFERENCES ANNOUNCEMENT(ID) ON DELETE CASCADE,
                                   CONSTRAINT FK_ANN_TAG_TAG FOREIGN KEY (TAG_ID) REFERENCES TAG(ID) ON DELETE CASCADE
);


-- =======================
-- ACHIEVEMENT
-- =======================

CREATE TABLE ACHIEVEMENT (
                             ID NUMBER PRIMARY KEY,
                             NAME VARCHAR2(255),
                             DESCRIPTION CLOB,
                             USER_ID NUMBER(19),
                             DATE_ACHIEVED VARCHAR2(50),
                             CONSTRAINT FK_ACHIEVEMENT_USER FOREIGN KEY (USER_ID) REFERENCES USERS(ID) ON DELETE CASCADE
);

-- =======================
-- CHAT
-- =======================

CREATE TABLE CHAT (
                      ID NUMBER PRIMARY KEY,
                      MESSAGE CLOB,
                      SENDER_ID NUMBER(19),
                      TIMESTAMP VARCHAR2(100),
                      TYPE VARCHAR2(50),
                      CHANNEL_ID NUMBER,
                      CONSTRAINT FK_CHAT_SENDER FOREIGN KEY (SENDER_ID) REFERENCES USERS(ID) ON DELETE CASCADE
);

commit;
exit;
