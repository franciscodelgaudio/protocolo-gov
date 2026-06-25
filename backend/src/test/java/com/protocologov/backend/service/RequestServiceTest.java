package com.protocologov.backend.service;

import com.protocologov.backend.enums.RequestStatus;
import com.protocologov.backend.enums.Role;
import com.protocologov.backend.model.Request;
import com.protocologov.backend.model.User;
import com.protocologov.backend.model.UserRequest;
import com.protocologov.backend.repository.ProcessRepository;
import com.protocologov.backend.repository.RequestRepository;
import com.protocologov.backend.repository.UserRepository;
import com.protocologov.backend.repository.UserRequestRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestServiceTest {

    @Mock
    private ProcessRepository processRepository;

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserRequestRepository userRequestRepository;

    @InjectMocks
    private RequestService requestService;

    @Test
    @DisplayName("Should create request as pending and link it to user")
    void shouldCreateRequestAsPendingAndLinkItToUser() {
        User user = createUser(1L, Role.USER);
        Request request = createRequest(null, null);
        Request savedRequest = createRequest(10L, RequestStatus.PENDING);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(requestRepository.save(request)).thenReturn(savedRequest);

        Request result = requestService.createRequest(request, 1L);

        assertThat(request.getStatus()).isEqualTo(RequestStatus.PENDING);
        assertThat(result).isSameAs(savedRequest);

        ArgumentCaptor<UserRequest> userRequestCaptor = ArgumentCaptor.forClass(UserRequest.class);
        verify(userRequestRepository).save(userRequestCaptor.capture());
        assertThat(userRequestCaptor.getValue().getUser()).isSameAs(user);
        assertThat(userRequestCaptor.getValue().getRequest()).isSameAs(savedRequest);
    }

    @Test
    @DisplayName("Should accept request when user is admin")
    void shouldAcceptRequestWhenUserIsAdmin() {
        User admin = createUser(1L, Role.ADMIN);
        Request request = createRequest(10L, RequestStatus.PENDING);

        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(requestRepository.findById(10L)).thenReturn(Optional.of(request));
        when(requestRepository.save(request)).thenReturn(request);

        Request result = requestService.acceptRequest(10L, 1L);

        assertThat(result.getStatus()).isEqualTo(RequestStatus.ACCEPTED);
        verify(requestRepository).save(request);
    }

    @Test
    @DisplayName("Should reject accept request when user is not admin")
    void shouldRejectAcceptRequestWhenUserIsNotAdmin() {
        User user = createUser(1L, Role.USER);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> requestService.acceptRequest(10L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.FORBIDDEN);

        verify(requestRepository, never()).findById(any());
        verify(requestRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reject accepted request conflict")
    void shouldRejectAcceptedRequestConflict() {
        User admin = createUser(1L, Role.ADMIN);
        Request request = createRequest(10L, RequestStatus.ACCEPTED);

        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(requestRepository.findById(10L)).thenReturn(Optional.of(request));

        assertThatThrownBy(() -> requestService.rejectRequest(10L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.CONFLICT);

        verify(requestRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should delete request and related records")
    void shouldDeleteRequestAndRelatedRecords() {
        User admin = createUser(1L, Role.ADMIN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(requestRepository.existsById(10L)).thenReturn(true);

        requestService.deleteRequest(10L, 1L);

        verify(processRepository).deleteByRequest_Id(10L);
        verify(userRequestRepository).deleteByRequest_Id(10L);
        verify(requestRepository).deleteById(10L);
    }

    private User createUser(Long id, Role role) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        return user;
    }

    private Request createRequest(Long id, RequestStatus status) {
        Request request = new Request();
        request.setId(id);
        request.setName("Request test");
        request.setDescription("Test description");
        request.setStatus(status);
        return request;
    }
}
