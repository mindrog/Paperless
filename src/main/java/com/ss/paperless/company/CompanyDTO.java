package com.ss.paperless.company;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CompanyDTO {
	private int comp_no; //회사 번호
	private String comp_name; //회사명
	private String comp_industry; //업종
	private String comp_requester; //신청자
	private String comp_email; //이메일
	private String comp_phone; //전화번호 (또는 담당자 번호)
	private int comp_headcount; //인원 수
}
