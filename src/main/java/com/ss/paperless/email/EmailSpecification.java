package com.ss.paperless.email;

import org.springframework.data.jpa.domain.Specification;

import com.ss.paperless.employee.entity.EmployeeEntity;

import java.time.LocalDateTime;
import javax.persistence.criteria.*;

public class EmailSpecification {

	public static Specification<UserEmailStatus> senderContains(String sender) {
		return (root, query, builder) -> {
			if (sender == null || sender.isEmpty()) {
				return builder.conjunction();
			}

			// Emailmessage의 writer를 조인하여 필터링
			Join<UserEmailStatus, Emailmessage> emailJoin = root.join("email");
			Join<Emailmessage, EmployeeEntity> writerJoin = emailJoin.join("writer");

			return builder.or(builder.like(builder.lower(writerJoin.get("empEmail")), "%" + sender.toLowerCase() + "%"),
					builder.like(builder.lower(writerJoin.get("empName")), "%" + sender.toLowerCase() + "%"));
		};
	}

	public static Specification<UserEmailStatus> recipientContains(String recipient) {
		return (root, query, builder) -> {
			if (recipient == null || recipient.isEmpty()) {
				return builder.conjunction();
			}

			// Emailmessage의 recipient를 조인하여 필터링
			Join<UserEmailStatus, Emailmessage> emailJoin = root.join("email");
			Join<Emailmessage, EmployeeEntity> recipientJoin = emailJoin.join("recipient");

			return builder.or(
					builder.like(builder.lower(recipientJoin.get("empEmail")), "%" + recipient.toLowerCase() + "%"),
					builder.like(builder.lower(recipientJoin.get("empName")), "%" + recipient.toLowerCase() + "%"));
		};
	}

	public static Specification<UserEmailStatus> subjectContains(String subject) {
		return (root, query, builder) -> {
			if (subject == null || subject.isEmpty()) {
				return builder.conjunction();
			}

			Join<UserEmailStatus, Emailmessage> emailJoin = root.join("email");

			return builder.like(builder.lower(emailJoin.get("title")), "%" + subject.toLowerCase() + "%");
		};
	}

	public static Specification<UserEmailStatus> contentContains(String content) {
		return (root, query, builder) -> {
			if (content == null || content.isEmpty()) {
				return builder.conjunction();
			}

			Join<UserEmailStatus, Emailmessage> emailJoin = root.join("email");

			return builder.like(builder.lower(emailJoin.get("content")), "%" + content.toLowerCase() + "%");
		};
	}

	public static Specification<UserEmailStatus> sentAfter(LocalDateTime startDate) {
		return (root, query, builder) -> {
			if (startDate == null) {
				return builder.conjunction();
			}

			Join<UserEmailStatus, Emailmessage> emailJoin = root.join("email");

			return builder.greaterThanOrEqualTo(emailJoin.get("sendDate"), startDate);
		};
	}

	public static Specification<UserEmailStatus> sentBefore(LocalDateTime endDate) {
		return (root, query, builder) -> {
			if (endDate == null) {
				return builder.conjunction();
			}

			Join<UserEmailStatus, Emailmessage> emailJoin = root.join("email");

			return builder.lessThanOrEqualTo(emailJoin.get("sendDate"), endDate);
		};
	}

	public static Specification<UserEmailStatus> hasAttachment(boolean hasAttachment) {
		return (root, query, builder) -> {
			if (!hasAttachment) {
				return builder.conjunction();
			}

			Join<UserEmailStatus, Emailmessage> emailJoin = root.join("email");

			// 서브쿼리 작성
			Subquery<Long> subquery = query.subquery(Long.class);
			Root<EmailAttachment> emailAttachmentRoot = subquery.from(EmailAttachment.class);
			subquery.select(builder.literal(1L)); // 존재 여부만 확인하므로 임의의 값 선택

			// 서브쿼리의 where 조건 설정
			subquery.where(builder.equal(emailAttachmentRoot.get("email").get("emailNo"), emailJoin.get("emailNo")));

			// 존재 여부를 기준으로 조건 반환
			return builder.exists(subquery);
		};
	}

	public static Specification<UserEmailStatus> userEquals(EmployeeEntity user) {
		return (root, query, builder) -> builder.equal(root.get("user"), user);
	}

	public static Specification<UserEmailStatus> folderEquals(String folder) {
		return (root, query, builder) -> builder.equal(root.get("folder"), folder);
	}

	public static Specification<UserEmailStatus> notDeleted() {
		return (root, query, builder) -> builder.isNull(root.get("deletedAt"));
	}
}
