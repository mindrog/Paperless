package com.ss.paperless.employee;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService implements UserDetailsService {
	private final EmployeeRepository employeeRepository;
	public EmployeeService(EmployeeRepository employeeRepository) {
		this.employeeRepository =employeeRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		EmployeeEntity userData = employeeRepository.findByUsername(username);

        if (userData != null) {
						
						//UserDetails에 담아서 return하면 AutneticationManager가 검증 함
            return new CustomUserDetails(userData);
        }

        return null;
    }
	

}
