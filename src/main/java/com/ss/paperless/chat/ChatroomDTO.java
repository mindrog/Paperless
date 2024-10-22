package com.ss.paperless.chat;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChatroomDTO {
	private int room_no;				// 식별 번호
	private String room_participants;	// 참가자 (fk)
	private LocalDateTime room_date;	// 생성일
}
