package com.ss.paperless.employee.entity;

import java.sql.Timestamp;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name= "Employee")
public class EmployeeEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT에 해당
    @Column(name = "emp_no")
    private Long empNo;

    @Column(name = "emp_code", nullable = false)
    private String empCode;

    @Column(name = "emp_pw", nullable = false)
    private String empPw;

    @Column(name = "emp_name", nullable = false)
    private String empName;

    @Column(name = "emp_email", nullable = false)
    private String empEmail;

    @Column(name = "emp_phone", nullable = false)
    private String empPhone;

    @Column(name = "emp_sign")
    private String empSign;

    @Column(name = "emp_profile")
    private String empProfile;

    @Column(name = "emp_comp_no", nullable = false)
    private Long empCompNo;

    @Column(name = "emp_dept_no", nullable = false)
    private Long empDeptNo;

    @ManyToOne
    @JoinColumn(name = "emp_dept_no", insertable = false, updatable = false)
    private DepartmentEntity department;

    @ManyToOne
    @JoinColumn(name = "emp_posi_no", insertable = false, updatable = false)
    private PositionEntity position;

    @Column(name = "emp_posi_no", nullable = false)
    private Long empPosiNo;

    @Column(name = "emp_enroll_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp empEnrollDate;

    @Column(name = "emp_join_date", nullable = false)
    private Timestamp empJoinDate;

    @Column(name = "emp_role", nullable = false, columnDefinition = "VARCHAR(100) DEFAULT 'user'")
    private String empRole;
    //('admin2', '$2a$10$Miv1rC.Z5l1z4UREbKskx.Y3rgd/r5cWKD5csJWjCCQvt8ukQp5cC', '김성현', 'kim@digitalsolution.com', '010-1234-5678', '김성현 서명', 'https://via.placeholder.com/60', 1, 210, 7, '2019-11-01', 'admin'),
}
