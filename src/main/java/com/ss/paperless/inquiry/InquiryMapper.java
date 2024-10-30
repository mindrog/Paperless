package com.ss.paperless.inquiry;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InquiryMapper {

	public int GetInquiry(InquiryDTO inquiryDTO);

	public int GetRequest(RequestDTO requestDTO);

	public List<InquiryDTO> GetAdminInquiry();

	public List<InquiryDTO> GetAdminRequest();

	public int checkCmp(String inqu_compName);

}
