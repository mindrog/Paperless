package com.ss.paperless.todolist;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TodolistDTO {
	private Long todo_no;
	private Long todo_emp_no;
	private String todo_content;
	private Timestamp todo_date;
	
	private String emp_code;
}
