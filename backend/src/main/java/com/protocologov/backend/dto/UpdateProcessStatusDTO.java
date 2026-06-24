package com.protocologov.backend.dto;

import com.protocologov.backend.enums.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProcessStatusDTO {
    @NotNull(message = "Status cannot be null")
    private Status status;
}
