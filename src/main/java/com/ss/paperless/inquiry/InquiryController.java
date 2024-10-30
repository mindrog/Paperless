package com.ss.paperless.inquiry;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@ResponseBody
@RequestMapping("/api")
public class InquiryController {
	@Autowired
	InquiryService service;
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
	public int GetInquiryApprove(@RequestBody InquiryDTO inquiry) {
		if (service.checkCmp(inquiry.getInqu_compName()) == 0) {
			System.out.println("GetInquiryApprove started result ==" + service.checkCmp(inquiry.getInqu_compName()));
			
			return 0;
		}
		else {
			System.out.println("GetInquiryApprove ended");
			return 1;
		}
	}
}
