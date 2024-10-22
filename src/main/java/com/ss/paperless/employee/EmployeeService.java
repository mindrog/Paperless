package com.ss.paperless.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
	@Autowired 
	EmployeeMapper mapper;
	
	public EmployeeDTO EmployeeLogin(EmployeeDTO employee) {
		return mapper.EmployeeLogin(employee);
	}

}
