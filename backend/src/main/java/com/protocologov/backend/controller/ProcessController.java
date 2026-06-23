package com.protocologov.backend.controller;

import com.protocologov.backend.model.Process;
import com.protocologov.backend.service.ProcessService;
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
    public ResponseEntity<Process> createProcess(@Valid @RequestBody Process process) {
        Process createdProcess = processService.create(process);
        return ResponseEntity.ok(createdProcess);
    }

    @GetMapping("/processes/{id}")
    public ResponseEntity<Process> getProcessById(@PathVariable Long id) {
        Process process = processService.getById(id);
        return ResponseEntity.ok(process);
    }

    @PutMapping("/processes/{id}")
    public ResponseEntity<Process> updateProcess(@PathVariable Long id, @Valid @RequestBody Process process) {
        process.setId(id);
        Process updatedProcess = processService.update(process);
        return ResponseEntity.ok(updatedProcess);
    }

    @DeleteMapping("/processes/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id) {
        processService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
