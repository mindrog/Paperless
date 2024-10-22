package com.ss.paperless;

import java.lang.ProcessBuilder.Redirect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.EmployeeService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class MainController {
	@Autowired
	EmployeeService service;
	@Value("${kakao-API-key}")
	private String kakao;
	
	
	@PostMapping("/login")
	public EmployeeDTO Login(@RequestBody  EmployeeDTO loginEmp) {
		EmployeeDTO nowEmp = service.EmployeeLogin(loginEmp);
		
		if(nowEmp == null) {
			System.out.println("mapper 연결 성공");
			
		}else {
			System.out.println(nowEmp);
		}
		
		System.out.println("로그인 실행");
		
		return loginEmp;
	}
}
