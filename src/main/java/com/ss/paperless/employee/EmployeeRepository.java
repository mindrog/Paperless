package com.ss.paperless.employee;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Integer>{
	Boolean existsByEmpCode(String empCode); // emp_code에 맞게 수정
    
	//찬양 email에서 employee 정보 가져오기
	EmployeeEntity findByEmpEmail(String empEmail);
    EmployeeEntity findByEmpCode(String empCode);
}
