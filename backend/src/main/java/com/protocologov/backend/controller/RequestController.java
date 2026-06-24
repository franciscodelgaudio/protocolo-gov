package com.protocologov.backend.controller;

import com.protocologov.backend.dto.RequestDTO;
import com.protocologov.backend.enums.RequestStatus;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;
import com.protocologov.backend.model.User;

@RestController
@RequestMapping("/api")
public class RequestController {
    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping("/requests")
    public ResponseEntity<Request> createRequest(@Valid @RequestBody RequestDTO requestDTO,
            @AuthenticationPrincipal Jwt jwt) {

        User currentUser = requestService.getCurrentUser(jwt);
        Request request = toEntity(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(requestService.createRequest(request, currentUser.getId()));
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
    public ResponseEntity<Page<Request>> getAllRequests(
            @RequestParam Long userId,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        RequestStatus requestStatus = (status != null && !status.equals("ALL"))
                ? RequestStatus.valueOf(status)
                : null;
        return ResponseEntity.ok(requestService.getAllRequests(userId, requestStatus, pageable));
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(requestService.getRequestById(id, userId));
    }

    @PutMapping("/requests/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id,
            @Valid @RequestBody RequestDTO requestDTO) {
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
