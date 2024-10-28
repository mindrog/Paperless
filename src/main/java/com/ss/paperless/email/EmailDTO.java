package com.ss.paperless.email;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmailDTO {
	private int email_no;
	private String email_writer; //작성자 (fk)
	private String email_title;
	private String email_content; //내용
	private String email_recipient; //수신자 (fk)
	private String email_status; //상태 (읽음, 안읽음)
	private String email_send_date; //전송시간
}
