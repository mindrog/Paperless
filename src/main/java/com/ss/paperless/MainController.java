package com.ss.paperless;

import java.lang.ProcessBuilder.Redirect;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ss.paperless.employee.AdminEmpGetVo;
import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.EmployeeService;
import com.ss.paperless.employee.LoginDTO;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class MainController {

	@Autowired
	EmployeeService empService;

	@GetMapping("/name") 
	public String CompanyUser(){
		System.out.println("CompanyUser located ...");
		if(SecurityContextHolder.getContext() != null) {
		String name =  SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println("nowmem : " + name);
		return name;}
		else {
			System.out.println("SecurityContextHolder null" );
			return "null";
		}
	}
	@GetMapping("/userinfo")
	public EmployeeDTO GetUserInfo() {
		System.out.println("userinfo locate...");
		String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
		empService.getEmpInfo(emp_code);
		EmployeeDTO nowmem = empService.getEmpInfo(emp_code);;
		System.out.println("nowmem : " + nowmem);
		return nowmem;
	}
    
	@GetMapping("/userposi")
	public String GetUserPosi() {
		String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
		String emp_row_posi = empService.getUserPosi(emp_code);
		System.out.println(emp_row_posi);
		return emp_row_posi;
	} 
	@GetMapping("/getadminusers")
	public List<AdminEmpGetVo> GetAdminUsers() {
		List<AdminEmpGetVo> adminMembers = empService.GetAdminUsers();
		System.out.println("admin : " + adminMembers);
		return adminMembers;
	}
}
