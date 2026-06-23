package com.protocologov.backend.controller;

import com.protocologov.backend.dto.RequestDTO;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        Request createdRequest = requestService.createRequest(request);
        return ResponseEntity.ok(createdRequest);
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        Request request = requestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    @PutMapping("/requests/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id, @Valid @RequestBody RequestDTO requestDTO) {
        Request request = toEntity(requestDTO);
        request.setId(id);
        Request updatedRequest = requestService.updateRequest(request);
        return ResponseEntity.ok(updatedRequest);
    }

    @DeleteMapping("/requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }

    private Request toEntity(RequestDTO requestDTO) {
        Request request = new Request();
        request.setName(requestDTO.getName());
        request.setDescription(requestDTO.getDescription());
        return request;
    }
}
