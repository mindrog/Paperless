package com.ss.paperless.employee.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dept_no")
    private Long deptNo;  // 부서 번호 (Primary Key)

    @Column(name = "dept_name", nullable = false)
    private String deptName;  // 부서 이름

    @Column(name = "dept_team_name", nullable = false)
    private String deptTeamName;
}
