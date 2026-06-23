package com.protocologov.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_request")
public class UserRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_request", nullable = false)
    private Request request;

    public UserRequest() {}

    public UserRequest(Long id, User user, Request request) {
        this.id = id;
        this.user = user;
        this.request = request;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Request getRequest() { return request; }
    public void setRequest(Request request) { this.request = request; }
}
