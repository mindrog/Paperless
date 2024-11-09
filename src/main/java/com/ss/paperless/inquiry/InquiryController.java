package com.ss.paperless.inquiry;

import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ss.paperless.company.CompanyDTO;
import com.ss.paperless.employee.EmployeeDTO;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@ResponseBody
@RequestMapping("/api")
public class InquiryController {
	@Autowired
	InquiryService service;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@PostMapping("/inquirysend")
	public int GetInquiry(@ModelAttribute InquiryDTO inquiryDTO) {
		return service.GetInquiry(inquiryDTO);
	}
	@PostMapping("/requestsend")
	public int GetRequest(@ModelAttribute RequestDTO requestDTO) {
		return service.GetRequest(requestDTO);
		
	}
	@GetMapping("/getinquiry")
	public List<InquiryDTO> GetAdminInquiry(){
		System.out.println("GetAdminInquiry located");
		return service.GetAdminInquiry();
	}
	@GetMapping("/getrequest")
	public List<InquiryDTO> GetAdminRequest(){
		System.out.println("GetAdminRequest located");
		return service.GetAdminRequest();
	}
	@PostMapping("/approveinquiry")
	public String GetInquiryApprove(@RequestBody InquiryDTO inquiry) {
		if (service.checkCmp(inquiry.getInqu_compName()) == 0) {
			CompanyDTO newComp = new CompanyDTO();
			newComp.setComp_name(inquiry.getInqu_compName());
			newComp.setComp_industry(inquiry.getInqu_compType());
			newComp.setComp_requester(inquiry.getInqu_writer());
			newComp.setComp_email(inquiry.getInqu_email());
			newComp.setComp_phone(inquiry.getInqu_phone());
			newComp.setComp_headcount(inquiry.getInqu_numberOfPeople());
			service.isnertAdminComp(newComp);
			Long compNo = service.getCompNo(newComp.getComp_name());
			EmployeeDTO newAdmin = new EmployeeDTO();
			newAdmin.setEmp_comp_no(compNo);
			newAdmin.setEmp_dept_no((long) 1);
			newAdmin.setEmp_posi_no((long) 1);
			newAdmin.setEmp_code(newComp.getComp_name());
			String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	        int length = 8; // 생성할 문자열의 길이
	        StringBuilder randomString = new StringBuilder(length);
	        Random random = new Random();

	        for (int i = 0; i < length; i++) {
	            int index = random.nextInt(characters.length());
	            randomString.append(characters.charAt(index));
	        }

	        System.out.println("Generated Random String: " + randomString.toString());
			String encodedPassword = passwordEncoder.encode(randomString.toString());
			newAdmin.setEmp_pw(encodedPassword);
			newAdmin.setEmp_name(newComp.getComp_name());
			newAdmin.setEmp_email(inquiry.getInqu_email());
			newAdmin.setEmp_phone(inquiry.getInqu_phone());
			newAdmin.setEmp_sign(newComp.getComp_name()+"관리자");
			newAdmin.setEmp_profile("관리자");
			newAdmin.setEmp_role("admin");
			service.insertNewAdmin(newAdmin);
			service.updateInquiry(inquiry.getInqu_no());
			String email = inquiry.getInqu_email();
			String id = inquiry.getInqu_compName();
			String rowpw = randomString.toString();
			sendMail(email,id,rowpw);
			return "approve success";
		}
		else {
			System.out.println("GetInquiryApprove ended");
			return "approve fail";
		}
	}
	@Autowired
	private JavaMailSender sender;
	
    public String sendMail(String email,String id,String rowpw){
   
		 
		 
		 String setFrom = "alsehdns@naver.com";
			String toMail = email;
			String title = "Paperless의 가입을 진심으로 축하드립니다.";
			String content = "Paperless 가입을 진심으로 축하드립니다." +
							"<br>" +
							"본 메일은 가입 승인을 안내드리며 초기 설정된 아이디와 비밀번호를 안내드립니다" +
							"<br><br>" +
							"아이디 : " + id +
							"<br>" +
							"비밀번호 : " + rowpw + " 입니다." +
							"<br>" +
							"보안을 위해 반드시 비밀번호를 변경해 주세요.";
			
			try {
				
				MimeMessage message = sender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
				helper.setFrom(setFrom);
				helper.setTo(toMail);
				helper.setSubject(title);
				helper.setText(content, true);
				sender.send(message);
				
			} catch (AddressException e) {
	            
	            return "잘못된 이메일 주소입니다.";
	        } catch (MessagingException e) {
	            
	            return "메일 전송에 실패했습니다.";
	        } catch (Exception e) {
	            
	            return "오류가 발생했습니다.";
	        }
			System.out.println();
					String num = rowpw;
       return num;		// 실제 보내기
  
}
}
