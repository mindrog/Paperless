package com.ss.paperless.inquiry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InquiryService {
	@Autowired
	InquiryMapper mapper;
	public int GetInquiry(InquiryDTO inquiryDTO) {
		 return mapper.GetInquiry(inquiryDTO);
		
	}
	public int GetRequest(RequestDTO requestDTO) {
		// TODO Auto-generated method stub
		return mapper.GetRequest(requestDTO);
	}

}
