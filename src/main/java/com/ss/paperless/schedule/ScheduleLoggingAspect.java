package com.ss.paperless.schedule;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ScheduleLoggingAspect {

    @Before("execution(* com.ss.paperless.schedule..*(..))")
    public void ScheduleLogBefore(JoinPoint joinPoint) {
        // 실행되는 메서드 호출
        log.info("Schedule_Log Before : " + joinPoint.getSignature().getName());
    }

    @After("execution(* com.ss.paperless.schedule..*(..))")
    public void ScheduleLogAfter(JoinPoint joinPoint) {
        log.info("Schedule_Log After : " + joinPoint.getSignature().getName());
    }
}
