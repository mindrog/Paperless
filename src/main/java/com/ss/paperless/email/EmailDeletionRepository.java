package com.ss.paperless.email;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmailDeletionRepository extends JpaRepository<EmailDeletion, Long> {
    List<EmailDeletion> findByEmailmessage_EmailNo(Long emailNo);
    Optional<EmailDeletion> findByEmailmessage_EmailNoAndUser_EmpNo(Long emailNo, Long userId);
}
