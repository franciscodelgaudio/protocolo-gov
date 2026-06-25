package com.protocologov.backend.repository;

import com.protocologov.backend.enums.RequestStatus;
import com.protocologov.backend.model.Request;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:request_repository_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=false"
})
@Transactional
class RequestRepositoryTest {

    @Autowired
    private RequestRepository requestRepository;

    @Test
    @DisplayName("Should find requests by status")
    void shouldFindRequestsByStatus() {
        Request pendingRequest = createRequest("Open request", RequestStatus.PENDING);
        Request acceptedRequest = createRequest("Accepted request", RequestStatus.ACCEPTED);
        requestRepository.save(pendingRequest);
        requestRepository.save(acceptedRequest);

        Page<Request> result = requestRepository.findByStatus(RequestStatus.PENDING, PageRequest.of(0, 10));

        assertThat(result.getContent())
                .hasSize(1)
                .extracting(Request::getName)
                .containsExactly("Open request");
    }

    private Request createRequest(String name, RequestStatus status) {
        Request request = new Request();
        request.setName(name);
        request.setDescription("Test description");
        request.setStatus(status);
        return request;
    }
}
