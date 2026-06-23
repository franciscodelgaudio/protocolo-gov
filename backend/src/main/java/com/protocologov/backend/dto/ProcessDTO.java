package com.protocologov.backend.dto;

import com.protocologov.backend.model.Process;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProcessDTO {
    @NotBlank(message = "Name cannot be blank")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 500, message = "Description must have at most 500 characters")
    private String description;

    @NotNull(message = "Status cannot be null")
    private Process.Status status;

    @NotNull(message = "Request id cannot be null")
    private Long requestId;
}
