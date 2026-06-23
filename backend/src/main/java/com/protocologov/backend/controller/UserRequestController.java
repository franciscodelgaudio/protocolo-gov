package com.protocologov.backend.controller;

import com.protocologov.backend.dto.UserRequestDTO;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.model.User;
import com.protocologov.backend.model.UserRequest;
import com.protocologov.backend.service.UserRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserRequestController {
    private final UserRequestService userRequestService;

    public UserRequestController(UserRequestService userRequestService) {
        this.userRequestService = userRequestService;
    }

    @PostMapping("/user-requests")
    public ResponseEntity<UserRequest> createUserRequest(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        UserRequest userRequest = toEntity(userRequestDTO);
        UserRequest createdUserRequest = userRequestService.createUserRequest(userRequest);
        return ResponseEntity.ok(createdUserRequest);
    }

    @GetMapping("/user-requests/{id}")
    public ResponseEntity<UserRequest> getUserRequestById(@PathVariable Long id) {
        UserRequest userRequest = userRequestService.getUserRequestById(id);
        return ResponseEntity.ok(userRequest);
    }

    @PutMapping("/user-requests/{id}")
    public ResponseEntity<UserRequest> updateUserRequest(@PathVariable Long id,
            @Valid @RequestBody UserRequestDTO userRequestDTO) {
        UserRequest userRequest = toEntity(userRequestDTO);
        userRequest.setId(id);
        UserRequest updatedUserRequest = userRequestService.updateUserRequest(userRequest);
        return ResponseEntity.ok(updatedUserRequest);
    }

    @DeleteMapping("/user-requests/{id}")
    public ResponseEntity<Void> deleteUserRequest(@PathVariable Long id) {
        userRequestService.deleteUserRequest(id);
        return ResponseEntity.noContent().build();
    }

    private UserRequest toEntity(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setId(userRequestDTO.getUserId());

        Request request = new Request();
        request.setId(userRequestDTO.getRequestId());

        UserRequest userRequest = new UserRequest();
        userRequest.setUser(user);
        userRequest.setRequest(request);
        return userRequest;
    }
}
