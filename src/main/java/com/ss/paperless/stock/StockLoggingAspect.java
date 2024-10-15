package com.ss.paperless.stock;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class StockLoggingAspect {

    @Before("execution(* com.ss.paperless.stock..*(..))")
    public void StockLogBefore(JoinPoint joinPoint) {
        // 실행되는 메서드 호출
        log.info("Stock_Log Before : " + joinPoint.getSignature().getName());
    }

    @After("execution(* com.ss.paperless.stock..*(..))")
    public void InquiryLogAfter(JoinPoint joinPoint) {
        log.info("Stock_Log After : " + joinPoint.getSignature().getName());
    }
}
