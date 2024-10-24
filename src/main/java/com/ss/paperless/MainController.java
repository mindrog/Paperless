package com.ss.paperless;

import java.lang.ProcessBuilder.Redirect;

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

import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.EmployeeService;
import com.ss.paperless.employee.LoginDTO;

@CrossOrigin(origins = "http://localhost:3000")
@ResponseBody
public class MainController {
	
	@GetMapping("/company/user/name") 
	public String CompanyUser(){
		System.out.println("CompanyUser located ...");
		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println("nowmem : " + name);
		return name;
	}
    
	
	
}
