package com.ss.paperless;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;


import com.ss.paperless.employee.LoginFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

		private final AuthenticationConfiguration authenticationConfiguration;
		
		private final JWTUtil jwtUtil;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil) {

        this.authenticationConfiguration = authenticationConfiguration;
		this.jwtUtil = jwtUtil;
    }

	@Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	System.out.println("Configuring security filter chain...");
        http
            .csrf(auth -> auth.disable())
            .formLogin(auth -> auth.disable())
            .httpBasic(auth -> auth.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(new AntPathRequestMatcher("/login"), 
                        new AntPathRequestMatcher("/"), 
                        new AntPathRequestMatcher("/join"),
                        new AntPathRequestMatcher("/api/login")).permitAll()
                .anyRequest().authenticated());

        // AuthenticationManager를 생성하고 LoginFilter에 주입합니다.
        http.addFilterBefore(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), 
                UsernamePasswordAuthenticationFilter.class)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
    
}