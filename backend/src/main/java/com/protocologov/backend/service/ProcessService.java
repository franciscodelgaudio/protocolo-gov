package com.protocologov.backend.service;

import com.protocologov.backend.enums.RequestStatus;
import com.protocologov.backend.enums.Role;
import com.protocologov.backend.enums.Status;
import com.protocologov.backend.model.Process;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.model.User;
import com.protocologov.backend.repository.ProcessRepository;
import com.protocologov.backend.repository.RequestRepository;
import com.protocologov.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProcessService {
    private final ProcessRepository processRepository;
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;

    public ProcessService(ProcessRepository processRepository, RequestRepository requestRepository,
            UserRepository userRepository) {
        this.processRepository = processRepository;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Process createProcess(Process process, Long userId) {
        requireAdmin(userId);
        if (process.getRequest() == null || process.getRequest().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Request id is required to create a process");
        }
        return createProcessForAcceptedRequest(process.getRequest().getId(), process);
    }

    @Transactional
    public Process createProcessFromRequest(Long requestId, Process process, Long userId) {
        requireAdmin(userId);
        process.setStatus(Status.PENDING);
        return createProcessForAcceptedRequest(requestId, process);
    }

    public Page<Process> getAllProcesses(Long userId, Status status, Pageable pageable) {
        requireAdmin(userId);
        return status != null
                ? processRepository.findByStatus(status, pageable)
                : processRepository.findAll(pageable);
    }

    public Process getProcessById(Long id, Long userId) {
        requireAdmin(userId);
        return findProcess(id);
    }

    public Process updateProcess(Process process, Long userId) {
        requireAdmin(userId);
        if (!processRepository.existsById(process.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Process not found with id: " + process.getId());
        }
        return processRepository.save(process);
    }

    @Transactional
    public Process updateStatus(Long id, Status status, Long userId) {
        requireAdmin(userId);
        Process process = findProcess(id);
        process.setStatus(status);
        return processRepository.save(process);
    }

    public void deleteProcess(Long id, Long userId) {
        requireAdmin(userId);
        if (!processRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Process not found with id: " + id);
        }
        processRepository.deleteById(id);
    }

    private Process createProcessForAcceptedRequest(Long requestId, Process process) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Request not found with id: " + requestId));
        if (request.getStatus() != RequestStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only accepted requests can generate a process");
        }
        if (processRepository.existsByRequest_Id(requestId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A process already exists for request id: " + requestId);
        }
        process.setRequest(request);
        return processRepository.save(process);
    }

    private Process findProcess(Long id) {
        return processRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Process not found with id: " + id));
    }

    private void requireAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found with id: " + userId));
        if (user.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access denied: only ADMIN users can perform this operation");
        }
    }
}
