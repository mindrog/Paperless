package com.ss.paperless.report;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproverDTO {

    private int emp_no;
    private int appr_no;
    private int appr_repo_no;
    private int appr_emp_no;
    private int appr_order;
    private String appr_status;
    private int appr_delegate;
    private int appr_is_read;
    private LocalDate appr_date; // 결재 날짜 추가

    @JsonProperty("approvalType")
    private String approval_type;    // 결재 유형(전결, 결재 등)

    // Employee 관련 정보
    private String emp_code;
    private String emp_name;
    private int emp_dept_no;
    private String dept_name;
    private String dept_team_name;
    private int emp_posi_no;
    private String posi_name;
    private String emp_role; // 역할 정보가 문자열일 경우 int 대신 String으로 사용
}
