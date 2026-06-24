package com.protocologov.backend.repository;

import com.protocologov.backend.enums.RequestStatus;
import com.protocologov.backend.model.UserRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRequestRepository extends JpaRepository<UserRequest, Long> {
    List<UserRequest> findByUser_Id(Long userId);
    Page<UserRequest> findByUser_Id(Long userId, Pageable pageable);
    Page<UserRequest> findByUser_IdAndRequest_Status(Long userId, RequestStatus status, Pageable pageable);
    boolean existsByUser_IdAndRequest_Id(Long userId, Long requestId);
    void deleteByRequest_Id(Long requestId);
}
