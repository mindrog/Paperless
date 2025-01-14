package com.ss.paperless.email;

import com.ss.paperless.attachment.Attachment;
import com.ss.paperless.attachment.AttachmentDTO;
import com.ss.paperless.attachment.AttachmentRepository;
import com.ss.paperless.company.CompanyEntity;
import com.ss.paperless.company.CompanyService;
import com.ss.paperless.company.DepartmentEntity;
import com.ss.paperless.company.DepartmentService;
import com.ss.paperless.employee.EmployeeRepository;
import com.ss.paperless.employee.EmployeeService;
import com.ss.paperless.employee.entity.EmployeeEntity;
import com.ss.paperless.s3.S3Service;

import org.apache.catalina.mapper.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmailService {

	private final EmailmessageRepository emailmessageRepository;
	private final UserEmailStatusRepository userEmailStatusRepository;
	private final EmployeeService employeeService;
	private final AttachmentRepository attachmentRepository;
	private final EmailAttachmentRepository emailAttachmentRepository;
	private final CompanyService companyService;
	private final DepartmentService departmentService;
	private final EmailMapper mapper;
	private final S3Service s3Service;
	private final EmployeeRepository employeeRepository;

	@Autowired
	public EmailService(EmailmessageRepository emailmessageRepository,
			UserEmailStatusRepository userEmailStatusRepository, EmployeeService employeeService,
			AttachmentRepository attachmentRepository, EmailAttachmentRepository emailAttachmentRepository,
			CompanyService companyService, DepartmentService departmentService, EmailMapper mapper,
			EmployeeRepository employeeRepository,S3Service s3Service) {
		this.emailmessageRepository = emailmessageRepository;
		this.userEmailStatusRepository = userEmailStatusRepository;
		this.employeeService = employeeService;
		this.attachmentRepository = attachmentRepository;
		this.emailAttachmentRepository = emailAttachmentRepository;
		this.companyService = companyService;
		this.departmentService = departmentService;
		this.mapper = mapper;
		this.employeeRepository = employeeRepository;
		this.s3Service=s3Service;
	}

	// 받은 편지함 조회
	public Page<EmailDTO> getEmailsByUserWithFilters(EmployeeEntity user, String senderEmail, String recipientEmail,
			String basicSearch, String content, LocalDateTime startDate, LocalDateTime endDate, boolean hasAttachment,
			String folder, Pageable pageable) {

		// 폴더 및 삭제 상태에 따라 UserEmailStatus 가져오기
		List<UserEmailStatus> statuses;

		if ("trash".equalsIgnoreCase(folder)) {
			// 휴지통의 경우, deletedAt이 NOT NULL인 이메일 조회
			statuses = userEmailStatusRepository.findByUserAndFolderAndDeletedAtIsNotNull(user, folder);
		} else {
			// 받은 편지함이나 보낸 메일함의 경우, deletedAt이 NULL인 이메일 조회
			statuses = userEmailStatusRepository.findByUserAndFolderAndDeletedAtIsNull(user, folder);
		}

		// 필터링 적용
		List<UserEmailStatus> filteredStatuses = statuses.stream().filter(status -> {
			Emailmessage email = status.getEmail();
			boolean matches = true;

			// 필터링 조건 적용

			// 기본 검색 조건 적용
			if (basicSearch != null && !basicSearch.trim().isEmpty()) {
				String lowerBasicSearch = basicSearch.toLowerCase();
				String title = email.getTitle() != null ? email.getTitle().toLowerCase() : "";
				String senderEmpEmail = email.getWriter().getEmpEmail() != null
						? email.getWriter().getEmpEmail().toLowerCase()
						: "";
				String senderEmpName = email.getWriter().getEmpName() != null
						? email.getWriter().getEmpName().toLowerCase()
						: "";

				if (!(title.contains(lowerBasicSearch) || senderEmpEmail.contains(lowerBasicSearch)
						|| senderEmpName.contains(lowerBasicSearch))) {
					matches = false;
				}
			}

			if (senderEmail != null && !senderEmail.isEmpty()) {
				String senderEmpEmail = email.getWriter().getEmpEmail().toLowerCase();
				String senderEmpName = email.getWriter().getEmpName().toLowerCase();
				String searchTerm = senderEmail.toLowerCase();
				if (!(senderEmpEmail.contains(searchTerm) || senderEmpName.contains(searchTerm))) {
					matches = false;
				}
			}

			if (recipientEmail != null && !recipientEmail.isEmpty()) {
				String recipientEmpEmail = email.getRecipient().getEmpEmail().toLowerCase();
				String recipientEmpName = email.getRecipient().getEmpName().toLowerCase();
				String searchTerm = recipientEmail.toLowerCase();
				if (!(recipientEmpEmail.contains(searchTerm) || recipientEmpName.contains(searchTerm))) {
					matches = false;
				}
			}

			if (content != null && !content.isEmpty()) {
				if (!email.getContent().toLowerCase().contains(content.toLowerCase())) {
					matches = false;
				}
			}

			if (startDate != null) {
				if (email.getSendDate().isBefore(startDate)) {
					matches = false;
				}
			}

			if (endDate != null) {
				if (email.getSendDate().isAfter(endDate)) {
					matches = false;
				}
			}

			if (hasAttachment) {
				boolean emailHasAttachment = emailAttachmentRepository.existsByEmailNo(email.getEmailNo());
				if (!emailHasAttachment) {
					matches = false;
				}
			}

			return matches;
		}).collect(Collectors.toList());

		System.out.println("Number of emails after filtering: " + filteredStatuses.size());

		// 이메일 DTO로 변환
		List<EmailDTO> emailDTOs = filteredStatuses.stream()
				.map(status -> convertToDTO(status.getEmail(), status, user)).collect(Collectors.toList());

		// 정렬 적용
		Sort sort = pageable.getSort();
		Comparator<EmailDTO> comparator = Comparator.comparing(EmailDTO::getSendDate);
		if (sort.isSorted()) {
			for (Sort.Order order : sort) {
				if ("sendDate".equals(order.getProperty())) {
					comparator = order.isAscending() ? Comparator.comparing(EmailDTO::getSendDate)
							: Comparator.comparing(EmailDTO::getSendDate).reversed();
				}

			}
		}

		emailDTOs.sort(comparator);

		// 페이지네이션 처리
		int start = (int) pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), emailDTOs.size());
		List<EmailDTO> pageContent = emailDTOs.subList(start, end);

		return new PageImpl<>(pageContent, pageable, emailDTOs.size());
	}

	@Transactional
	public void sendOrForwardEmail(EmployeeEntity sender, EmployeeEntity recipient, EmployeeEntity cc, String title,
			String content, List<Long> existingAttachmentNos, List<MultipartFile> newAttachments) throws IOException {

		// 새로운 이메일 객체 생성
		Emailmessage email = new Emailmessage();
		email.setWriter(sender);
		email.setRecipient(recipient);
		email.setCc(cc);
		email.setTitle(title);
		email.setContent(content);
		email.setSendDate(LocalDateTime.now());

		emailmessageRepository.save(email);

		// 기존 첨부파일 처리 (전달 시)
		if (existingAttachmentNos != null && !existingAttachmentNos.isEmpty()) {
			for (Long attaNo : existingAttachmentNos) {
				Attachment existingAtt = attachmentRepository.findById(attaNo)
						.orElseThrow(() -> new RuntimeException("존재하지 않는 첨부파일입니다: " + attaNo));

				// 첨부파일 소유권 검증
				boolean isOwned = emailAttachmentRepository.existsByAttaNoAndEmailWriterOrEmailRecipient(attaNo,
						sender);
				if (!isOwned) {
					throw new RuntimeException("첨부파일에 대한 권한이 없습니다: " + attaNo);
				}

				// EmailAttachment 엔티티 생성 및 저장
				EmailAttachment emailAttachment = EmailAttachment.builder().emailNo(email.getEmailNo())
						.attaNo(existingAtt.getAttaNo()).email(email).attachment(existingAtt).build();
				emailAttachmentRepository.save(emailAttachment);
				System.out.println("전달된 첨부파일 추가: emailNo=" + email.getEmailNo() + ", attaNo=" + existingAtt.getAttaNo());
			}
		}else {
			System.out.println("전달 첨부파일 없음.");
		}

		// 새로운 첨부파일 처리
		if (newAttachments != null && !newAttachments.isEmpty()) {
			for (MultipartFile file : newAttachments) {
				String fileUrl = s3Service.uploadFile(file, "email", email.getEmailNo());
				// Attachment 엔티티 생성 및 저장
				Attachment attachment = Attachment.builder()
						.attaKey("emails/" + email.getEmailNo() + "/" + file.getOriginalFilename()).attaUrl(fileUrl)
						.attaOriginalName(file.getOriginalFilename()).attaSize(file.getSize()).build();
				attachmentRepository.save(attachment);

				// EmailAttachment 엔티티 생성 및 저장
				EmailAttachment emailAttachment = EmailAttachment.builder().emailNo(email.getEmailNo())
						.attaNo(attachment.getAttaNo()).email(email).attachment(attachment).build();
				emailAttachmentRepository.save(emailAttachment);
			}
		}

	}

	// 이메일 상세 조회 시 상태 업데이트 등
	@Transactional
	public void markAsRead(Emailmessage email, EmployeeEntity user) {
	    List<UserEmailStatus> userEmailStatuses = userEmailStatusRepository.findByEmailAndUser(email, user);
	    if (userEmailStatuses == null || userEmailStatuses.isEmpty()) {
	        // 권한이 없거나 관련 상태가 없는 경우 예외를 던질 수 있습니다.
	        throw new RuntimeException("이메일 상태를 찾을 수 없습니다.");
	    }

	    for (UserEmailStatus status : userEmailStatuses) {
	        if ("unread".equalsIgnoreCase(status.getStatus())) {
	            status.setStatus("read");
	            
	        }
	    }
	}

	// 이메일 삭제
	public void deleteEmails(List<Long> emailIds, EmployeeEntity user) {
		List<UserEmailStatus> statuses = userEmailStatusRepository.findByEmailEmailNoInAndUser(emailIds, user);

		for (UserEmailStatus status : statuses) {
			status.setDeletedAt(LocalDateTime.now());
			status.setFolder("trash");
		}

		userEmailStatusRepository.saveAll(statuses);
	}

	// 이메일 복구
	public void restoreEmails(List<Long> emailIds, EmployeeEntity user) {
		List<UserEmailStatus> statuses = userEmailStatusRepository.findByEmailEmailNoInAndUser(emailIds, user);

		for (UserEmailStatus status : statuses) {
			status.setDeletedAt(null);

			if (status.getEmail().getWriter().equals(user)) {
				status.setFolder("sent"); // 발신자라면 'sent' 폴더로 복구
			} else {
				status.setFolder("inbox"); // 수신자라면 'inbox' 폴더로 복구
			}
		}

		userEmailStatusRepository.saveAll(statuses);
	}

	public int getUnreadCount(String emp_code) {
		EmployeeEntity employee=employeeRepository.findByEmpCode(emp_code);
		return mapper.getUnreadCount(employee.getEmpNo());
	}

	// 이메일 저장
	public void saveEmail(Emailmessage email, List<EmployeeEntity> recipients) {
		emailmessageRepository.save(email);

	}

	// 이메일 상세 조회
	@Transactional
	public EmailDTO getEmailById(Long emailId, EmployeeEntity currentUser) {
		Optional<Emailmessage> optionalEmail = emailmessageRepository.findById(emailId);
		if (!optionalEmail.isPresent()) {
			throw new RuntimeException("이메일을 찾을 수 없습니다.");
		}

		Emailmessage email = optionalEmail.get();

		// 권한 체크: 해당 사용자의 이메일인지 확인
		List<UserEmailStatus> userEmailStatuses = userEmailStatusRepository.findByEmailAndUser(email, currentUser);
		if (userEmailStatuses.isEmpty()) {
	        throw new RuntimeException("이메일에 접근할 권한이 없습니다.");
	    }


		// 이메일 읽음 처리
		markAsRead(email, currentUser);

		// DTO 변환
		return convertToDTO(email, userEmailStatuses.get(0), currentUser);
	}

	// DTO 변환 메서드
	private EmailDTO convertToDTO(Emailmessage email, UserEmailStatus status, EmployeeEntity loginUser) {
		EmailDTO dto = new EmailDTO();
		dto.setEmailNo(email.getEmailNo());
		dto.setTitle(email.getTitle());
		dto.setContent(email.getContent());
		dto.setStatus(status.getStatus());
		dto.setSendDate(email.getSendDate().toString());
		dto.setDeletedAt(status.getDeletedAt());

		// 발신자 수신자 정 정보 설정
		EmployeeEntity senderEntity = email.getWriter();
		EmployeeEntity recipientEntity = email.getRecipient();
		dto.setWriterEmail(senderEntity.getEmpEmail());
		dto.setWriterName(senderEntity.getEmpName());
		dto.setRecipientName(recipientEntity.getEmpName());

		Long recipientCompanyNo = recipientEntity.getEmpCompNo();
		Long recipientdeptNo = recipientEntity.getEmpDeptNo();

		Long senderCompanyNo = senderEntity.getEmpCompNo();
		Long senderDeptNo = senderEntity.getEmpDeptNo();

		String recipientCompanyName = "";
		String recipientDeptName = "";

		String senderCompanyName = "";
		String senderDeptName = "";

		CompanyEntity senderCompany = companyService.findByCompNo(senderCompanyNo);
		CompanyEntity recipientCompany = companyService.findByCompNo(recipientCompanyNo);
		if (senderCompany != null) {
			senderCompanyName = senderCompany.getCompName();
		}
		if (recipientCompany != null) {
			recipientCompanyName = recipientCompany.getCompName();
		}
		DepartmentEntity senderDepartment = departmentService.findByDeptNo(senderDeptNo);
		DepartmentEntity recipientDepartment = departmentService.findByDeptNo(recipientdeptNo);
		if (senderDepartment != null) {
			senderDeptName = senderDepartment.getDeptName();
		}
		if (recipientDepartment != null) {
			recipientDeptName = recipientDepartment.getDeptName();
		}

		// 표시할 정보 설정
		String writerDisplayInfo;
		String recipientDisplayInfo;

		if (senderCompanyNo != null && recipientCompanyNo != null) {
			if (senderCompanyNo.equals(loginUser.getEmpCompNo())) {
				// 같은 회사인 경우 부서명 표시
				writerDisplayInfo = "[" + senderDeptName + "] " + senderEntity.getEmpName();
			} else {
				// 다른 회사인 경우 회사명 표시
				writerDisplayInfo = "[" + senderCompanyName + "] " + senderEntity.getEmpName();
			}
		} else {
			// 회사 정보가 없는 경우 그냥 이름만 표시
			writerDisplayInfo = senderEntity.getEmpName();
		}

		if (recipientCompanyNo != null && senderCompanyNo != null) {
			if (recipientCompanyNo.equals(loginUser.getEmpCompNo())) {
				// 같은 회사인 경우 부서명 표시
				recipientDisplayInfo = "[" + recipientDeptName + "] " + recipientEntity.getEmpName();
			} else {
				// 다른 회사인 경우 회사명 표시
				recipientDisplayInfo = "[" + recipientCompanyName + "] " + recipientEntity.getEmpName();
			}
		} else {
			// 회사 정보가 없는 경우 그냥 이름만 표시
			recipientDisplayInfo = recipientEntity.getEmpName();
		}

		dto.setWriterDisplayInfo(writerDisplayInfo);
		dto.setRecipientDisplayInfo(recipientDisplayInfo);

		// 수신자와 참조자 이메일 설정
		dto.setRecipientEmail(email.getRecipient().getEmpEmail());
		if (email.getCc() != null) {
			dto.setCcEmail(email.getCc().getEmpEmail());
		}

		// 첨부파일 정보 설정
		List<EmailAttachment> emailAttachments = emailAttachmentRepository.findByEmailNo(email.getEmailNo());
		if (emailAttachments != null && !emailAttachments.isEmpty()) {
			dto.setHasAttachment(true);
			List<AttachmentDTO> attachmentDTOs = emailAttachments.stream().map(emailAttachment -> {
				Attachment attachment = emailAttachment.getAttachment();
				return new AttachmentDTO(attachment.getAttaNo(),attachment.getAttaOriginalName(), attachment.getAttaUrl(),
						attachment.getAttaSize());
			}).collect(Collectors.toList());
			dto.setAttachments(attachmentDTOs);
		} else {
			dto.setHasAttachment(false);
			dto.setAttachments(Collections.emptyList());
		}

		return dto;
	}

	public void permanentDeleteEmails(List<Long> emailIds, EmployeeEntity user) {
		// 현재 사용자에 대한 UserEmailStatus 엔티티를 삭제
		List<UserEmailStatus> statuses = userEmailStatusRepository.findByEmailEmailNoInAndUser(emailIds, user);

		userEmailStatusRepository.deleteAll(statuses);

	}
}
