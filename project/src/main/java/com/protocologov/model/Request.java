package com.protocologov.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "request")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL)
    private List<UserRequest> userRequests;

    @OneToOne(mappedBy = "request", cascade = CascadeType.ALL)
    private Process process;

    public Request() {}

    public Request(Long id, String name, String description, LocalDateTime createdAt, List<UserRequest> userRequests, Process process) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.userRequests = userRequests;
        this.process = process;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<UserRequest> getUserRequests() { return userRequests; }
    public void setUserRequests(List<UserRequest> userRequests) { this.userRequests = userRequests; }

    public Process getProcess() { return process; }
    public void setProcess(Process process) { this.process = process; }
}
