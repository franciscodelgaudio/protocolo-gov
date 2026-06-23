package com.protocologov.repository;

import com.protocologov.model.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRequestRepository extends JpaRepository<UserRequest, Long> {
}
