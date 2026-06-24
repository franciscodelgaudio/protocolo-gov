package com.protocologov.backend.controller;

import com.protocologov.backend.dto.RequestDTO;
import com.protocologov.backend.enums.RequestStatus;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.model.User;
import com.protocologov.backend.service.AuthenticatedUserService;
import com.protocologov.backend.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RequestController {
    private final RequestService requestService;
    private final AuthenticatedUserService authenticatedUserService;

    public RequestController(RequestService requestService, AuthenticatedUserService authenticatedUserService) {
        this.requestService = requestService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping("/requests")
    public ResponseEntity<Request> createRequest(
            @Valid @RequestBody RequestDTO requestDTO,
            @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        Request request = toEntity(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(requestService.createRequest(request, currentUser.getId()));
    }

    @PatchMapping("/requests/{id}/accept")
    public ResponseEntity<Request> acceptRequest(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        return ResponseEntity.ok(requestService.acceptRequest(id, currentUser.getId()));
    }

    @PatchMapping("/requests/{id}/reject")
    public ResponseEntity<Request> rejectRequest(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        return ResponseEntity.ok(requestService.rejectRequest(id, currentUser.getId()));
    }

    @GetMapping("/requests")
    public ResponseEntity<Page<Request>> getAllRequests(
            @RequestParam(required = false) String status,
            Pageable pageable,
            @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        RequestStatus requestStatus = (status != null && !status.equals("ALL"))
                ? RequestStatus.valueOf(status)
                : null;
        return ResponseEntity.ok(requestService.getAllRequests(currentUser.getId(), requestStatus, pageable));
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        return ResponseEntity.ok(requestService.getRequestById(id, currentUser.getId()));
    }

    @PutMapping("/requests/{id}")
    public ResponseEntity<Request> updateRequest(
            @PathVariable Long id,
            @Valid @RequestBody RequestDTO requestDTO,
            @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        Request request = toEntity(requestDTO);
        request.setId(id);
        return ResponseEntity.ok(requestService.updateRequest(request, currentUser.getId()));
    }

    @DeleteMapping("/requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        requestService.deleteRequest(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    private Request toEntity(RequestDTO requestDTO) {
        Request request = new Request();
        request.setName(requestDTO.getName());
        request.setDescription(requestDTO.getDescription());
        return request;
    }
}
