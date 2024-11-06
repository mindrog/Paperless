package com.ss.paperless.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// 수신자

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
}
