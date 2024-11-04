package com.ss.paperless.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 참조자

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReferenceDTO {
    private int refe_no;
    private int refe_repo_no;
    private int refe_emp_no;
    private int refe_dept_no;
}
