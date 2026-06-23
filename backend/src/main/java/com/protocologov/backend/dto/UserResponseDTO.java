package com.protocologov.backend.dto;

import com.protocologov.backend.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private User.Role role;
}
