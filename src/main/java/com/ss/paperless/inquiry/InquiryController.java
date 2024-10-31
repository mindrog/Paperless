package com.ss.paperless.inquiry;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
			String encodedPassword = passwordEncoder.encode("qwer1234");
			newAdmin.setEmp_pw(encodedPassword);
			newAdmin.setEmp_name(newComp.getComp_name());
			newAdmin.setEmp_email(inquiry.getInqu_email());
			newAdmin.setEmp_phone(inquiry.getInqu_phone());
			newAdmin.setEmp_sign(newComp.getComp_name()+"관리자");
			newAdmin.setEmp_profile("관리자");
			newAdmin.setEmp_role("admin");
			service.insertNewAdmin(newAdmin);
			service.updateInquiry(inquiry.getInqu_no());
			return "approve success";
		}
		else {
			System.out.println("GetInquiryApprove ended");
			return "approve fail";
		}
	}
}
