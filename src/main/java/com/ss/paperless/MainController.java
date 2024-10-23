package com.ss.paperless;

import java.lang.ProcessBuilder.Redirect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.EmployeeService;
import com.ss.paperless.employee.LoginDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class MainController {
	@Autowired
	EmployeeService service;
	@Value("${kakao-API-key}")
	private String kakao;

	@PostMapping(value = "/login", consumes = "application/json")
	public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {
        String username = loginRequest.getUsername();
        String empPw = loginRequest.getPassword();
        
        // 로그인 처리 로직
        return ResponseEntity.ok("로그인 성공");
    }
}
