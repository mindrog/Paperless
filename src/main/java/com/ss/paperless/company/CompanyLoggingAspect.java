package com.ss.paperless.company;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class CompanyLoggingAspect {

    @Before("execution(* com.ss.paperless.company..*(..))")
    public void CompanyLogBefore(JoinPoint joinPoint) {
        // 실행되는 메서드 호출
        log.info("Company_Log Before : " + joinPoint.getSignature().getName());
    }

    @After("execution(* com.ss.paperless.company..*(..))")
    public void CompanyLogAfter(JoinPoint joinPoint) {
        log.info("Company_Log After : " + joinPoint.getSignature().getName());
    }
}
