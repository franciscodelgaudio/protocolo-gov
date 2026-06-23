package com.protocologov.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatarUrl;

    private String role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserRequest> userRequests;

    public User() {}

    public User(Long id, String name, String email, String password, String avatarUrl, String role, List<UserRequest> userRequests) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.userRequests = userRequests;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public List<UserRequest> getUserRequests() { return userRequests; }
    public void setUserRequests(List<UserRequest> userRequests) { this.userRequests = userRequests; }
}
