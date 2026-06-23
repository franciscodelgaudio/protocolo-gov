package com.protocologov.backend.service;

public class UserRequestService {
    private UserRequestRepository userRequestRepository;

    public UserRequestService(UserRequestRepository userRequestRepository) {
        this.userRequestRepository = userRequestRepository;
    }

    public UserRequest createUserRequest(UserRequest userRequest) {
        return userRequestRepository.save(userRequest);
    }

    public UserRequest getUserRequestById(Long id) {
        return userRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserRequest not found with id: " + id));
    }

    public UserRequest updateUserRequest(UserRequest userRequest) {
        if (!userRequestRepository.existsById(userRequest.getId())) {
            throw new RuntimeException("UserRequest not found with id: " + userRequest.getId());
        }
        return userRequestRepository.save(userRequest);
    }

    public void deleteUserRequest(Long id) {
        if (!userRequestRepository.existsById(id)) {
            throw new RuntimeException("UserRequest not found with id: " + id);
        }
        userRequestRepository.deleteById(id);
    }
}
