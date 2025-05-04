package com.fiiconnect.api.social_secretary;

import org.springframework.stereotype.Service;


@Service
public class UserLogatService {
    private UserLogat userLogat;

    public UserLogat getUserLogat() {
        return userLogat;
    }

    public void setUserLogat(UserLogat userLogat) {
        this.userLogat = userLogat;
    }

    public void logout() {
        this.userLogat = null;
    }
}