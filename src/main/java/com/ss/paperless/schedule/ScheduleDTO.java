package com.ss.paperless.schedule;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScheduleDTO {
	private int sche_no;
	private int sche_emp_no; //직원번호 (fk) 
	private String sche_title; //제목
	private String sche_color; //색상
	private LocalDateTime start_time; //시작일
	private LocalDateTime end_time; //마침일
}
