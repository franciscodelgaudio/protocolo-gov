package com.protocologov.backend.service;

public class ProcessService {
    private ProcessReposityory processRepository;

    public ProcessService(ProcessReposityory processRepository) {
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
