package com.ss.paperless.employee;

import java.security.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminEmpGetVo {
	private int emp_no;
	private String emp_code;
	private String emp_name;
	private Timestamp emp_enroll_date;
	private String comp_name;
	private String comp_email;
	private String comp_phone;
	private int comp_headcount;
}
