package com.ss.paperless.employee;

import java.util.List;

import com.ss.paperless.company.CompanyDTO;
import com.ss.paperless.employee.entity.EmployeeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService implements UserDetailsService {
	private final EmployeeRepository employeeRepository;

	public EmployeeService(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}

	@Autowired
	EmployeeMapper mapper;

	@Override
	public UserDetails loadUserByUsername(String empCode) throws UsernameNotFoundException {
		EmployeeEntity userData = employeeRepository.findByEmpCode(empCode);
		System.out.println("loadUserByUsername" + userData);

		if (userData == null) {
			throw new UsernameNotFoundException("User not found with emp_code: " + empCode);
		}

		// UserDetails에 담아서 return하면 AuthenticationManager가 검증함
		System.out.println(userData);
		return new CustomUserDetails(userData);
	}

	public int getEmpCompNo(String emp_code) {
		return mapper.getEmpCompNo(emp_code);
	}

	public EmployeeDTO getEmpInfo(String emp_code) {
		return mapper.getEmpInfo(emp_code);

	}

	public String getUserPosi(String emp_code) {

		return mapper.getUserPosi(emp_code);
	}

	public int updateEmp(Long id) {
		return mapper.updateEmp(id);
	}

	public List<EmployeeDTO> getEmpDepartMenuList(int compNo) {
		return mapper.getEmpDepartMenuList(compNo);
	}

//	public List<EmployeeDTO> getEmpInfoList(int empCompNo) {
//		return mapper.getEmpInfoList(empCompNo);
//	}

	public EmployeeEntity findByEmail(String email) {
		return employeeRepository.findByEmpEmail(email);
	}

	 public EmployeeEntity findByEmpNo(Long empNo) {
	        return employeeRepository.findByEmpNo(empNo);
	    }
	public EmployeeEntity findByEmpCode(String empCode) {
		return employeeRepository.findByEmpCode(empCode);
	}

	public List<CompanyDTO> GetAdminUsers() {
		
		return mapper.GetAdminUsers();
	}


	public EmployeeDTO getUserInfo(String emp_code) {
		return mapper.getUserInfo(emp_code);
	}
public List<String> GetDeptNamelist() {
		
		return mapper.GetDeptNamelist();
	}

	public List<String> GetTeamNameList(String dept_name) {
		// TODO Auto-generated method stub
		return mapper.GetTeamNameList(dept_name);
	}

	public int GetDeptNo(String dept_name, String dept_team_name) {
		// TODO Auto-generated method stub
		return mapper.GetDeptNo(dept_name,dept_team_name);
	}

	public List<PositionDTO> GetPosition() {
		// TODO Auto-generated method stub
		return mapper.GetPosition();
	}

	public int userInsert(EmployeeDTO emp) {
		return mapper.userInsert(emp);
		
	}

	public List<EmployeeDTO> getEmps(Long emp_comp_no) {
		// TODO Auto-generated method stub
		return mapper.getEmps(emp_comp_no);
	}

	public List<String> GetDeptData(int dept_no) {
		// TODO Auto-generated method stub
		return mapper.GetDeptData(dept_no);
	}

	public String GetDeptName(Long emp_dept_no) {
		// TODO Auto-generated method stub
		return mapper.GetDeptName(emp_dept_no);
	}

	public String GetPosiName(Long emp_posi_no) {
		// TODO Auto-generated method stub
		return mapper.GetPosiName(emp_posi_no);
	}

	public String GetDeptTeamName(Long emp_dept_no) {
		// TODO Auto-generated method stub
		return mapper.GetDeptTeamName(emp_dept_no);
	}

	public int DeleteEmp(Long emp_no) {
		
		return mapper.DeleteEmp(emp_no);
		
	}

	public List<EmployeeDTO> empNameSearch(String query) {
		// TODO Auto-generated method stub
		return mapper.empNameSearch(query);
	}

	public List<EmployeeDTO> empEmailSearch(String query) {
		// TODO Auto-generated method stub
		return mapper.empEmailSearch(query);
	}

	public List<EmployeeDTO> empDeptSearch(String query) {
		// TODO Auto-generated method stub
		return mapper.empDeptSearch(query);
	}

	public List<EmployeeDTO> empPosiSearch(String query) {
		// TODO Auto-generated method stub
		return mapper.empPosiSearch(query);
	}

}
