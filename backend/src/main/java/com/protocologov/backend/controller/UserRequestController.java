package com.protocologov.backend.controller;

import com.protocologov.backend.model.UserRequest;
import com.protocologov.backend.service.UserRequestService;
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
    public ResponseEntity<UserRequest> createUserRequest(@Valid @RequestBody UserRequest userRequest) {
        UserRequest createdUserRequest = userRequestService.create(userRequest);
        return ResponseEntity.ok(createdUserRequest);
    }

    @GetMapping("/user-requests/{id}")
    public ResponseEntity<UserRequest> getUserRequestById(@PathVariable Long id) {
        UserRequest userRequest = userRequestService.getById(id);
        return ResponseEntity.ok(userRequest);
    }

    @PutMapping("/user-requests/{id}")
    public ResponseEntity<UserRequest> updateUserRequest(@PathVariable Long id,
            @Valid @RequestBody UserRequest userRequest) {
        userRequest.setId(id);
        UserRequest updatedUserRequest = userRequestService.update(userRequest);
        return ResponseEntity.ok(updatedUserRequest);
    }

    @DeleteMapping("/user-requests/{id}")
    public ResponseEntity<Void> deleteUserRequest(@PathVariable Long id) {
        userRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
