package com.ss.paperless.employee;

import java.sql.Timestamp;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


public class JoinService {
	
//    private final BCryptPasswordEncoder bCryptPasswordEncoder;
//	private final EmployeeMapper mapper;
//
//    public JoinService(BCryptPasswordEncoder bCryptPasswordEncoder,EmployeeMapper mapper) {
//
//        this.mapper = mapper;
//        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
//    }
//
//    public void joinProcess(joinDTO joinDTO) {
//
//        String username = joinDTO.getUsername();
//        String password = joinDTO.getPassword();
//        String email = joinDTO.getEmail();
//        String phone = joinDTO.getPhone();
//        String sign = joinDTO.getSign();
//        String profile = joinDTO.getProfile();
//        int comp_no = joinDTO.getComp_no();
//        int dept_no = joinDTO.getDept_no();
//        int posi_no = joinDTO.getPosi_no();
//        Timestamp join_date = joinDTO.getJoin_date();
//        String role = joinDTO.getRole();
//        
//        int isExist = mapper.existsByUsername(username);
//
//        if (isExist != 0) {
//
//            return;
//        }
//
//        EmployeeDTO data = new EmployeeDTO();
//
//        data.setUsername(username);
//        data.setPassword(bCryptPasswordEncoder.encode(password));
//        data.setRole("ROLE_ADMIN");
//
//        userRepository.save(data);
//    }
}
