package com.protocologov.backend.controller;

import com.protocologov.backend.dto.RequestDTO;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RequestController {
    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping("/requests")
    public ResponseEntity<Request> createRequest(@Valid @RequestBody RequestDTO requestDTO) {
        Request request = toEntity(requestDTO);
        return ResponseEntity.ok(requestService.createRequest(request, requestDTO.getUserId()));
    }

    @PatchMapping("/requests/{id}/accept")
    public ResponseEntity<Request> acceptRequest(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(requestService.acceptRequest(id, userId));
    }

    @PatchMapping("/requests/{id}/reject")
    public ResponseEntity<Request> rejectRequest(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(requestService.rejectRequest(id, userId));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<Request>> getAllRequests(@RequestParam Long userId) {
        return ResponseEntity.ok(requestService.getAllRequests(userId));
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(requestService.getRequestById(id, userId));
    }

    @PutMapping("/requests/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id, @Valid @RequestBody RequestDTO requestDTO) {
        Request request = toEntity(requestDTO);
        request.setId(id);
        return ResponseEntity.ok(requestService.updateRequest(request, requestDTO.getUserId()));
    }

    @DeleteMapping("/requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id, @RequestParam Long userId) {
        requestService.deleteRequest(id, userId);
        return ResponseEntity.noContent().build();
    }

    private Request toEntity(RequestDTO requestDTO) {
        Request request = new Request();
        request.setName(requestDTO.getName());
        request.setDescription(requestDTO.getDescription());
        return request;
    }
}
