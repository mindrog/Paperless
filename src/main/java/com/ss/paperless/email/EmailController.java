// EmailController.java

package com.ss.paperless.email;

import com.ss.paperless.email.Emailmessage;
import com.ss.paperless.email.EmailmessageRepository;
import com.ss.paperless.employee.EmployeeEntity;
import com.ss.paperless.employee.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailmessageRepository emailmessageRepository;

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(
            @RequestParam("receiverEmail") String receiverEmail,
            @RequestParam(value = "ccEmail", required = false) String ccEmail,
            @RequestParam("title") String title,
            @RequestParam("emailContent") String emailContent,
            @RequestParam(value = "attachments", required = false) List<MultipartFile> attachments,
            Principal principal) {

        try {
            // 현재 로그인한 사용자 정보 가져오기 
            String senderEmail = principal.getName();
            EmployeeEntity sender = employeeService.findByEmail(senderEmail);

            // 이메일 객체 생성 및 저장
            Emailmessage email = new Emailmessage();
            email.setSender(sender);
            email.setReceiverEmail(receiverEmail);
            email.setCcEmail(ccEmail);
            email.setTitle(title);
            email.setContent(emailContent);
            email.setSentAt(new Date());
            email.setStatus("unread");

            emailmessageRepository.save(email);

            // 첨부파일 처리 (현재는 처리하지 않음)
            if (attachments != null && !attachments.isEmpty()) {
                
            }

            // 응답 반환
            return ResponseEntity.ok("이메일이 성공적으로 전송되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("이메일 전송 중 오류가 발생했습니다.");
        }
    }

    // 이메일 목록 조회 
    @GetMapping
    public ResponseEntity<?> getEmails(Principal principal) {
        try {
            // 현재 로그인한 사용자 정보 가져오기
            String userEmail = principal.getName();
            EmployeeEntity user = employeeService.findByEmail(userEmail);

            // 해당 사용자가 발신자 또는 수신자인 이메일 목록 조회
            // 여기서는 간단히 모든 이메일을 반환
            List<Emailmessage> emails = emailmessageRepository.findAll();

            return ResponseEntity.ok(emails);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("이메일 목록 조회 중 오류가 발생했습니다.");
        }
    }

    // 이메일 상세 조회 
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmailById(@PathVariable Long id) {
        try {
            Emailmessage email = emailmessageRepository.findById(id).orElse(null);
            if (email == null) {
                return ResponseEntity.status(404).body("이메일을 찾을 수 없습니다.");
            }
            return ResponseEntity.ok(email);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("이메일 조회 중 오류가 발생했습니다.");
        }
    }

    
}
