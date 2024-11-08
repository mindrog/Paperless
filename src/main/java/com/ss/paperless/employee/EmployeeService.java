package com.ss.paperless.employee;

import java.util.List;

import com.ss.paperless.company.CompanyDTO;
import com.ss.paperless.employee.entity.EmployeeEntity;
import com.ss.paperless.s3.S3Service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EmployeeService implements UserDetailsService {
	private final EmployeeRepository employeeRepository;

	@Autowired
	private S3Service s3Service;

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
		return mapper.GetDeptNo(dept_name, dept_team_name);
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

	public List<EmployeeDTO> empNameSearch(String query, int comp_no) {
		// TODO Auto-generated method stub
		return mapper.empNameSearch(query,comp_no);
	}

	public List<EmployeeDTO> empEmailSearch(String query,int comp_no) {
		// TODO Auto-generated method stub
		return mapper.empEmailSearch(query,comp_no);
	}

	public List<EmployeeDTO> empDeptSearch(String query,int comp_no) {
		// TODO Auto-generated method stub
		return mapper.empDeptSearch(query,comp_no);
	}

	public List<EmployeeDTO> empPosiSearch(String query,int comp_no) {
		// TODO Auto-generated method stub
		return mapper.empPosiSearch(query,comp_no);
	}

	public int userEdit(EmployeeDTO emp) {
		// TODO Auto-generated method stub
		return mapper.userEdit(emp);
	}

	public String uploadProfileImage(Long empNo, MultipartFile file) throws IOException {
        // EmployeeEntity 조회
        EmployeeEntity employee = employeeRepository.findById(empNo)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with empNo: " + empNo));

        // S3에 파일 업로드
        String imageUrl = s3Service.uploadFile(file, "profile", employee.getEmpNo());

        // 직원 엔티티의 프로필 이미지 URL 업데이트
        employee.setEmpProfile(imageUrl);
        employeeRepository.save(employee);

        return imageUrl;
    }

    public Long getEmpNoByEmpCode(String empCode) {
        EmployeeEntity employee = employeeRepository.findByEmpCode(empCode);
        if (employee == null) {
            throw new IllegalArgumentException("Employee not found with empCode: " + empCode);
        }
        return employee.getEmpNo();
    }
    
    public DepartmentDTO getDepartmentByNo(int deptNo) {
        return mapper.getDepartmentByNo(deptNo);
    }
    
    public void changePassword(Long empNo, String encodedNewPassword) {
        EmployeeEntity employee = findByEmpNo(empNo);

      
        employee.setEmpPw(encodedNewPassword);
        employeeRepository.save(employee);
    }
    
    public void changePhoneNumber(Long empNo, String newPhoneNumber) {
        EmployeeEntity employee = findByEmpNo(empNo);

        // 전화번호 업데이트
        employee.setEmpPhone(newPhoneNumber);
        employeeRepository.save(employee);
    }
    

}
