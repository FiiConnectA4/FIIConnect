drop sequence tag_seq;
drop sequence channel_seq;
drop sequence announcement_seq;
drop sequence achievement_seq;
drop sequence chat_seq;

commit;

CREATE SEQUENCE tag_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE channel_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE announcement_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE achievement_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE chat_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

commit;
exit;