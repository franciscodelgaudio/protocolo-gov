package com.protocologov.backend.repository;

import com.protocologov.backend.model.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRequestRepository extends JpaRepository<UserRequest, Long> {
    List<UserRequest> findByUser_Id(Long userId);
    boolean existsByUser_IdAndRequest_Id(Long userId, Long requestId);
    void deleteByRequest_Id(Long requestId);
}