package com.ss.paperless.employee;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomEmpDetails implements UserDetails{
	private final EmployeeDTO employeeDTO;
	
	public CustomEmpDetails(EmployeeDTO employeeDTO) {
		this.employeeDTO = employeeDTO;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collection = new ArrayList<>();
		collection.add(new GrantedAuthority() {
			
			@Override
			public String getAuthority() {
				
				return employeeDTO.getEmp_role();
			}
		});
		return null;
	}

	@Override
	public String getPassword() {
		return employeeDTO.getEmp_pw();
		
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return employeeDTO.getEmp_id();
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

}
