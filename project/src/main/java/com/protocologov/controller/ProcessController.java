package com.protocologov.controller;

import com.protocologov.dto.ProcessDTO;
import com.protocologov.service.ProcessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/processes")
public class ProcessController {

    private final ProcessService processService;

    public ProcessController(ProcessService processService) {
        this.processService = processService;
    }

    @GetMapping
    public List<ProcessDTO> findAll() {
        return processService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProcessDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(processService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProcessDTO> create(@RequestBody ProcessDTO dto) {
        return ResponseEntity.ok(processService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcessDTO> update(@PathVariable Long id, @RequestBody ProcessDTO dto) {
        return ResponseEntity.ok(processService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        processService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
