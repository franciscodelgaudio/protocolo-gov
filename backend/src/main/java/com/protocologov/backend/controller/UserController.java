package com.protocologov.backend.controller;

import com.protocologov.backend.dto.UserDTO;
import com.protocologov.backend.dto.UserResponseDTO;
import com.protocologov.backend.model.User;
import com.protocologov.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        User user = toEntity(userDTO);
        User createdUser = userService.create(user);
        return ResponseEntity.ok(toResponseDTO(createdUser));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAll().stream()
                .map(this::toResponseDTO)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        User user = userService.getById(id);
        return ResponseEntity.ok(toResponseDTO(user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {
        User user = toEntity(userDTO);
        user.setId(id);
        User updatedUser = userService.update(user);
        return ResponseEntity.ok(toResponseDTO(updatedUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private User toEntity(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setAvatarUrl(userDTO.getAvatarUrl());
        user.setRole(userDTO.getRole());
        return user;
    }

    private UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setId(user.getId());
        responseDTO.setName(user.getName());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setAvatarUrl(user.getAvatarUrl());
        responseDTO.setRole(user.getRole());
        return responseDTO;
    }
}
