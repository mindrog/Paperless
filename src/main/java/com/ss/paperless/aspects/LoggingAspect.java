package com.ss.paperless.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Before("execution(* com.ss.paperless.)")
    public void logBefore(JoinPoint joinPoint) {
        log.info("Before : " + joinPoint.getSignature().getName());
    }

}
