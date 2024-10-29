package com.ss.paperless.inquiry;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class InquiryDTO {
	private int inqu_no; //문의 식별 번
	@JsonProperty("inqu_compName")
	private String inqu_compName;
	@JsonProperty("inqu_compType")
    private String inqu_compType;
	@JsonProperty("inqu_writer")
    private String inqu_writer;
	@JsonProperty("inqu_email")
    private String inqu_email;
	@JsonProperty("inqu_phone")
    private String inqu_phone;
	@JsonProperty("inqu_numberOfPeople")
    private String inqu_numberOfPeople;
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
	@JsonProperty("inqu_enroll")
	private LocalDateTime inqu_enroll; //등록일
}
