package com.ss.paperless.employee;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name= "Employee")
public class EmployeeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int empNo; // 식별번호 
    private String empCode; // 아이디 (emp_code에서 변경)
    private String empPw; // 비밀번호
    private String empName;
    private String empEmail; // 이메일
    private String empPhone; // 핸드폰 번호
    private String empSign; // 서명
    private String empProfile; // 프로필사진
    private int empCompNo; // 회사번호 (fk) 
    private int empDeptNo; // 부서번호 (fk) 
    private int empPosiNo; // 직급번호 (fk) 
    private String empRole; // 20241023 추가
    private LocalDateTime empEnrollDate; // 등록일
    private LocalDateTime empJoinDate; // 입사일
    private String empLastMsg; // 마지막 수신 메세지
    private String empLastEmailMsg;
}
