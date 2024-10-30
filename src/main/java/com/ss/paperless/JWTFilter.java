package com.ss.paperless;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ss.paperless.employee.CustomUserDetails;
import com.ss.paperless.employee.entity.EmployeeEntity;


public class JWTFilter extends OncePerRequestFilter {

	private final JWTUtil jwtUtil;

	public JWTFilter(JWTUtil jwtUtil) {

		this.jwtUtil = jwtUtil;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// request에서 Authorization 헤더를 찾음
		String authorization = request.getHeader("Authorization");
		System.out.println(authorization);

		// Authorization 헤더 검증
		if (authorization == null || !authorization.startsWith("Bearer ")) {

			System.out.println("Auth Token: " + authorization);
			System.out.println(
					"SecurityContext Authentication: " + SecurityContextHolder.getContext().getAuthentication());
			filterChain.doFilter(request, response);

			// 조건이 해당되면 메소드 종료 (필수)
			return;
		}

		System.out.println("authorization now");
		// Bearer 부분 제거 후 순수 토큰만 획득
		String token = authorization.split(" ")[1];

		// 토큰 소멸 시간 검증
		if (jwtUtil.isExpired(token)) {

			System.out.println("token expired");
			filterChain.doFilter(request, response);

			// 조건이 해당되면 메소드 종료 (필수)
			return;
		}

		// 토큰에서 username과 role 획득
		String username = jwtUtil.getUsername(token);
		String role = jwtUtil.getRole(token);
		System.out.println("username : " + username);
		System.out.println("role : " + role);

		// userEntity를 생성하여 값 set
		EmployeeEntity empEntity = new EmployeeEntity();
		empEntity.setEmpCode(username);
		empEntity.setEmpPw("temppassword");
		empEntity.setEmpRole(role);

		// UserDetails에 회원 정보 객체 담기
		CustomUserDetails customUserDetails = new CustomUserDetails(empEntity);

		// 스프링 시큐리티 인증 토큰 생성

		Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
				customUserDetails.getAuthorities());
		// 세션에 사용자 등록
		SecurityContextHolder.getContext().setAuthentication(authToken);

		filterChain.doFilter(request, response);
	}
}