package com.ss.paperless.email;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class EmailSpecification {

    public static Specification<Emailmessage> senderContains(String sender) {
        return (root, query, builder) -> {
            if (sender == null || sender.isEmpty()) {
                return builder.conjunction();
            }
            return builder.like(builder.lower(root.join("writer").get("email")), "%" + sender.toLowerCase() + "%");
        };
    }

    public static Specification<Emailmessage> recipientContains(String recipient) {
        return (root, query, builder) -> {
            if (recipient == null || recipient.isEmpty()) {
                return builder.conjunction();
            }
            return builder.like(builder.lower(root.join("recipient").get("email")), "%" + recipient.toLowerCase() + "%");
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
            // 첨부파일 기능이 구현되지 않았으므로, 임시로 항상 true 반환
            // 추후 첨부파일 관계가 설정되면 해당 조건을 추가할 수 있습니다.
            if (!hasAttachment) {
                return builder.conjunction();
            }
            // 예시: 첨부파일이 존재하는지 여부를 판단하는 로직 추가
            // return builder.isNotEmpty(root.get("attachments"));
            return builder.conjunction(); // 현재는 첨부파일 기능이 없으므로 조건 생략
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
