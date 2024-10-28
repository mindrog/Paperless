package com.ss.paperless.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DepartmentDTO {
    private int dept_no;
    private String dept_name;
    private String dept_team_name;
}
