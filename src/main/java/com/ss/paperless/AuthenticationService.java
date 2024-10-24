//package com.ss.paperless;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AuthenticationService {
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//    @Autowired 	
//    private JWTUtil util;
//    private final PasswordEncoder passwordEncoder;
//
//    public AuthenticationService() {
//        this.passwordEncoder = new BCryptPasswordEncoder(); // BCryptPasswordEncoder 초기화
//    }
//
//    private boolean passwordIsValid(String rawPassword, String encodedPassword) {
//    	System.out.println("passwordIsValid lunched");
//        return passwordEncoder.matches(rawPassword, encodedPassword);
//    }
//    
//    public String authenticate(String empCode, String empPw) {
//        // emp_code로 사용자 정보를 로드
//        UserDetails userDetails = userDetailsService.loadUserByUsername(empCode);
//        if (userDetails == null) {
//            System.out.println("User not found for empCode: " + empCode);
//            throw new RuntimeException("User not found");
//        } else {
//            System.out.println("User found: " + userDetails.getUsername());
//        }
//        if (userDetails != null && passwordIsValid(empPw, userDetails.getPassword())) {
//            String role = userDetails.getAuthorities().stream()
//                            .map(GrantedAuthority::getAuthority)
//                            .findFirst()
//                            .orElse(null);
//
//            if (role == null) {
//                throw new RuntimeException("Role is null, cannot issue token");
//            }
//
//            // JWT 생성 시 역할 포함
//            
//        } else {
//            throw new RuntimeException("Authentication failed");
//        }
//    }
//
//    
//}
//
