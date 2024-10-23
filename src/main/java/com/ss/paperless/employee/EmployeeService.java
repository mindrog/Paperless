package com.ss.paperless.employee;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService implements UserDetailsService {
	private final EmployeeRepository employeeRepository;

	public EmployeeService(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String empCode) throws UsernameNotFoundException {
	    EmployeeEntity userData = employeeRepository.findByEmpCode(empCode);
	    
	    if (userData == null) {
	        throw new UsernameNotFoundException("User not found with emp_code: " + empCode);
	    }

	    // UserDetails에 담아서 return하면 AuthenticationManager가 검증함
	    System.out.println(userData);
	    return new CustomUserDetails(userData);
	}

}
