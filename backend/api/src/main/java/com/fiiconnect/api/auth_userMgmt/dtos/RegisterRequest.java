package com.fiiconnect.api.auth_userMgmt.dtos;

public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String roleName;

    // Getteri și Setteri
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
}
