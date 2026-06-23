package com.protocologov.service;

import com.protocologov.dto.ProcessDTO;
import com.protocologov.exception.BadRequestException;
import com.protocologov.exception.ResourceNotFoundException;
import com.protocologov.model.Process;
import com.protocologov.model.Request;
import com.protocologov.repository.ProcessRepository;
import com.protocologov.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessService {

    private final ProcessRepository processRepository;
    private final RequestRepository requestRepository;

    public ProcessService(ProcessRepository processRepository, RequestRepository requestRepository) {
        this.processRepository = processRepository;
        this.requestRepository = requestRepository;
    }

    public List<ProcessDTO> findAll() {
        return processRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProcessDTO findById(Long id) {
        return processRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Processo não encontrado com id: " + id));
    }

    public ProcessDTO save(ProcessDTO dto) {
        Request request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new BadRequestException("Requisição não encontrada com id: " + dto.getRequestId()));
        Process process = new Process();
        process.setName(dto.getName());
        process.setDescription(dto.getDescription());
        process.setCreatedAt(dto.getCreatedAt());
        process.setStatus(dto.getStatus());
        process.setRequest(request);
        return toDTO(processRepository.save(process));
    }

    public ProcessDTO update(Long id, ProcessDTO dto) {
        Process process = processRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Processo não encontrado com id: " + id));
        process.setName(dto.getName());
        process.setDescription(dto.getDescription());
        process.setCreatedAt(dto.getCreatedAt());
        process.setStatus(dto.getStatus());
        if (dto.getRequestId() != null) {
            Request request = requestRepository.findById(dto.getRequestId())
                    .orElseThrow(() -> new BadRequestException("Requisição não encontrada com id: " + dto.getRequestId()));
            process.setRequest(request);
        }
        return toDTO(processRepository.save(process));
    }

    public void delete(Long id) {
        if (!processRepository.existsById(id)) {
            throw new ResourceNotFoundException("Processo não encontrado com id: " + id);
        }
        processRepository.deleteById(id);
    }

    private ProcessDTO toDTO(Process process) {
        Long requestId = process.getRequest() != null ? process.getRequest().getId() : null;
        return new ProcessDTO(process.getId(), process.getName(), process.getDescription(), process.getCreatedAt(), process.getStatus(), requestId);
    }
}
