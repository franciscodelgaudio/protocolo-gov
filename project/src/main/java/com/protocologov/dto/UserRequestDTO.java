package com.protocologov.dto;

public class UserRequestDTO {

    private Long id;
    private Long userId;
    private Long requestId;

    public UserRequestDTO() {}

    public UserRequestDTO(Long id, Long userId, Long requestId) {
        this.id = id;
        this.userId = userId;
        this.requestId = requestId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }
}
