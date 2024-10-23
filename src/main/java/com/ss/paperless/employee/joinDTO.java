package com.ss.paperless.employee;



import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class joinDTO {
	private String username;
    private String password;
    private String email;
    private String phone;
    private String sign;
    private String profile;
    private int comp_no;
    private int dept_no;
    private int posi_no;
    private Timestamp join_date;
    private String role;
}
/*
 * `emp_no` BIGINT NOT NULL AUTO_INCREMENT,
	`emp_code` varchar(100) NOT NULL,
	`emp_id` varchar(100) NOT NULL,
	`emp_pw` varchar(100) NOT NULL,
	`emp_email` varchar(300) NOT NULL,
	`emp_phone` varchar(100) NOT NULL,
	`emp_sign` varchar(100) NULL,
	`emp_profile` varchar(300) NULL,
	`emp_comp_no` BIGINT NOT NULL COMMENT 'comp_no',
	`emp_dept_no` BIGINT NOT NULL COMMENT 'dept_no',
	`emp_posi_no` BIGINT NOT NULL COMMENT 'posi_no',
	`emp_enroll_date` TIMESTAMP NOT NULL DEFAULT NOW(),
	`emp_join_date` TIMESTAMP NOT NULL,
	`emp_lastmsg` varchar(100) NULL,
	`emp_lastemailmsg` varchar(100) NULL,
	`emp_role`
 * */
