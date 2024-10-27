package com.ss.paperless.employee;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmployeeMapper {
	public EmployeeDTO EmployeeLogin(EmployeeDTO employee);

	public EmployeeDTO EmployeeById(String username);

	public int existsByUsername(String username);

	public EmployeeDTO getEmpInfo(String emp_code);

	public String getUserPosi(String emp_code);

	
}
