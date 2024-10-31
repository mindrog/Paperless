package com.ss.paperless.email;

import com.ss.paperless.company.CompanyEntity;
import com.ss.paperless.company.CompanyService;
import com.ss.paperless.company.DepartmentEntity;
import com.ss.paperless.company.DepartmentService;
import com.ss.paperless.employee.entity.EmployeeEntity;
import com.ss.paperless.employee.EmployeeService;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

	private final EmailmessageRepository emailmessageRepository;
	private final EmployeeService employeeService;
	private final EmailService emailService;
	private final CompanyService companyService;
	private final DepartmentService departmentService;

	@Autowired
	public EmailController(EmailmessageRepository emailmessageRepository, EmployeeService employeeService,
			EmailService emailService, CompanyService companyService, DepartmentService departmentService) {
		this.emailmessageRepository = emailmessageRepository;
		this.employeeService = employeeService;
		this.emailService = emailService;
		this.companyService = companyService;
		this.departmentService = departmentService;
	}

	/**
	 * 이메일 전송 API
	 *
	 * @param recipientEmail 수신자 이메일
	 * @param ccEmail        참조자 이메일 (선택 사항)
	 * @param title          이메일 제목
	 * @param content        이메일 내용
	 * @param principal      인증된 사용자 정보
	 * @return 응답 메시지
	 */
	@PostMapping("/send")
	public ResponseEntity<?> sendEmail(@RequestParam("recipientEmail") String recipientEmail,
			@RequestParam(value = "ccEmail", required = false) String ccEmail, @RequestParam("title") String title,
			@RequestParam("content") String content, Principal principal) {

		try {
			// 현재 로그인한 사용자 정보 가져오기 (발신자)
			String senderEmpCode = principal.getName(); // emp_code 사용
			EmployeeEntity sender = employeeService.findByEmpCode(senderEmpCode);

			// 수신자 이메일로 Employee 조회
			EmployeeEntity recipient = employeeService.findByEmail(recipientEmail);
			if (recipient == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("수신자를 찾을 수 없습니다.");
			}

			// 참조자 이메일로 Employee 조회 (선택 사항)
			EmployeeEntity cc = null;
			if (ccEmail != null && !ccEmail.isEmpty()) {
				cc = employeeService.findByEmail(ccEmail);
				if (cc == null) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body("참조자를 찾을 수 없습니다.");
				}
			}

			// 이메일 객체 생성 및 저장
			Emailmessage email = new Emailmessage();
			email.setWriter(sender);
			email.setRecipient(recipient);
			email.setCc(cc);
			email.setTitle(title);
			email.setContent(content);
			email.setSendDate(LocalDateTime.now());
			email.setStatus("unread");

			emailmessageRepository.save(email);

			// TODO: 첨부파일 기능 구현 예정

			return ResponseEntity.ok("이메일이 성공적으로 전송되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송 중 오류가 발생했습니다.");
		}
	}

	@GetMapping("/list/{recipientId}")
	public ResponseEntity<?> getEmailList(@PathVariable Long recipientId,
			@RequestParam(value = "sender", required = false) String sender,
			@RequestParam(value = "recipient", required = false) String recipientParam,
			@RequestParam(value = "subject", required = false) String subject,
			@RequestParam(value = "content", required = false) String content,
			@RequestParam(value = "startDate", required = false) String startDateStr,
			@RequestParam(value = "endDate", required = false) String endDateStr,
			@RequestParam(value = "hasAttachment", defaultValue = "false") boolean hasAttachment,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size,
			@RequestParam(value = "sortBy", defaultValue = "sendDate") String sortBy,
			@RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
		try {
			// 날짜 문자열을 LocalDateTime으로 변환 (기존 코드 유지)
			LocalDateTime startDate = null;
			LocalDateTime endDate = null;
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			if (startDateStr != null && !startDateStr.isEmpty()) {
				startDate = LocalDate.parse(startDateStr, formatter).atStartOfDay();
			}
			if (endDateStr != null && !endDateStr.isEmpty()) {
				endDate = LocalDate.parse(endDateStr, formatter).atTime(23, 59, 59);
			}

			// 정렬 설정 (기존 코드 유지)
			Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

			// 페이징 객체 생성 (기존 코드 유지)
			PageRequest pageRequest = PageRequest.of(page, size, sort);

			// 수신자 정보 가져오기
			EmployeeEntity recipient = employeeService.findByEmpNo(recipientId);
			if (recipient == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("수신자를 찾을 수 없습니다.");
			}

			// 수신자의 회사 번호 가져오기
			Long recipientCompanyNo = recipient.getEmpCompNo();
			CompanyEntity recipientCompany = companyService.findByCompNo(recipientCompanyNo);
			if (recipientCompany == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("수신자의 회사를 찾을 수 없습니다.");
			}

			// 서비스 호출하여 이메일 목록 조회
			Page<Emailmessage> emailPage = emailService.getEmailsByRecipientWithFilters(recipientId, sender,
					recipientParam, subject, content, startDate, endDate, hasAttachment, pageRequest);

			// Emailmessage 엔티티를 EmailDTO로 변환
			List<EmailDTO> emailDtoList = emailPage.getContent().stream().map(email -> {
				EmailDTO dto = new EmailDTO();
				dto.setEmailNo(email.getEmailNo());
				dto.setTitle(email.getTitle());
				dto.setContent(email.getContent());
				dto.setStatus(email.getStatus());
				dto.setSendDate(email.getSendDate().toString());

				// 발신자와 수신자 정보 가져오기
				EmployeeEntity senderEntity = email.getWriter();
				EmployeeEntity emailRecipient = email.getRecipient();

				// 발신자 정보 설정
				dto.setWriterEmail(senderEntity.getEmpEmail());
				dto.setWriterName(senderEntity.getEmpName());

				// 발신자의 회사 번호와 부서 번호 가져오기
				Long senderCompanyNo = senderEntity.getEmpCompNo();
				Long senderDeptNo = senderEntity.getEmpDeptNo();

				// 발신자의 회사명과 부서명 가져오기
				String senderCompanyName = "";
				String senderDeptName = "";

				CompanyEntity senderCompany = companyService.findByCompNo(senderCompanyNo);
				if (senderCompany != null) {
					senderCompanyName = senderCompany.getCompName();
				}

				DepartmentEntity senderDepartment = departmentService.findByDeptNo(senderDeptNo);
				if (senderDepartment != null) {
					senderDeptName = senderDepartment.getDeptName();
				}

				// 표시할 정보 설정
				String writerDisplayInfo;

				if (senderCompanyNo != null && recipientCompanyNo != null) {
					if (senderCompanyNo.equals(recipientCompanyNo)) {
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

				dto.setWriterDisplayInfo(writerDisplayInfo);

				// 수신자와 참조자 이메일 설정 (기존 코드 유지)
				dto.setRecipientEmail(emailRecipient.getEmpEmail());
				if (email.getCc() != null) {
					dto.setCcEmail(email.getCc().getEmpEmail());
				}

				return dto;
			}).collect(Collectors.toList());

			// 페이지 정보를 별도로 추출하여 응답 생성 (기존 코드 유지)
			Map<String, Object> response = new HashMap<>();
			response.put("content", emailDtoList);
			response.put("currentPage", emailPage.getNumber());
			response.put("totalItems", emailPage.getTotalElements());
			response.put("totalPages", emailPage.getTotalPages());

			return ResponseEntity.ok(response);
		} catch (DateTimeParseException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Collections.singletonMap("message", "날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)"));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonMap("message", "이메일 목록을 불러오는 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}

	@GetMapping("/{emailId}")
	public ResponseEntity<?> getEmailById(@PathVariable Long emailId, Principal principal) {
		try {
			// 현재 로그인한 사용자 확인 
			String currentUserEmpCode = principal.getName();
			EmployeeEntity currentUser = employeeService.findByEmpCode(currentUserEmpCode);
			if (currentUser == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
			}

			// 이메일 조회
			Optional<Emailmessage> optionalEmail = emailmessageRepository.findById(emailId);
			if (!optionalEmail.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("이메일을 찾을 수 없습니다.");
			}

			Emailmessage email = optionalEmail.get();

			// 권한 체크: 수신자나 참조자, 발신자인 경우에만 접근 가능
			boolean isAuthorized = email.getRecipient().getEmpNo().equals(currentUser.getEmpNo())
					|| (email.getCc() != null && email.getCc().getEmpNo().equals(currentUser.getEmpNo()))
					|| email.getWriter().getEmpNo().equals(currentUser.getEmpNo());

			if (!isAuthorized) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body("이메일에 접근할 권한이 없습니다.");
			}

			// Emailmessage 엔티티를 EmailDTO로 변환
			EmailDTO dto = new EmailDTO();
			dto.setEmailNo(email.getEmailNo());
			dto.setTitle(email.getTitle());
			dto.setContent(email.getContent());
			dto.setStatus(email.getStatus());
			dto.setSendDate(email.getSendDate().toString());

			// 발신자 정보 설정 
			EmployeeEntity senderEntity = email.getWriter();
			dto.setWriterEmail(senderEntity.getEmpEmail());
			dto.setWriterName(senderEntity.getEmpName());

			Long senderCompanyNo = senderEntity.getEmpCompNo();
			Long senderDeptNo = senderEntity.getEmpDeptNo();

			String senderCompanyName = "";
			String senderDeptName = "";

			CompanyEntity senderCompany = companyService.findByCompNo(senderCompanyNo);
			if (senderCompany != null) {
				senderCompanyName = senderCompany.getCompName();
			}

			DepartmentEntity senderDepartment = departmentService.findByDeptNo(senderDeptNo);
			if (senderDepartment != null) {
				senderDeptName = senderDepartment.getDeptName();
			}

			// 표시할 정보 설정
			String writerDisplayInfo;

			Long recipientCompanyNo = currentUser.getEmpCompNo();

			if (senderCompanyNo != null && recipientCompanyNo != null) {
				if (senderCompanyNo.equals(recipientCompanyNo)) {
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

			dto.setWriterDisplayInfo(writerDisplayInfo);

			// 수신자와 참조자 이메일 설정
			dto.setRecipientEmail(email.getRecipient().getEmpEmail());
			if (email.getCc() != null) {
				dto.setCcEmail(email.getCc().getEmpEmail());
			}

			

			return ResponseEntity.ok(dto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonMap("message", "이메일을 불러오는 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}
}
