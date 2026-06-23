package com.protocologov.service;

import com.protocologov.dto.RequestDTO;
import com.protocologov.exception.ResourceNotFoundException;
import com.protocologov.model.Request;
import com.protocologov.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final RequestRepository requestRepository;

    public RequestService(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    public List<RequestDTO> findAll() {
        return requestRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RequestDTO findById(Long id) {
        return requestRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Requisição não encontrada com id: " + id));
    }

    public RequestDTO save(RequestDTO dto) {
        Request request = new Request();
        request.setName(dto.getName());
        request.setDescription(dto.getDescription());
        request.setCreatedAt(dto.getCreatedAt());
        return toDTO(requestRepository.save(request));
    }

    public RequestDTO update(Long id, RequestDTO dto) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requisição não encontrada com id: " + id));
        request.setName(dto.getName());
        request.setDescription(dto.getDescription());
        request.setCreatedAt(dto.getCreatedAt());
        return toDTO(requestRepository.save(request));
    }

    public void delete(Long id) {
        if (!requestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Requisição não encontrada com id: " + id);
        }
        requestRepository.deleteById(id);
    }

    private RequestDTO toDTO(Request request) {
        return new RequestDTO(request.getId(), request.getName(), request.getDescription(), request.getCreatedAt());
    }
}
