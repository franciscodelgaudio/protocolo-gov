package com.protocologov.controller;

import com.protocologov.dto.UserRequestDTO;
import com.protocologov.service.UserRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-requests")
public class UserRequestController {

    private final UserRequestService userRequestService;

    public UserRequestController(UserRequestService userRequestService) {
        this.userRequestService = userRequestService;
    }

    @GetMapping
    public List<UserRequestDTO> findAll() {
        return userRequestService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserRequestDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userRequestService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UserRequestDTO> create(@RequestBody UserRequestDTO dto) {
        return ResponseEntity.ok(userRequestService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
