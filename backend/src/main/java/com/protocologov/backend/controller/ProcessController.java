package com.protocologov.backend.controller;

import com.protocologov.backend.dto.CreateProcessFromRequestDTO;
import com.protocologov.backend.dto.ProcessDTO;
import com.protocologov.backend.dto.UpdateProcessStatusDTO;
import com.protocologov.backend.enums.Status;
import com.protocologov.backend.model.Process;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.service.ProcessService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProcessController {
    private final ProcessService processService;

    public ProcessController(ProcessService processService) {
        this.processService = processService;
    }

    @PostMapping("/processes")
    public ResponseEntity<Process> createProcess(@Valid @RequestBody ProcessDTO processDTO) {
        Process process = toEntity(processDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(processService.createProcess(process, processDTO.getUserId()));
    }

    @PostMapping("/requests/{requestId}/process")
    public ResponseEntity<Process> createProcessFromRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody CreateProcessFromRequestDTO processDTO) {
        Process process = toEntity(processDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(processService.createProcessFromRequest(requestId, process, processDTO.getUserId()));
    }

    @GetMapping("/processes")
    public ResponseEntity<Page<Process>> getAllProcesses(
            @RequestParam Long userId,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Status processStatus = (status != null && !status.equals("ALL"))
                ? Status.valueOf(status)
                : null;
        return ResponseEntity.ok(processService.getAllProcesses(userId, processStatus, pageable));
    }

    @GetMapping("/processes/{id}")
    public ResponseEntity<Process> getProcessById(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(processService.getProcessById(id, userId));
    }

    @PutMapping("/processes/{id}")
    public ResponseEntity<Process> updateProcess(@PathVariable Long id,
            @Valid @RequestBody ProcessDTO processDTO) {
        Process process = toEntity(processDTO);
        process.setId(id);
        return ResponseEntity.ok(processService.updateProcess(process, processDTO.getUserId()));
    }

    @PatchMapping("/processes/{id}/status")
    public ResponseEntity<Process> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProcessStatusDTO statusDTO) {
        return ResponseEntity.ok(
                processService.updateStatus(id, statusDTO.getStatus(), statusDTO.getUserId()));
    }

    @DeleteMapping("/processes/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id, @RequestParam Long userId) {
        processService.deleteProcess(id, userId);
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
