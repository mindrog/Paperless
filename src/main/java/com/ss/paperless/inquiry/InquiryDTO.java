package com.ss.paperless.inquiry;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class InquiryDTO {
	private int inqu_no; //문의 식별 번
	private String inqu_writer; //작성자
	private String inqu_content; //내용
	private String inqu_email; //이메일
	private String inqu_phone; //연락처
	private LocalDateTime inqu_enroll_date; //등록일
}
