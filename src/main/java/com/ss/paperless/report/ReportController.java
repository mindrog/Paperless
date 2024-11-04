package com.ss.paperless.report;

import com.ss.paperless.employee.entity.EmployeeEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.ss.paperless.employee.EmployeeDTO;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/getUserInfo")
    public ResponseEntity<EmployeeDTO> getUserInfo() {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);

        EmployeeEntity userInfo = reportService.getUserInfo(emp_code);

        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setEmp_code(userInfo.getEmpCode());
        employeeDTO.setEmp_name(userInfo.getEmpName());
        employeeDTO.setEmp_dept_no(userInfo.getEmpDeptNo());
        employeeDTO.setDept_name(userInfo.getDepartment().getDeptName());
        employeeDTO.setDept_team_name(userInfo.getDepartment().getDeptTeamName());

        System.out.println("ResponseEntity content: " + employeeDTO.toString());

        return ResponseEntity.ok(employeeDTO);
    }

    @PostMapping("/saveasdraft")
    public ResponseEntity<EmployeeDTO> saveAsDraftReport (@RequestBody ReportDTO reportDTO) {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("saveAsDraftReport - emp_code : " + emp_code);
        System.out.println("saveAsDraftReport - reportDTO : " + reportDTO);

        int res = reportService.AddSaveAsDraftReportData(reportDTO);

        return ResponseEntity.ok(new EmployeeDTO());
    }



}
