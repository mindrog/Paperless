package com.ss.paperless.report;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReportDTO {
	private int repo_no; 
	private int repo_emp_no;// 작성자번호 (fk) 
	private String repo_title; //제목 
	private String repo_content; //내용
	private String repo_status; //보고서상태(임시저장, 저장, 상신, 상신취소 등)
	private String dept_code; //문서코드(승인 시 발급되는 문서번호)
	private LocalDateTime draft_date; //기안일
	private LocalDateTime submission_date; //상신일
	private LocalDateTime cancel_date;  //상신취소일
    
	private String drafter; //기안자 (writer 작성자)
	private String approver;//결재자
	private String reference; //참조자
	private String recipient; //수신자
}   
