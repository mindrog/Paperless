package com.ss.paperless.employee;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PutMapping("/emp/updateEmp/{id}")
    public ResponseEntity<String> updateEmployee(@PathVariable Long id) {
        log.info("Updating employee with id: " + id);

        // SecurityContext에서 사용자 정보 확인
        String emp_code = SecurityContextHolder.getContext().getAuthentication().getName();

        // 사용자 권한 확인 로직 추가 가능 (예: 관리자만 접근 가능하도록)
        log.info("User with emp_code: {} is updating employee with ID: {}", emp_code, id);

        // 직원 정보 업데이트
        int res = employeeService.updateEmp(id);

        if(res == 1) {
            log.info("Employee with id: " + id + " 업데이트 성공");
        } else {
            log.info("Employee with id: " + id + " 업데이트 실패");
        }

        return ResponseEntity.ok("Employee with ID " + id + " updated successfully.");
    }

    @PostMapping("/getMenuList")
    public List<EmployeeDTO> getMenuList() {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);
        int emp_comp_no = employeeService.getEmpCompNo(emp_code);
        List<EmployeeDTO> menulist = employeeService.getEmpMenuList(emp_comp_no);


        // 부서별로 데이터를 그룹화
        Map<String, DepartmentDTO> departMap = new HashMap<String, DepartmentDTO>();

//        for (EmployeeDTO emp : menulist) {
//            String department = emp.getEmp_dept_no();
//        }



        return menulist;
    }

}
