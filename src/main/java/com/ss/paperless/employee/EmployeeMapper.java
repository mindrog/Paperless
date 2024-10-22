package com.ss.paperless.employee;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmployeeMapper {
	public EmployeeDTO EmployeeLogin(EmployeeDTO employee);
}
