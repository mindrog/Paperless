package com.ss.paperless.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import javax.transaction.Transactional;

import static org.springframework.data.jpa.domain.Specification.where;

@Service
public class EmailService {

    private final EmailmessageRepository emailmessageRepository;

    @Autowired
    public EmailService(EmailmessageRepository emailmessageRepository) {
        this.emailmessageRepository = emailmessageRepository;
    }

    public Page<Emailmessage> getEmailsByRecipientWithFilters(
            Long recipientId,
            String senderEmail,
            String recipientEmail,
            String subject,
            String content,
            LocalDateTime startDate,
            LocalDateTime endDate,
            boolean hasAttachment,
            Pageable pageable
    ) {
        return emailmessageRepository.findAll(
                where(EmailSpecification.recipientIdEquals(recipientId))
                        .and(EmailSpecification.senderContains(senderEmail))
                        .and(EmailSpecification.recipientContains(recipientEmail))
                        .and(EmailSpecification.subjectContains(subject))
                        .and(EmailSpecification.contentContains(content))
                        .and(EmailSpecification.sentAfter(startDate))
                        .and(EmailSpecification.sentBefore(endDate))
                        .and(EmailSpecification.hasAttachment(hasAttachment)),
                pageable
        );
    }
    
    @Transactional
    public void updateEmailStatus(Long emailNo, String status) {
        Emailmessage email = emailmessageRepository.findById(emailNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일 번호입니다: " + emailNo));
        email.setStatus(status);
        emailmessageRepository.save(email);
    }
}
