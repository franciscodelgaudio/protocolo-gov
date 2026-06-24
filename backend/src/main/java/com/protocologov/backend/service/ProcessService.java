package com.protocologov.backend.service;

import com.protocologov.backend.enums.Role;
import com.protocologov.backend.model.Process;
import com.protocologov.backend.model.User;
import com.protocologov.backend.repository.ProcessRepository;
import com.protocologov.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProcessService {
    private final ProcessRepository processRepository;
    private final UserRepository userRepository;

    public ProcessService(ProcessRepository processRepository, UserRepository userRepository) {
        this.processRepository = processRepository;
        this.userRepository = userRepository;
    }

    public Process createProcess(Process process, Long userId) {
        requireAdmin(userId);
        if (processRepository.existsByRequest_Id(process.getRequest().getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A process already exists for request id: " + process.getRequest().getId());
        }
        return processRepository.save(process);
    }

    public List<Process> getAllProcesses(Long userId) {
        requireAdmin(userId);
        return processRepository.findAll();
    }

    public Process getProcessById(Long id, Long userId) {
        requireAdmin(userId);
        return processRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Process not found with id: " + id));
    }

    public Process updateProcess(Process process, Long userId) {
        requireAdmin(userId);
        if (!processRepository.existsById(process.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Process not found with id: " + process.getId());
        }
        return processRepository.save(process);
    }

    public void deleteProcess(Long id, Long userId) {
        requireAdmin(userId);
        if (!processRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Process not found with id: " + id);
        }
        processRepository.deleteById(id);
    }

    private void requireAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + userId));
        if (user.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: only ADMIN users can perform this operation");
        }
    }
}
