package com.protocologov.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "process")
public class Process {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private LocalDateTime createdAt;

    private String status;

    @OneToOne
    @JoinColumn(name = "id_request", nullable = false)
    private Request request;

    public Process() {}

    public Process(Long id, String name, String description, LocalDateTime createdAt, String status, Request request) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.status = status;
        this.request = request;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Request getRequest() { return request; }
    public void setRequest(Request request) { this.request = request; }
}
