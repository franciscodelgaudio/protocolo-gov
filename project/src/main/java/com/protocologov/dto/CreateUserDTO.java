package com.protocologov.dto;

public class CreateUserDTO {

    private String name;
    private String email;
    private String password;
    private String avatarUrl;
    private String role;

    public CreateUserDTO() {}

    public CreateUserDTO(String name, String email, String password, String avatarUrl, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatarUrl = avatarUrl;
        this.role = role;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
