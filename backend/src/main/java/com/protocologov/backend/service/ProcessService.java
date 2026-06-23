package com.protocologov.backend.service;

import com.protocologov.backend.enums.Role;
import com.protocologov.backend.model.Process;
import com.protocologov.backend.model.User;
import com.protocologov.backend.repository.ProcessRepository;
import com.protocologov.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProcessService {
    private final ProcessRepository processRepository;
    private final UserRepository userRepository;

    public ProcessService(ProcessRepository processRepository, UserRepository userRepository) {
        this.processRepository = processRepository;
        this.userRepository = userRepository;
    }

    public Process createProcess(Process process, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("User does not have permission to create a process");
        }

        return processRepository.save(process);
    }

    public Process getProcessById(Long id, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("User does not have permission to view this process");
        }

        return processRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Process not found with id: " + id));
    }

    public Process updateProcess(Process process, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("User does not have permission to update this process");
        }

        if (!processRepository.existsById(process.getId())) {
            throw new RuntimeException("Process not found with id: " + process.getId());
        }
        return processRepository.save(process);
    }

    public void deleteProcess(Long id, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("User does not have permission to delete this process");
        }

        if (!processRepository.existsById(id)) {
            throw new RuntimeException("Process not found with id: " + id);
        }
        processRepository.deleteById(id);
    }
}
