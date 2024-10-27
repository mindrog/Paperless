package com.ss.paperless.inquiry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
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
}
