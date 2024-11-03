package com.ss.paperless.email;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailAttachmentRepository extends JpaRepository<EmailAttachment, EmailAttachmentId> {
	List<EmailAttachment> findByEmailNo(Long emailNo);
}