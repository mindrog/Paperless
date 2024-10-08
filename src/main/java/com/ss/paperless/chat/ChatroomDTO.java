package com.ss.paperless.chat;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChatroomDTO {
	private int room_no;
	private String room_recipient;// 수신자 (fk)
	private LocalDateTime room_date;// 생성일
}
