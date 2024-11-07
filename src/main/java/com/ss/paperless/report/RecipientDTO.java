package com.ss.paperless.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipientDTO {
    private int reci_no;
    private int reci_repo_no;
    private int reci_emp_no;
    private int reci_dept_no;
    private int reci_is_read;
    private LocalDate reci_date;

    // Employee 관련 정보
    private String emp_code;
    private String emp_name;
    private int emp_dept_no;
    private String dept_name;
    private String dept_team_name;
    private int emp_posi_no;
    private String posi_name;
    private String emp_role;
}

