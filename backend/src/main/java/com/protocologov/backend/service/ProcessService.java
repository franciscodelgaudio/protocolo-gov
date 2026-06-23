package com.protocologov.backend.service;

import com.protocologov.backend.model.Process;
import com.protocologov.backend.repository.ProcessRepository;
import org.springframework.stereotype.Service;

@Service
public class ProcessService {
    private final ProcessRepository processRepository;

    public ProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    public Process createProcess(Process process) {
        return processRepository.save(process);
    }

    public Process getProcessById(Long id) {
        return processRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Process not found with id: " + id));
    }

    public Process updateProcess(Process process) {
        if (!processRepository.existsById(process.getId())) {
            throw new RuntimeException("Process not found with id: " + process.getId());
        }
        return processRepository.save(process);
    }

    public void deleteProcess(Long id) {
        if (!processRepository.existsById(id)) {
            throw new RuntimeException("Process not found with id: " + id);
        }
        processRepository.deleteById(id);
    }
}
