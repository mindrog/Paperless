package com.ss.paperless.employee;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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


	public int GetDeptNo(String dept_name, String dept_team_name);

	public List<PositionDTO> GetPosition();

	public int userInsert(EmployeeDTO emp);

	public List<EmployeeDTO> getEmps(Long emp_comp_no);

	public List<String> GetDeptData(int dept_no);

	public String GetDeptName(Long emp_dept_no);

	public String GetPosiName(Long emp_posi_no);

	public String GetDeptTeamName(Long emp_dept_no);

	public int DeleteEmp(Long emp_no);

	public List<EmployeeDTO> empNameSearch(String query,int comp_no);

	public List<EmployeeDTO> empEmailSearch(String query,int comp_no);

	public List<EmployeeDTO> empDeptSearch(String query,int comp_no);

	public List<EmployeeDTO> empPosiSearch(String query,int comp_no);

	public int userEdit(EmployeeDTO emp);
	
	@Select("SELECT * FROM Department WHERE dept_no = #{deptNo}")
	public DepartmentDTO getDepartmentByNo(int deptNo);

    Long findDeptNoByDeptAndTeamName(Map<String, Object> parms);
}
