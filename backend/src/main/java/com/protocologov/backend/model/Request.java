package com.protocologov.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.protocologov.backend.enums.RequestStatus;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name = "requests")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @CreationTimestamp
    private Date createdAt;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @OneToOne(mappedBy = "request")
    @JsonIgnoreProperties("request")
    private Process process;
}
