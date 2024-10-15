package com.ss.paperless.report;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ReportLoggingAspect {

    @Before("execution(* com.ss.paperless.report..*(..))")
    public void ReportLogBefore(JoinPoint joinPoint) {
        // 실행되는 메서드 호출
        log.info("Report_Log Before : " + joinPoint.getSignature().getName());
    }

    @After("execution(* com.ss.paperless.report..*(..))")
    public void ReportLogAfter(JoinPoint joinPoint) {
        log.info("Report_Log After : " + joinPoint.getSignature().getName());
    }
}
