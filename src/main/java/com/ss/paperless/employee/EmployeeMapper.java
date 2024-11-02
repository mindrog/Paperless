package com.ss.paperless.employee;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ss.paperless.company.CompanyDTO;

import java.util.List;
import java.util.Map;

@Mapper
public interface EmployeeMapper {
	public EmployeeDTO EmployeeLogin(EmployeeDTO employee);

	public EmployeeDTO EmployeeById(String username);

	public int existsByUsername(String username);

	public EmployeeDTO getEmpInfo(String emp_code);

	public String getUserPosi(String emp_code);

	public int updateEmp(Long id);


	public List<CompanyDTO> GetAdminUsers();

	List<EmployeeDTO> getEmpDepartMenuList(int compNo);

	int getEmpCompNo(String empCode);

	EmployeeDTO getUserInfo(String empCode);
	public List<String> GetDeptNamelist();

	public List<String> GetTeamNameList(String dept_name);

}
