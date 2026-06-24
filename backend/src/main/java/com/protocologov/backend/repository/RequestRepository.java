package com.protocologov.backend.repository;

import com.protocologov.backend.enums.RequestStatus;
import com.protocologov.backend.model.Request;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
    Page<Request> findByStatus(RequestStatus status, Pageable pageable);
}
