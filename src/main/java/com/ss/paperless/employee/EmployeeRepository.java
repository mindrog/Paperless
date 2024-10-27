package com.ss.paperless.employee;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Integer>{
	Boolean existsByEmpCode(String empCode); // emp_code에 맞게 수정
    
    // emp_code로 직원 조회
    EmployeeEntity findByEmpCode(String empCode);
    
    // emp_Email로 이메일 조회
    EmployeeEntity findByEmpEmail(String empEmail);
	
}
