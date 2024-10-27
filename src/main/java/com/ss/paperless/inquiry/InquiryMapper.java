package com.ss.paperless.inquiry;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InquiryMapper {

	public int GetInquiry(InquiryDTO inquiryDTO);

	public int GetRequest(RequestDTO requestDTO);

}
