package com.protocologov.backend.service;

public class RequestService {
    private RequestRepository requestRepository;

    public RequestService(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    public Request createRequest(Request request) {
        try {
            return requestRepository.save(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create request: " + e.getMessage());
        }
    }

    public Request getRequestById(Long id) {
        try {
            return requestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve request: " + e.getMessage());
        }
    }

    public Request updateRequest(Request request) {
        try {
            if (!requestRepository.existsById(request.getId())) {
                throw new RuntimeException("Request not found with id: " + request.getId());
            }
            return requestRepository.save(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update request: " + e.getMessage());
        }
    }

    public void deleteRequest(Long id) {
        try {
            if (!requestRepository.existsById(id)) {
                throw new RuntimeException("Request not found with id: " + id);
            }
            requestRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete request: " + e.getMessage());
        }
    }
}
