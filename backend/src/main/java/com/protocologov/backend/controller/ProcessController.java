package com.protocologov.backend.controller;

import com.protocologov.backend.dto.CreateProcessFromRequestDTO;
import com.protocologov.backend.dto.ProcessDTO;
import com.protocologov.backend.dto.UpdateProcessStatusDTO;
import com.protocologov.backend.enums.Status;
import com.protocologov.backend.model.Process;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.model.User;
import com.protocologov.backend.service.AuthenticatedUserService;
import com.protocologov.backend.service.ProcessService;
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
public class ProcessController {
    private final ProcessService processService;
    private final AuthenticatedUserService authenticatedUserService;

    public ProcessController(ProcessService processService, AuthenticatedUserService authenticatedUserService) {
        this.processService = processService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping("/processes")
    public ResponseEntity<Process> createProcess(
            @Valid @RequestBody ProcessDTO processDTO,
            @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        Process process = toEntity(processDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(processService.createProcess(process, currentUser.getId()));
    }

    @PostMapping("/requests/{requestId}/process")
    public ResponseEntity<Process> createProcessFromRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody CreateProcessFromRequestDTO processDTO,
            @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        Process process = toEntity(processDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(processService.createProcessFromRequest(requestId, process, currentUser.getId()));
    }

    @GetMapping("/processes")
    public ResponseEntity<Page<Process>> getAllProcesses(
            @RequestParam(required = false) String status,
            Pageable pageable,
            @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        Status processStatus = (status != null && !status.equals("ALL"))
                ? Status.valueOf(status)
                : null;
        return ResponseEntity.ok(processService.getAllProcesses(currentUser.getId(), processStatus, pageable));
    }

    @GetMapping("/processes/{id}")
    public ResponseEntity<Process> getProcessById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        return ResponseEntity.ok(processService.getProcessById(id, currentUser.getId()));
    }

    @PutMapping("/processes/{id}")
    public ResponseEntity<Process> updateProcess(
            @PathVariable Long id,
            @Valid @RequestBody ProcessDTO processDTO,
            @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        Process process = toEntity(processDTO);
        process.setId(id);
        return ResponseEntity.ok(processService.updateProcess(process, currentUser.getId()));
    }

    @PatchMapping("/processes/{id}/status")
    public ResponseEntity<Process> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProcessStatusDTO statusDTO,
            @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        return ResponseEntity.ok(processService.updateStatus(id, statusDTO.getStatus(), currentUser.getId()));
    }

    @DeleteMapping("/processes/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        User currentUser = authenticatedUserService.getCurrentUser(jwt);
        processService.deleteProcess(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    private Process toEntity(ProcessDTO processDTO) {
        Request request = new Request();
        request.setId(processDTO.getRequestId());
        Process process = new Process();
        process.setName(processDTO.getName());
        process.setDescription(processDTO.getDescription());
        process.setStatus(processDTO.getStatus());
        process.setRequest(request);
        return process;
    }

    private Process toEntity(CreateProcessFromRequestDTO processDTO) {
        Process process = new Process();
        process.setName(processDTO.getName());
        process.setDescription(processDTO.getDescription());
        return process;
    }
}
