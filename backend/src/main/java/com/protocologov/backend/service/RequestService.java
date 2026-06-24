package com.protocologov.backend.service;

import com.protocologov.backend.enums.Role;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.model.User;
import com.protocologov.backend.model.UserRequest;
import com.protocologov.backend.repository.RequestRepository;
import com.protocologov.backend.repository.UserRepository;
import com.protocologov.backend.repository.UserRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RequestService {
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final UserRequestRepository userRequestRepository;

    public RequestService(RequestRepository requestRepository,
                          UserRepository userRepository,
                          UserRequestRepository userRequestRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.userRequestRepository = userRequestRepository;
    }

    @Transactional
    public Request createRequest(Request request, Long userId) {
        User user = getUser(userId);
        Request saved = requestRepository.save(request);

        UserRequest userRequest = new UserRequest();
        userRequest.setUser(user);
        userRequest.setRequest(saved);
        userRequestRepository.save(userRequest);

        return saved;
    }

    public List<Request> getAllRequests(Long userId) {
        User user = getUser(userId);
        if (user.getRole() == Role.ADMIN) {
            return requestRepository.findAll();
        }
        return userRequestRepository.findByUser_Id(userId)
                .stream()
                .map(UserRequest::getRequest)
                .toList();
    }

    public Request getRequestById(Long id, Long userId) {
        User user = getUser(userId);
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found with id: " + id));
        if (user.getRole() != Role.ADMIN) {
            requireOwnership(userId, id);
        }
        return request;
    }

    public Request updateRequest(Request request, Long userId) {
        User user = getUser(userId);
        if (!requestRepository.existsById(request.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found with id: " + request.getId());
        }
        if (user.getRole() != Role.ADMIN) {
            requireOwnership(userId, request.getId());
        }
        return requestRepository.save(request);
    }

    @Transactional
    public void deleteRequest(Long id, Long userId) {
        User user = getUser(userId);
        if (!requestRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found with id: " + id);
        }
        if (user.getRole() != Role.ADMIN) {
            requireOwnership(userId, id);
        }
        userRequestRepository.deleteByRequest_Id(id);
        requestRepository.deleteById(id);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + userId));
    }

    private void requireOwnership(Long userId, Long requestId) {
        if (!userRequestRepository.existsByUser_IdAndRequest_Id(userId, requestId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: you do not own this request");
        }
    }
}
