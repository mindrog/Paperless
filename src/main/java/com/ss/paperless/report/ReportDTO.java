package com.ss.paperless.report;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ss.paperless.attachment.AttachmentDTO;
import com.ss.paperless.employee.EmployeeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReportDTO {
	private int repo_no; 
	private int repo_emp_no;				// 작성자 번호 (fk)
	private String emp_code;				// 작성자 코드

	@JsonProperty("reportTitle")
	private String repo_title; 				// 제목

	@JsonProperty("reportContent")
	private String repo_content; 			// 내용

	@JsonProperty("reportStatus")
	private String repo_status; 			// 보고서상태(임시저장, 저장, 상신, 상신취소 등)
	private String repo_code; 				// 문서코드(승인 시 발급되는 문서번호)

	@JsonProperty("reportDate")
	@JsonFormat(pattern = "yyyy. MM. dd. a hh:mm", locale = "ko_KR")
	private String draft_date; 		// 기안일

	@JsonProperty("submission_date")

	private LocalDateTime submission_date; 	// 상신일
	private LocalDateTime cancel_date;  	// 상신 취소일
	private String cancel_content;			// 상신 취소 사유
	private String repo_type;				// 문서 타입
    
	private String writer; 					// 기안자

	@JsonProperty("selectedApprovers")
	private List<EmployeeDTO> approver;				// 결재자

	@JsonProperty("selectedReferences")
	private List<EmployeeDTO> reference; 				// 참조자

	@JsonProperty("selectedReceivers")
	private List<EmployeeDTO> recipient; 				// 수신자

	@JsonProperty("approvalType")
	private String approvalType;			// 전결 여부

	private int appr_order;					// 결재 순서

	// 업무
	private int work_repo_no;				// 업무 보고서 번호

	@JsonProperty("repoStartTime")
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate repo_start_time;	// 시행 일자

	@JsonProperty("repoEndTime")
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate repo_end_time;	// 마감 일자


	// 구매
	private int purch_repo_no;		// 구매 보고서 번호
	private int product_no;			// 품목 번호
	private String category;		// 품목 종류
	private String product_name; 	// 품목 명
	private String product_size; 	// 규격
	private int product_count; 		// 수량
	private int product_price; 		// 가격
	private int productPrices; 		// 총합
	private String productEtc; 		// 비고 내용

	// 근태
	private int atten_repo_no;		// 근태 보고서 번호
	private String vacation_type;	// 휴가 종료
	private LocalDate atten_start_date;	// 휴가 시작 일자
	private LocalDate atten_end_date;	// 휴가 마지막 일자

	// 첨부 파일
	private int atta_no;
	private String atta_key;
	private String atta_url;
	private String atta_original_name;
	private int atta_size;

	// 첨부 파일 목록
	private List<MultipartFile> files; // 첨부파일 리스트

}   
