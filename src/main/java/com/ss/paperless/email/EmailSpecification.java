package com.ss.paperless.email;

import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;

import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

public class EmailSpecification {

    public static Specification<Emailmessage> senderContains(String sender) {
        return (root, query, builder) -> {
            if (sender == null || sender.isEmpty()) {
                return builder.conjunction();
            }

            // 보낸 사람(writer)의 email 또는 name을 기준으로 필터링
            query.distinct(true); // 중복 제거

            return builder.or(
                builder.like(builder.lower(root.join("writer").get("empEmail")), "%" + sender.toLowerCase() + "%"),
                builder.like(builder.lower(root.join("writer").get("empName")), "%" + sender.toLowerCase() + "%")
            );
        };
    }

    public static Specification<Emailmessage> recipientContains(String recipient) {
        return (root, query, builder) -> {
            if (recipient == null || recipient.isEmpty()) {
                return builder.conjunction();
            }

            // 수신자(recipient)의 email 또는 name을 기준으로 필터링
            query.distinct(true); // 중복 제거

            return builder.or(
                builder.like(builder.lower(root.join("recipient").get("empEmail")), "%" + recipient.toLowerCase() + "%"),
                builder.like(builder.lower(root.join("recipient").get("empName")), "%" + recipient.toLowerCase() + "%")
            );
        };
    }

    public static Specification<Emailmessage> subjectContains(String subject) {
        return (root, query, builder) -> {
            if (subject == null || subject.isEmpty()) {
                return builder.conjunction();
            }
            return builder.like(builder.lower(root.get("title")), "%" + subject.toLowerCase() + "%");
        };
    }

    public static Specification<Emailmessage> contentContains(String content) {
        return (root, query, builder) -> {
            if (content == null || content.isEmpty()) {
                return builder.conjunction();
            }
            return builder.like(builder.lower(root.get("content")), "%" + content.toLowerCase() + "%");
        };
    }

    public static Specification<Emailmessage> sentAfter(LocalDateTime startDate) {
        return (root, query, builder) -> {
            if (startDate == null) {
                return builder.conjunction();
            }
            return builder.greaterThanOrEqualTo(root.get("sendDate"), startDate);
        };
    }

    public static Specification<Emailmessage> sentBefore(LocalDateTime endDate) {
        return (root, query, builder) -> {
            if (endDate == null) {
                return builder.conjunction();
            }
            return builder.lessThanOrEqualTo(root.get("sendDate"), endDate);
        };
    }

    public static Specification<Emailmessage> hasAttachment(boolean hasAttachment) {
        return (root, query, builder) -> {
            if (!hasAttachment) {
                return builder.conjunction(); // 필터를 적용하지 않음
            }

            // 이메일에 첨부파일이 존재하는지 서브쿼리를 통해 확인
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<EmailAttachment> emailAttachmentRoot = subquery.from(EmailAttachment.class);
            subquery.select(emailAttachmentRoot.get("emailNo"))
                    .where(builder.equal(emailAttachmentRoot.get("emailNo"), root.get("emailNo")));

            return builder.exists(subquery);
        };
    }

    public static Specification<Emailmessage> recipientIdEquals(Long recipientId) {
        return (root, query, builder) -> {
            if (recipientId == null) {
                return builder.conjunction();
            }
            return builder.equal(root.join("recipient").get("empNo"), recipientId);
        };
    }
}
