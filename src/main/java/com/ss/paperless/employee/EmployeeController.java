package com.ss.paperless.employee;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @PostMapping("/infolist")
    public EmployeeDTO getInfoList() {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);

        EmployeeDTO InfoList = employeeService.getUserInfo(emp_code);
        System.out.println("InfoList : " + InfoList);
        return InfoList;
    }

    @PostMapping("/getMenuList")
    public Map<Object, List<EmployeeDTO>> getMenuList() {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);
        int emp_comp_no = employeeService.getEmpCompNo(emp_code);
        List<EmployeeDTO> menulist = employeeService.getEmpDepartMenuList(emp_comp_no);
        System.out.println("menulist : " + menulist);

        // 부서별로 데이터를 그룹화
        Map<Object, List<EmployeeDTO>> departmentGroupedMenu = menulist.stream()
                .collect(Collectors.groupingBy(EmployeeDTO::getDept_name));
        System.out.println("departmentGroupedMenu : " + departmentGroupedMenu);

        for (EmployeeDTO emp : menulist) {
            Long empNo = emp.getEmp_no();
            Long departNo = emp.getEmp_dept_no();       // 부서코드
            String departName = emp.getDept_name();     // 부서 이름
            String team = emp.getDept_team_name();      // 팀 이름
        }

        System.out.println("departmentGroupedMenu : " + departmentGroupedMenu);
        return departmentGroupedMenu;
    }

}
