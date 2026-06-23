package com.protocologov.backend.dto;

import com.protocologov.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private Role role;
}
