package com.ss.paperless.inquiry;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ss.paperless.company.CompanyDTO;
import com.ss.paperless.employee.EmployeeDTO;

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
	public List<InquiryDTO> GetAdminInquiry() {
		// TODO Auto-generated method stub
		return mapper.GetAdminInquiry();
	}
	public List<InquiryDTO> GetAdminRequest() {
		// TODO Auto-generated method stub
		return mapper.GetAdminRequest();
	}
	public int checkCmp(String inqu_compName) {
		// TODO Auto-generated method stub
		return mapper.checkCmp(inqu_compName);
	}
	public int isnertAdminComp(CompanyDTO newComp) {
		// TODO Auto-generated method stub
		return mapper.isnertAdminComp(newComp);
	}
	public Long getCompNo(String comp_name) {
		// TODO Auto-generated method stub
		return mapper.getCompNo(comp_name);
	}
	public int insertNewAdmin(EmployeeDTO newAdmin) {
		// TODO Auto-generated method stub
		return mapper.insertNewAdmin(newAdmin);
		
	}
	public int updateInquiry(int inqu_no) {
		// TODO Auto-generated method stub
		return mapper.updateInquiry(inqu_no);
	}

}
