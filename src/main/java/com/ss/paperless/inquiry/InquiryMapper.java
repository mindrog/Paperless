package com.ss.paperless.inquiry;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ss.paperless.company.CompanyDTO;
import com.ss.paperless.employee.EmployeeDTO;

@Mapper
public interface InquiryMapper {

	public int GetInquiry(InquiryDTO inquiryDTO);

	public int GetRequest(RequestDTO requestDTO);

	public List<InquiryDTO> GetAdminInquiry();

	public List<InquiryDTO> GetAdminRequest();

	public int checkCmp(String inqu_compName);

	public int isnertAdminComp(CompanyDTO newComp);

	public Long getCompNo(String comp_name);

	public int insertNewAdmin(EmployeeDTO newAdmin);

	public int updateInquiry(int inqu_no);

	

}
