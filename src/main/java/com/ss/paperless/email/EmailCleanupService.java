package com.ss.paperless.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmailCleanupService {

    private final EmailmessageRepository emailmessageRepository;

    @Autowired
    public EmailCleanupService(EmailmessageRepository emailmessageRepository) {
        this.emailmessageRepository = emailmessageRepository;
    }

    /**
     * 매일 자정에 30일 이상 휴지통에 있는 이메일을 삭제하는 스케줄러
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanUpOldTrashEmails() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<Emailmessage> oldTrashEmails = emailmessageRepository.findByDeletedAtBefore(cutoffDate);
        if (!oldTrashEmails.isEmpty()) {
            emailmessageRepository.deleteAll(oldTrashEmails);
            System.out.println("Deleted " + oldTrashEmails.size() + " emails from Trash.");
        }
    }
}