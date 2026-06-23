package com.protocologov.controller;

import com.protocologov.dto.RequestDTO;
import com.protocologov.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public List<RequestDTO> findAll() {
        return requestService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RequestDTO> create(@RequestBody RequestDTO dto) {
        return ResponseEntity.ok(requestService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestDTO> update(@PathVariable Long id, @RequestBody RequestDTO dto) {
        return ResponseEntity.ok(requestService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        requestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
