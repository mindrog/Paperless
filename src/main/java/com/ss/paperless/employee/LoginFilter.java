package com.ss.paperless.employee;



import java.io.Console;
import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ss.paperless.JWTUtil;

public class LoginFilter extends UsernamePasswordAuthenticationFilter{
	private final AuthenticationManager authenticationManager;
	private final JWTUtil JWTUtil;

    public LoginFilter(AuthenticationManager authenticationManager,JWTUtil JWTUtil) {

        this.authenticationManager = authenticationManager;
        this.JWTUtil = JWTUtil;
        System.out.println("LoginFilter initialized");
    }
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException{
		System.out.println("Attempting authentication...");
		String username = obtainUsername(request);
        String password = obtainPassword(request);
        System.out.println(username);
        System.out.println(password);
		 UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

			//token에 담은 검증을 위한 AuthenticationManager로 전달
		 return authenticationManager.authenticate(authToken);
		 
	}
	@Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
		System.out.println("fhfhfhfhfh");
		CustomEmpDetails customUserDetails = (CustomEmpDetails) authentication.getPrincipal();
	    String username = customUserDetails.getUsername();
	    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
	    GrantedAuthority auth = authorities.iterator().next();
	    String role = auth.getAuthority();
	    String token = JWTUtil.createJwt(username, role, 60 * 60 * 10L);
	    response.addHeader("Authorization", "Bearer " + token);
	    
	    // 다음 필터로 요청 전달
	    try {
	        chain.doFilter(request, response);
	    } catch (IOException | ServletException e) {
	        e.printStackTrace();
	    }
    }

		//로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
    	response.setStatus(401);
    }
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (request.getRequestURI().equals("/api/login") && request.getMethod().equals("POST")) {
        	System.out.println("dofilter");
            attemptAuthentication(request, response);
        } else {
            chain.doFilter(request, response); // 다른 요청은 그냥 넘어가기
        }
    }
}
