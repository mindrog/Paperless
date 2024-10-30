package com.ss.paperless.email;

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

    @Autowired
    public EmailController(EmailmessageRepository emailmessageRepository,
                           EmployeeService employeeService,
                           EmailService emailService) {
        this.emailmessageRepository = emailmessageRepository;
        this.employeeService = employeeService;
        this.emailService = emailService;
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
    public ResponseEntity<?> sendEmail(
            @RequestParam("recipientEmail") String recipientEmail,
            @RequestParam(value = "ccEmail", required = false) String ccEmail,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            Principal principal) {

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

    /**
     * 이메일 목록 조회 API (페이징 및 필터링 지원)
     *
     * @param recipientId    수신자의 empNo
     * @param sender         작성자 이메일 검색어 (옵션)
     * @param recipientParam 수신자 이메일 검색어 (옵션)
     * @param subject        이메일 제목 검색어 (옵션)
     * @param content        이메일 내용 검색어 (옵션)
     * @param startDateStr   이메일 발송 시작 날짜 (YYYY-MM-DD, 옵션)
     * @param endDateStr     이메일 발송 종료 날짜 (YYYY-MM-DD, 옵션)
     * @param hasAttachment  첨부파일 유무 (기본값: false)
     * @param page           페이지 번호 (0부터 시작, 기본값: 0)
     * @param size           페이지당 이메일 개수 (기본값: 10)
     * @param sortBy         정렬 기준 필드 (기본값: sendDate)
     * @param sortDir        정렬 방향 (asc 또는 desc, 기본값: desc)
     * @return 필터링된 이메일 페이지
     */
    @GetMapping("/list/{recipientId}")
    public ResponseEntity<?> getEmailList(
            @PathVariable Long recipientId,
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
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir
    ) {
        try {
            // 날짜 문자열을 LocalDateTime으로 변환
            LocalDateTime startDate = null;
            LocalDateTime endDate = null;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            if (startDateStr != null && !startDateStr.isEmpty()) {
                startDate = LocalDate.parse(startDateStr, formatter).atStartOfDay();
            }
            if (endDateStr != null && !endDateStr.isEmpty()) {
                endDate = LocalDate.parse(endDateStr, formatter).atTime(23, 59, 59);
            }

            // 정렬 설정
            Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

            // 페이징 객체 생성
            PageRequest pageRequest = PageRequest.of(page, size, sort);

            // 서비스 호출하여 이메일 목록 조회
            Page<Emailmessage> emailPage = emailService.getEmailsByRecipientWithFilters(
                    recipientId,
                    sender,
                    recipientParam,
                    subject,
                    content,
                    startDate,
                    endDate,
                    hasAttachment,
                    pageRequest
            );

            // Emailmessage 엔티티를 EmailDTO로 변환
            List<EmailDTO> emailDtoList = emailPage.getContent().stream().map(email -> {
                EmailDTO dto = new EmailDTO();
                dto.setEmailNo(email.getEmailNo());
                dto.setTitle(email.getTitle());
                dto.setContent(email.getContent());
                dto.setStatus(email.getStatus());
                dto.setSendDate(email.getSendDate().toString());

                // 연관된 엔티티의 필요한 정보만 설정
                dto.setWriterEmail(email.getWriter().getEmpEmail());
                dto.setRecipientEmail(email.getRecipient().getEmpEmail());
                if (email.getCc() != null) {
                    dto.setCcEmail(email.getCc().getEmpEmail());
                }

                return dto;
            }).collect(Collectors.toList());

            // 페이지 정보를 별도로 추출하여 응답 생성
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
}
