package com.ss.paperless.employee;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class EmployeeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int emp_no; //식별번호 
	private String username; //아이디
	private String password; //비밀번호
	private String emp_email; //이메일
	private String emp_phone; //핸드폰 번호
	private String emp_sign; //서명
	private String emp_profile; //프로필사진
	private int emp_comp_no; //회사번호 (fk) 
	private int emp_dept_no; //부서번호 (fk) 
	private int emp_posi_no; //직급번호 (fk) 
	private String role; //20241023 추가
	private LocalDateTime emp_enroll_date; //등록일
	private LocalDateTime emp_join_date; //입사일
	private String emp_lastmsg; //마지막 수신 메세지
	private String emp_lastemailmsg; //마지막 이메일 메세지
}
