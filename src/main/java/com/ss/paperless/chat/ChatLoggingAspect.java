package com.ss.paperless.chat;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ChatLoggingAspect {

    @Before("execution(* com.ss.paperless.chat..*(..))")
    public void ChatLogBefore(JoinPoint joinPoint) {
        // 실행되는 메서드 호출
        log.info("Chat_Log Before : " + joinPoint.getSignature().getName());
    }

    @After("execution(* com.ss.paperless.chat..*(..))")
    public void ChatLogAfter(JoinPoint joinPoint) {
        log.info("Chat_Log After : " + joinPoint.getSignature().getName());
    }
}
