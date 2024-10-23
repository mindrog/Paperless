package com.ss.paperless.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService implements UserDetailsService {
	@Autowired 
	EmployeeMapper mapper;
	
	public EmployeeDTO EmployeeLogin(EmployeeDTO employee) {
		return mapper.EmployeeLogin(employee);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		EmployeeDTO empData =  mapper.EmployeeById(username);
		
		if(empData != null) {
			return new CustomEmpDetails(empData);
		}
		return null;
	}

}
