package com.ss.paperless.employee;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmployeeMapper {
	public EmployeeDTO EmployeeLogin(EmployeeDTO employee);

	public EmployeeDTO EmployeeById(String username);

	public int existsByUsername(String username);

	public EmployeeDTO getEmpInfo(String emp_code);

	public String getUserPosi(String emp_code);

	public int updateEmp(Long id);

	List<EmployeeDTO> getEmpDepartMenuList(int compNo);

	int getEmpCompNo(String empCode);
}
