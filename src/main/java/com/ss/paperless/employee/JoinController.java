package com.ss.paperless.employee;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class JoinController {
//	 private final JoinService joinService;
//
//	    public JoinController(JoinService joinService) {
//	        
//	        this.joinService = joinService;
//	        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//	        String rawPassword = "1234";
//	        String encodedPassword = passwordEncoder.encode(rawPassword);
//	        System.out.println("Encoded password: " + encodedPassword);
//	    }
//
//	    @PostMapping("/join")
//	    public String joinProcess(joinDTO joinDTO) {
//
//	        System.out.println(joinDTO.getUsername());
//	        joinService.joinProcess(joinDTO);
//
//	        return "ok";
//	    }
}
