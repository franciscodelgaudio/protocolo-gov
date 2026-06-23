package com.protocologov.backend.repository;

import com.protocologov.backend.model.Process;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessRepository extends JpaRepository<Process, Long> {
}