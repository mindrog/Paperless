package com.ss.paperless.email;

import com.ss.paperless.attachment.Attachment;
import com.ss.paperless.attachment.AttachmentDTO;
import com.ss.paperless.attachment.AttachmentRepository;
import com.ss.paperless.company.CompanyEntity;
import com.ss.paperless.company.CompanyService;
import com.ss.paperless.company.DepartmentEntity;
import com.ss.paperless.company.DepartmentService;
import com.ss.paperless.employee.entity.EmployeeEntity;
import com.ss.paperless.employee.EmployeeService;
import com.ss.paperless.s3.S3Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    private final S3Service s3Service;
    private final EmailAttachmentRepository emailAttachmentRepository;
    private final AttachmentRepository attachmentRepository;

    @Autowired
    public EmailController(EmailmessageRepository emailmessageRepository, EmployeeService employeeService,
            EmailService emailService, CompanyService companyService, DepartmentService departmentService,
            S3Service s3Service, EmailAttachmentRepository emailAttachmentRepository,
            AttachmentRepository attachmentRepository) {
        this.emailmessageRepository = emailmessageRepository;
        this.employeeService = employeeService;
        this.emailService = emailService;
        this.companyService = companyService;
        this.departmentService = departmentService;
        this.s3Service = s3Service;
        this.emailAttachmentRepository = emailAttachmentRepository;
        this.attachmentRepository = attachmentRepository;
    }

    @GetMapping("/unreadcount")
    public int getUnreadCount() {
        System.out.println("unreadCount 실행!");
        String emp_code = SecurityContextHolder.getContext().getAuthentication().getName();
        int unreadCount = emailService.getUnreadCount(emp_code);
        System.out.println("unreadCount: " + unreadCount);
        return unreadCount;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(
            @RequestParam("recipientEmail") String recipientEmail,
            @RequestParam(value = "ccEmail", required = false) String ccEmail,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "existingAttachmentNos", required = false) List<Long> existingAttachmentNos,
            @RequestParam(value = "attachments", required = false) List<MultipartFile> attachments,
            Principal principal) {

        try {
            // 현재 로그인한 사용자 확인 (발신자)
            String senderEmpCode = principal.getName();
            EmployeeEntity sender = employeeService.findByEmpCode(senderEmpCode);
            if (sender == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
            }

            // 수신자 이메일로 Employee 조회
            EmployeeEntity recipient = employeeService.findByEmail(recipientEmail);
            if (recipient == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("수신자를 찾을 수 없습니다.");
            }

            // 참조자 이메일로 Employee 조회
            EmployeeEntity cc = null;
            if (ccEmail != null && !ccEmail.isEmpty()) {
                cc = employeeService.findByEmail(ccEmail);
                if (cc == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("참조자를 찾을 수 없습니다.");
                }
            }
            System.out.println("existingAttachmentNos received: " + existingAttachmentNos);

            // EmailService를 통해 전송 또는 전달 처리
            emailService.sendOrForwardEmail(sender, recipient, cc, title, content, existingAttachmentNos, attachments);

            // 성공 응답
            String action = (existingAttachmentNos != null && !existingAttachmentNos.isEmpty()) ? "전달" : "전송";
            return ResponseEntity.ok(action + "이메일이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 처리 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getEmailList(Principal principal,
            @RequestParam(value = "sender", required = false) String sender,
            @RequestParam(value = "recipient", required = false) String recipientParam,
            @RequestParam(required = false) String basicSearch,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "startDate", required = false) String startDateStr,
            @RequestParam(value = "endDate", required = false) String endDateStr,
            @RequestParam(value = "hasAttachment", defaultValue = "false") boolean hasAttachment,
            @RequestParam(value = "folder", defaultValue = "inbox") String folder,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "sendDate") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
        try {

            String emp_code = principal.getName();
            EmployeeEntity currentUser = employeeService.findByEmpCode(emp_code);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
            }

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
            Page<EmailDTO> emailPage = emailService.getEmailsByUserWithFilters(currentUser, sender,
                    recipientParam, basicSearch, content, startDate, endDate, hasAttachment, folder, pageRequest);

            // 페이지 정보를 별도로 추출하여 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("content", emailPage.getContent());
            response.put("currentPage", emailPage.getNumber());
            response.put("totalItems", emailPage.getTotalElements());
            response.put("totalPages", emailPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (

        DateTimeParseException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "이메일 목록을 불러오는 중 오류가 발생했습니다: " + e.getMessage()));
        }//
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteEmails(@RequestBody DeleteEmailsRequest deleteRequest, Principal principal) {
        try {
            // 현재 로그인한 사용자 확인
            String currentUserEmpCode = principal.getName();
            EmployeeEntity currentUser = employeeService.findByEmpCode(currentUserEmpCode);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
            }

            // 삭제할 이메일 목록 조회
            List<Long> emailIds = deleteRequest.getEmailIds();

            emailService.deleteEmails(emailIds, currentUser);

            return ResponseEntity.ok("선택한 이메일이 휴지통으로 이동되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 삭제 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/restore")
    public ResponseEntity<?> restoreEmails(@RequestBody RestoreRequest restoreRequest, Principal principal) {
        try {

            String currentUserEmpCode = principal.getName();
            EmployeeEntity currentUser = employeeService.findByEmpCode(currentUserEmpCode);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
            }

            emailService.restoreEmails(restoreRequest.getEmailIds(), currentUser);

            return ResponseEntity.ok("이메일이 성공적으로 복구되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("이메일 복구 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/permanent-delete")
    public ResponseEntity<?> permanentDeleteEmails(@RequestBody DeleteEmailsRequest deleteRequest,
            Principal principal) {
        try {
            // 현재 로그인한 사용자 확인
            String currentUserEmpCode = principal.getName();
            EmployeeEntity currentUser = employeeService.findByEmpCode(currentUserEmpCode);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
            }

            // 삭제할 이메일 목록 조회
            List<Long> emailIds = deleteRequest.getEmailIds();

            // 서비스 메서드 호출
            emailService.permanentDeleteEmails(emailIds, currentUser);

            return ResponseEntity.ok("선택한 이메일이 영구 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 영구 삭제 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/{emailNo}")
    public ResponseEntity<?> getEmailById(@PathVariable("emailNo") Long emailId, Principal principal) {
        try {
            // 현재 로그인한 사용자 확인
            String currentUserEmpCode = principal.getName();
            EmployeeEntity currentUser = employeeService.findByEmpCode(currentUserEmpCode);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
            }

            EmailDTO dto = emailService.getEmailById(emailId, currentUser);

            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "이메일을 불러오는 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}
