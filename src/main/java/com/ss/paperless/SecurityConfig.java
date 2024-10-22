package com.ss.paperless;

import org.apache.http.auth.AUTH;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.ss.paperless.employee.LoginFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final AuthenticationConfiguration authenticationConfiguration;
	private final JWTUtil JWTUtil;
	
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration,JWTUtil JWTUtil) {

        this.authenticationConfiguration = authenticationConfiguration;
        this.JWTUtil = JWTUtil;
    }
	@Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
	@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // CSRF 보호 비활성화
		 // 커스텀 로그인 필터 추가
	    http.addFilterBefore(new LoginFilter(authenticationManager(authenticationConfiguration), JWTUtil), UsernamePasswordAuthenticationFilter.class);
		http.csrf(csrf -> csrf.disable());

	    // 로그인 페이지 설정
	    http.formLogin(form -> form
	        .loginPage("/login")
	        .permitAll()
	    );

	    // HTTP Basic 인증 비활성화
	    http.httpBasic(httpBasic -> httpBasic.disable());

	    // 요청에 대한 접근 제어 설정
	    http.authorizeRequests(auth -> auth
	            .requestMatchers(new AntPathRequestMatcher("/api/login")).permitAll() // API 로그인 허용
	            .requestMatchers(new AntPathRequestMatcher("/login"),
	                             new AntPathRequestMatcher("/"),
	                             new AntPathRequestMatcher("/join")).permitAll() // 모든 사용자 허용
	            .requestMatchers(new AntPathRequestMatcher("/system/admin")).hasRole("SYSTEMADMIN")
	            .requestMatchers(new AntPathRequestMatcher("/company/admin")).hasRole("COMPANYADMIN")
	            .requestMatchers(new AntPathRequestMatcher("/company/user")).hasRole("COMPANYUSER")
	            .anyRequest().authenticated() // 나머지 요청은 인증 필요
	        );
	    
	   
	    
	    return http.build();
	}
}
