package com.fiiconnect.api.auth_userMgmt.dtos;

public class LoginRequest {
    private String username;
    private String password;
    private int twoFactorCode;

    // Getters and Setters
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }
    public int getTwoFactorCode() {
        return twoFactorCode;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setTwoFactorCode(int twoFactorCode) {
        this.twoFactorCode = twoFactorCode;
    }
}