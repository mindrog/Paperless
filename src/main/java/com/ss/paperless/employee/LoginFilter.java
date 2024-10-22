package com.ss.paperless.employee;



import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class LoginFilter extends UsernamePasswordAuthenticationFilter{
	private final AuthenticationManager authenticationManager;

    public LoginFilter(AuthenticationManager authenticationManager) {

        this.authenticationManager = authenticationManager;
    }
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException{
		String id = obtainUsername(request);
        String password = obtainPassword(request);
		 UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(id, password, null);

			//token에 담은 검증을 위한 AuthenticationManager로 전달
		 return authenticationManager.authenticate(authToken);
		 
	}
	@Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {

    }

		//로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {

    }
}
