package com.protocologov.backend.controller;

import com.protocologov.backend.dto.ProcessDTO;
import com.protocologov.backend.model.Process;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.service.ProcessService;
import jakarta.validation.Valid;
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
        Process createdProcess = processService.createProcess(process);
        return ResponseEntity.ok(createdProcess);
    }

    @GetMapping("/processes/{id}")
    public ResponseEntity<Process> getProcessById(@PathVariable Long id) {
        Process process = processService.getProcessById(id);
        return ResponseEntity.ok(process);
    }

    @PutMapping("/processes/{id}")
    public ResponseEntity<Process> updateProcess(@PathVariable Long id, @Valid @RequestBody ProcessDTO processDTO) {
        Process process = toEntity(processDTO);
        process.setId(id);
        Process updatedProcess = processService.updateProcess(process);
        return ResponseEntity.ok(updatedProcess);
    }

    @DeleteMapping("/processes/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id) {
        processService.deleteProcess(id);
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
}
