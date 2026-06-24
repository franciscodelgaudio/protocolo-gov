package com.protocologov.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {
    @NotNull(message = "Request id cannot be null")
    private Long requestId;
}
