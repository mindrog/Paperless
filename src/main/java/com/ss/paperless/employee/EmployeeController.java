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

    @GetMapping("/infolist")
    public EmployeeDTO getInfoList() {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);

        EmployeeDTO InfoList = employeeService.getUserInfo(emp_code);
        System.out.println("InfoList : " + InfoList);
        return InfoList;
    }

    @PostMapping("/getMenuList")
    public Map<String, Map<String, Object>> getMenuList() {
        String emp_code = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);
        int emp_comp_no = employeeService.getEmpCompNo(emp_code);
        List<EmployeeDTO> menulist = employeeService.getEmpDepartMenuList(emp_comp_no);
        System.out.println("menulist : " + menulist);

        // 부서별로 데이터를 그룹화하고 각 그룹에 dept_code를 포함
        Map<String, Map<String, Object>> departmentGroupedMenu = menulist.stream()
                .collect(Collectors.groupingBy(
                        EmployeeDTO::getDept_name, // 부서 이름으로 그룹화
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                employees -> {
                                    Map<String, Object> result = new HashMap<>();
                                    result.put("dept_code", employees.get(0).getEmp_dept_no()); // 부서 코드 추가
                                    result.put("employees", employees); // 직원 목록 추가
                                    return result;
                                }
                        )
                ));

        System.out.println("departmentGroupedMenu with dept_code : " + departmentGroupedMenu);
        return departmentGroupedMenu;
    }

    @GetMapping("/getdeptnamelist")
    public List<String> GetDeptNamelist(){
    	
    	return employeeService.GetDeptNamelist();
    	
    }
    @GetMapping("/getteamname")
    public List<String> GetTeamNameList(@RequestParam String dept_name){
    	return employeeService.GetTeamNameList(dept_name);
    }


}
