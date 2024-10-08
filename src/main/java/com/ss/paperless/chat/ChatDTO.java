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
	int	chat_no;
	int chat_room_no;
	String chat_writer;
	String chat_content;
	@DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
	LocalDateTime chat_send_date;
}
