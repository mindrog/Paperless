package com.ss.paperless.email;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmailDTO {
	private Long emailNo;
	private String writerEmail; // 작성자 이메일
	private String recipientEmail; // 수신자 이메일
	private String ccEmail; // 참조자 이메일
	private String title; // 제목
	private String content; // 내용
	private String status; // 상태 (읽음, 안읽음)
	private String sendDate; // 전송 시간 
	
    private String writerName;
    private String writerDisplayInfo;
}
