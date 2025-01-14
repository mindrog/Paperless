package com.ss.paperless.employee;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ss.paperless.employee.entity.EmployeeEntity;

import java.io.IOException;
import java.util.Date;
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
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/infolist")
    public EmployeeDTO getInfoList() {
        String emp_code = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);

        EmployeeDTO InfoList = employeeService.getUserInfo(emp_code);
        System.out.println("InfoList : " + InfoList);
        return InfoList;
    }

    @GetMapping("getdept/{dept_no}")
    public DepartmentDTO getDepartment(@PathVariable int dept_no) {
        return employeeService.getDepartmentByNo(dept_no);
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
                .collect(Collectors.groupingBy(EmployeeDTO::getDept_name, // 부서 이름으로 그룹화
                        Collectors.collectingAndThen(Collectors.toList(), employees -> {
                            Map<String, Object> result = new HashMap<>();
                            result.put("dept_code", employees.get(0).getEmp_dept_no()); // 부서 코드 추가
                            result.put("employees", employees); // 직원 목록 추가
                            return result;
                        })));

        System.out.println("departmentGroupedMenu with dept_code : " + departmentGroupedMenu);
        return departmentGroupedMenu;
    }

    @GetMapping("/getdeptnamelist")
    public List<String> GetDeptNamelist() {
        return employeeService.GetDeptNamelist();
    }

    @GetMapping("/getteamname")
    public List<String> GetTeamNameList(@RequestParam String dept_name) {
        return employeeService.GetTeamNameList(dept_name);
    }

    @GetMapping("/getdeptno")
    public int GetDeptNo(@RequestParam String dept_name, @RequestParam String dept_team_name) {
        return employeeService.GetDeptNo(dept_name, dept_team_name);
    }

    @GetMapping("/getposi")
    public List<PositionDTO> GetPosition() {
        return employeeService.GetPosition();
    }

    @PostMapping("/userinsert")
    public int userInsert(@RequestBody EmployeeDTO emp) {
        System.out.println("userinsert located...");
        System.out.println(emp);
        String encodedPW = passwordEncoder.encode(emp.getEmp_pw());
        emp.setEmp_pw(encodedPW);
        emp.setEmp_role("user");
        emp.setEmp_sign(emp.getEmp_name() + " 서명");
        emp.setEmp_profile("https://via.placeholder.com/60");
        emp.setDept_name(employeeService.GetDeptName(emp.getEmp_dept_no()));
        emp.setPosi_name(employeeService.GetPosiName(emp.getEmp_posi_no()));
        emp.setDept_team_name(employeeService.GetDeptTeamName(emp.getEmp_dept_no()));
        System.out.println(emp);
        return employeeService.userInsert(emp);
    }

    @PostMapping("/useredit")
    public int userEdit(@RequestBody EmployeeDTO emp) {
        System.out.println("edit emp : " + emp);
        String encodedPW = passwordEncoder.encode(emp.getEmp_pw());
        emp.setEmp_pw(encodedPW);
        return employeeService.userEdit(emp);
    }

    @GetMapping("/getemps")
    public List<EmployeeDTO> getEmps(@RequestParam Long emp_comp_no) {
        List<EmployeeDTO> returnList = employeeService.getEmps(emp_comp_no);
        for (int i = 0; i < returnList.size(); i++) {
            returnList.get(i).setDept_name(employeeService.GetDeptName(returnList.get(i).getEmp_dept_no()));
            returnList.get(i).setPosi_name(employeeService.GetPosiName(returnList.get(i).getEmp_posi_no()));
            returnList.get(i).setDept_team_name(employeeService.GetDeptTeamName(returnList.get(i).getEmp_dept_no()));
        }
        return returnList;
    }

    @GetMapping("/getdeptdata")
    public List<String> GetDeptData(@RequestParam int dept_no) {
        return employeeService.GetDeptData(dept_no);
    }

    @PostMapping("/deleteemployees")
    public int DeleteEmp(@RequestBody List<Long> emp_no) {
        for (int i = 0; i < emp_no.size(); i++) {
            employeeService.DeleteEmp(emp_no.get(i));
        }
        return 1;
    }

    @GetMapping("/empsearch")
    public List<EmployeeDTO> EmpSearch(@RequestParam String category, @RequestParam String query,@RequestParam int comp_no) {
        switch (category) {
            case "name":
                List<EmployeeDTO> returnList = employeeService.empNameSearch(query,comp_no);
                for (int i = 0; i < returnList.size(); i++) {
                    returnList.get(i).setDept_name(employeeService.GetDeptName(returnList.get(i).getEmp_dept_no()));
                    returnList.get(i).setPosi_name(employeeService.GetPosiName(returnList.get(i).getEmp_posi_no()));
                    returnList.get(i).setDept_team_name(employeeService.GetDeptTeamName(returnList.get(i).getEmp_dept_no()));
                }
                return returnList;
            case "email":
                List<EmployeeDTO> returnEmailList = employeeService.empEmailSearch(query,comp_no);
                for (int i = 0; i < returnEmailList.size(); i++) {
                    returnEmailList.get(i).setDept_name(employeeService.GetDeptName(returnEmailList.get(i).getEmp_dept_no()));
                    returnEmailList.get(i).setPosi_name(employeeService.GetPosiName(returnEmailList.get(i).getEmp_posi_no()));
                    returnEmailList.get(i).setDept_team_name(employeeService.GetDeptTeamName(returnEmailList.get(i).getEmp_dept_no()));
                }
                return returnEmailList;
            case "department":
                List<EmployeeDTO> returnDeptList = employeeService.empDeptSearch(query,comp_no);
                for (int i = 0; i < returnDeptList.size(); i++) {
                    returnDeptList.get(i).setDept_name(employeeService.GetDeptName(returnDeptList.get(i).getEmp_dept_no()));
                    returnDeptList.get(i).setPosi_name(employeeService.GetPosiName(returnDeptList.get(i).getEmp_posi_no()));
                    returnDeptList.get(i).setDept_team_name(employeeService.GetDeptTeamName(returnDeptList.get(i).getEmp_dept_no()));
                }
                return returnDeptList;
            case "position":
                List<EmployeeDTO> returnPosiList = employeeService.empPosiSearch(query,comp_no);
                for (int i = 0; i < returnPosiList.size(); i++) {
                    returnPosiList.get(i).setDept_name(employeeService.GetDeptName(returnPosiList.get(i).getEmp_dept_no()));
                    returnPosiList.get(i).setPosi_name(employeeService.GetPosiName(returnPosiList.get(i).getEmp_posi_no()));
                    returnPosiList.get(i).setDept_team_name(employeeService.GetDeptTeamName(returnPosiList.get(i).getEmp_dept_no()));
                }
                return returnPosiList;
            default:
                return null;
        }
    }

    @PostMapping("/employees/{id}/uploadProfileImage")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("profileImage") MultipartFile file) {
        log.info("Uploading profile image for employee with id: " + id);

        // 현재 인증된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String empCode = authentication.getName();
        log.info("Authenticated user emp_code: " + empCode);

        try {
            // 직원 번호 확인 (현재 인증된 사용자가 수정하려는 직원인지 확인)
            Long empNo = employeeService.getEmpNoByEmpCode(empCode);
            if (!empNo.equals(id)) {
                return ResponseEntity.status(403).body("Forbidden: You can only update your own profile image.");
            }

            // 프로필 이미지 업로드 및 URL 반환
            String imageUrl = employeeService.uploadProfileImage(id, file);

            // 응답 데이터
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Error: " + e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IOException e) {
            log.error("IOException: " + e.getMessage());
            return ResponseEntity.status(500).body("Error uploading profile image.");
        }
    }
    
    @PutMapping("/employees/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody PasswordChangeRequest passwordChangeRequest) {

        // 현재 인증된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String empCode = authentication.getName();

        // 인증된 사용자의 직원 번호 가져오기
        Long authenticatedEmpNo = employeeService.getEmpNoByEmpCode(empCode);

        // 본인 확인
        if (!authenticatedEmpNo.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("자신의 비밀번호만 변경할 수 있습니다.");
        }

        try {
            // 직원 정보 가져오기
            EmployeeEntity employee = employeeService.findByEmpNo(id);

            // 현재 비밀번호 검증
            if (!passwordEncoder.matches(passwordChangeRequest.getCurrentPassword(), employee.getEmpPw())) {
                throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
            }

            // 새 비밀번호 암호화
            String encodedNewPassword = passwordEncoder.encode(passwordChangeRequest.getNewPassword());

            // 비밀번호 변경
            employeeService.changePassword(id, encodedNewPassword);

            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PutMapping("/employees/{id}/phone")
    public ResponseEntity<?> changePhoneNumber(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        // 현재 인증된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String empCode = authentication.getName();

        // 인증된 사용자의 직원 번호 가져오기
        Long authenticatedEmpNo = employeeService.getEmpNoByEmpCode(empCode);

        // 본인 확인
        if (!authenticatedEmpNo.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("자신의 전화번호만 변경할 수 있습니다.");
        }

        String newPhoneNumber = request.get("phone");
        if (newPhoneNumber == null || newPhoneNumber.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("새로운 전화번호를 입력해주세요.");
        }

        try {
            employeeService.changePhoneNumber(id, newPhoneNumber);
            return ResponseEntity.ok("전화번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
   
   
        
}
