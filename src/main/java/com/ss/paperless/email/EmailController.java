package com.ss.paperless.email;

import com.ss.paperless.email.Emailmessage;
import com.ss.paperless.email.EmailmessageRepository;
import com.ss.paperless.employee.EmployeeEntity;
import com.ss.paperless.employee.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public EmailController(EmailmessageRepository emailmessageRepository, EmployeeService employeeService) {
        this.emailmessageRepository = emailmessageRepository;
        this.employeeService = employeeService;
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
            email.setSendDate(new Date());
            email.setStatus("unread");

            emailmessageRepository.save(email);

            // TODO: 첨부파일 기능 구현 예정
            /*
            if (attachments != null && !attachments.isEmpty()) {
                // 첨부파일 처리 로직 추가
            }
            */

            return ResponseEntity.ok("이메일이 성공적으로 전송되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송 중 오류가 발생했습니다.");
        }
    }

    /**
     * 이메일 목록 조회 API
     *
     * @param principal 인증된 사용자 정보
     * @return 이메일 목록
     */
    @GetMapping("/list")
    public ResponseEntity<?> getEmailList(Principal principal) {
        String empCode = principal.getName();
        EmployeeEntity user = employeeService.findByEmpCode(empCode);

        List<Emailmessage> emails = emailmessageRepository.findByRecipient(user);

        List<Map<String, Object>> emailDTOs = emails.stream().map(email -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("emailNo", email.getEmailNo());
            dto.put("writerName", email.getWriter().getEmpName());
            dto.put("recipientName", email.getRecipient().getEmpName());
            dto.put("ccName", email.getCc() != null ? email.getCc().getEmpName() : null);
            dto.put("title", email.getTitle());
            dto.put("content", email.getContent());
            dto.put("status", email.getStatus());
            dto.put("sendDate", email.getSendDate());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(emailDTOs);
    }

    
}
