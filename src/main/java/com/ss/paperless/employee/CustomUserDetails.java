package com.ss.paperless.employee;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails{
	private final EmployeeEntity employeeEntity;
	
	    public CustomUserDetails(EmployeeEntity employeeEntity) {
	        this.employeeEntity = employeeEntity;}
	    
	    
	
	    @Override
	    public Collection<? extends GrantedAuthority> getAuthorities() {

	        Collection<GrantedAuthority> collection = new ArrayList<>();

	        collection.add(new GrantedAuthority() {

	            @Override
	            public String getAuthority() {

	                return employeeEntity.getEmpRole();
	            }
	        });

	        return collection;
	    }

	    @Override
	    public String getPassword() {

	        return employeeEntity.getEmpPw();
	    }

	    @Override
	    public String getUsername() {

	        return employeeEntity.getEmpCode();
	    }

	    @Override
	    public boolean isAccountNonExpired() {

	        return true;
	    }

	    @Override
	    public boolean isAccountNonLocked() {

	        return true;
	    }

	    @Override
	    public boolean isCredentialsNonExpired() {

	        return true;
	    }

	    @Override
	    public boolean isEnabled() {

	        return true;
	    }
	}