package com.ss.paperless.schedule;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScheduleDTO {
	private int sche_no;
	private int sche_comp_no;
	private int sche_dept_no;
	private int sche_emp_no; //직원번호 (fk) 
	private String sche_title; //제목
	private String sche_color;
	@JsonFormat(pattern="yyyy-MM-dd")
	private LocalDate sche_start; //시작일
	@JsonFormat(pattern="yyyy-MM-dd")
	private LocalDate sche_end; //마침일
}
