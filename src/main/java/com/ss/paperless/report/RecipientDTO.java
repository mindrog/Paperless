package com.ss.paperless.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 수신자

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipientDTO {
    private int reci_no;
    private int reci_repo_no;
    private int reci_emp_no;
    private int reci_dept_no;
}
