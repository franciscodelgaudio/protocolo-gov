package com.protocologov.backend.repository;

import com.protocologov.backend.enums.Status;
import com.protocologov.backend.model.Process;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessRepository extends JpaRepository<Process, Long> {
    boolean existsByRequest_Id(Long requestId);
    void deleteByRequest_Id(Long requestId);
    Page<Process> findByStatus(Status status, Pageable pageable);
}
