package com.ss.paperless.chat;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChatDTO {
	private int	chat_no;								// 식별 번호
	private int chat_room_no;							// 채팅방 번호
	private int chat_sender;							// 보낸 사람
	private int chat_recipient;							// 받는 사람 (null 이면 그룹 채팅, 아니면 일대일 채팅이라는 의미)
	private String chat_content;						// 채팅 내용
	private String chat_type;							// 분류
	private int chat_count;								// 수신자 수
	@DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
	private LocalDateTime chat_send_date;				// 전송 시간
}
