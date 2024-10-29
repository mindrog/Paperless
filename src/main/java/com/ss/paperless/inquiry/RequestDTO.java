package com.ss.paperless.inquiry;

import java.security.Timestamp;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RequestDTO {
	private int requ_no;
	@JsonProperty("requ_title")
	private String requ_title;
	@JsonProperty("requ_writer")
	private String requ_writer;
	@JsonProperty("requ_phone")
	private String requ_phone;
	@JsonProperty("requ_email")
	private String requ_email;
	@JsonProperty("requ_contents")
	private String requ_contents;
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
	@JsonProperty("requ_enroll")
	private LocalDateTime requ_enroll;
}
