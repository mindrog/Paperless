package com.ss.paperless.employee;

import com.ss.paperless.employee.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long>{
    Boolean existsByEmpCode(String empCode); // emp_code에 맞게 수정
    
    //찬양 email에서 employee 정보 가져오기
    EmployeeEntity findByEmpEmail(String empEmail);
    EmployeeEntity findByEmpCode(String empCode);
    
    EmployeeEntity findByEmpNo(Long empNo);

    // 민경 - emp_no만 리턴
    @Query("SELECT e.empNo FROM EmployeeEntity e WHERE e.empCode = :empCode")
    int findEmpNoByEmpCode(String empCode);
}

