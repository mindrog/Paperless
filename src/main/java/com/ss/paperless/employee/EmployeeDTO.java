package com.ss.paperless.employee;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data

public class EmployeeDTO {
	private Long emp_no;
    private String emp_code;
    private String emp_pw;
    private String emp_name;
    private String emp_email;
    private String emp_phone;
    private String emp_sign;
    private String emp_profile;
    private Long emp_comp_no;
    private String comp_name;

    @JsonProperty("dept_code")
    private Long dept_code;

    @JsonProperty("emp_dept_no")
    private Long emp_dept_no;
    private String dept_name;

    @JsonProperty("dept_team_name")
    private String dept_team_name;
    private Long emp_posi_no;
    private String posi_name;
    private Timestamp emp_enroll_date;
    private Timestamp emp_join_date;
    private String emp_lastmsg;
    private String emp_lastemailmsg;
    private String emp_role;

    // 결재 타입
    private int appr_delegate;

    // 전결 여부
    @JsonProperty("approvalType")
    private String approvalType;

    private Long deptCode;

    private int appr_order;

    @JsonProperty("team_name")
    private String team_name;

    @JsonProperty("teamName")
    private String teamName;

    private String deptName;
    private String type;
}