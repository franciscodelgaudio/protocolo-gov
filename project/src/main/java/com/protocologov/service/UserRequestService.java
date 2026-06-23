package com.protocologov.service;

import com.protocologov.dto.UserRequestDTO;
import com.protocologov.exception.BadRequestException;
import com.protocologov.exception.ResourceNotFoundException;
import com.protocologov.model.Request;
import com.protocologov.model.User;
import com.protocologov.model.UserRequest;
import com.protocologov.repository.RequestRepository;
import com.protocologov.repository.UserRepository;
import com.protocologov.repository.UserRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserRequestService {

    private final UserRequestRepository userRequestRepository;
    private final UserRepository userRepository;
    private final RequestRepository requestRepository;

    public UserRequestService(UserRequestRepository userRequestRepository, UserRepository userRepository, RequestRepository requestRepository) {
        this.userRequestRepository = userRequestRepository;
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
    }

    public List<UserRequestDTO> findAll() {
        return userRequestRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserRequestDTO findById(Long id) {
        return userRequestRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Vínculo não encontrado com id: " + id));
    }

    public UserRequestDTO save(UserRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new BadRequestException("Usuário não encontrado com id: " + dto.getUserId()));
        Request request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new BadRequestException("Requisição não encontrada com id: " + dto.getRequestId()));
        UserRequest userRequest = new UserRequest();
        userRequest.setUser(user);
        userRequest.setRequest(request);
        return toDTO(userRequestRepository.save(userRequest));
    }

    public void delete(Long id) {
        if (!userRequestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vínculo não encontrado com id: " + id);
        }
        userRequestRepository.deleteById(id);
    }

    private UserRequestDTO toDTO(UserRequest userRequest) {
        Long userId = userRequest.getUser() != null ? userRequest.getUser().getId() : null;
        Long requestId = userRequest.getRequest() != null ? userRequest.getRequest().getId() : null;
        return new UserRequestDTO(userRequest.getId(), userId, requestId);
    }
}
