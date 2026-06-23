package com.protocologov.dto;

import java.time.LocalDateTime;

public class ProcessDTO {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String status;
    private Long requestId;

    public ProcessDTO() {}

    public ProcessDTO(Long id, String name, String description, LocalDateTime createdAt, String status, Long requestId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.status = status;
        this.requestId = requestId;
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

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }
}
