package com.ss.paperless.employee;



import java.io.Console;
import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ss.paperless.JWTUtil;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {
	@Autowired
    private AuthenticationManager authenticationManager;
	@Autowired
    private JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
    	this.authenticationManager = authenticationManager;
    	this.jwtUtil = jwtUtil;
        System.out.println("로그인 필터 실행");
        
    }
    
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
    	 System.out.println("Request URI: " + request.getRequestURI());
    	   System.out.println("Request Method: " + request.getMethod());
        // 로그인 요청인지 확인
        if (request.getRequestURI().equals("/api/login") && request.getMethod().equals("POST")) {
            String username = request.getParameter("empCode");
            String password = request.getParameter("empPw");

            if (username != null && password != null) {
                try {
                    // 인증 요청 생성
                    UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
                    Authentication authResult = authenticationManager.authenticate(authRequest);
                    
                    // 인증 성공 처리
                    successfulAuthentication(request, response, chain, authResult);
                    return; // 인증 성공 시 더 이상 진행하지 않음
                } catch (AuthenticationException e) {
                    // 인증 실패 처리
                    unsuccessfulAuthentication(request, response, e);
                    return; // 인증 실패 시 더 이상 진행하지 않음
                }
            } else {
                System.out.println("Username or password is missing.");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return; // 파라미터가 없는 경우 더 이상 진행하지 않음
            }
        }

        // 다른 요청은 계속 진행
        chain.doFilter(request, response);
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
    	try {
            // 요청 본문에서 JSON 데이터를 읽습니다.
    		System.out.println("attemptAuthentication called");
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> jsonMap = objectMapper.readValue(request.getInputStream(), new TypeReference<Map<String, String>>() {});

            // JSON에서 empCode와 empPw 값을 가져옵니다.
            String empCode = jsonMap.get("empCode");
            String empPw = jsonMap.get("empPw");
            System.out.println("empCode : " + empCode);
            System.out.println("empPw : " + empPw);
            // empCode와 empPw가 null인지 확인합니다.
            if (empCode == null || empPw == null) {
            	System.out.println("null 시발");
                throw new IllegalArgumentException("empCode or empPw cannot be null");
            }

            // AuthenticationToken을 생성하여 반환합니다.
            if (this.getAuthenticationManager() == null) {
                throw new IllegalStateException("AuthenticationManager is null");
            }

            // AuthenticationToken을 생성하여 반환합니다.
            UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(empCode, empPw);
            return this.getAuthenticationManager().authenticate(authRequest);
            
        } catch (JsonParseException e) {
            // JSON 파싱 오류 처리
            throw new RuntimeException("Invalid JSON format", e);
        } catch (DatabindException e) {
            // 데이터 바인딩 오류 처리
            throw new RuntimeException("Data binding error", e);
        } catch (IOException e) {
            // 입출력 오류 처리
            throw new RuntimeException("Failed to parse request body", e);
        }
    }
    
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
    	
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String username = customUserDetails.getUsername();
        
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();
        System.out.println("Authentication successful for user: " + username + " with role: " + role);
        String token = jwtUtil.createJwt(username, role, 60*60*10L);
        response.setHeader("Authorization", "access");
        response.setHeader("Authorization", "Bearer " + token);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
    	System.out.println("you failed");
        response.setStatus(401);
    }
    
}