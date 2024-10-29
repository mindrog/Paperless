package com.ss.paperless.report;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @GetMapping("/report/getUserInfo")
    public String getUserInfo() {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);

        return "getUserInfo";
    }

}
