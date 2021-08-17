package com.selab.livinglab.aop;


import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Slf4j
@Aspect
@Component
public class ServiceAspect {

    @Around("execution(* selab.livinglab.test.Service.*.*(..))")
    public Object doAroundService(ProceedingJoinPoint proceedingJoinPoint) throws Throwable{
        Signature proceedingSignature = proceedingJoinPoint.getSignature();

        long startTime = Instant.now().toEpochMilli();
        Object result = proceedingJoinPoint.proceed();
        long endTime = Instant.now().toEpochMilli();

        long elapsed = endTime - startTime;
        log.trace(proceedingSignature.toShortString()+": finish in "+elapsed+"ms");

        return result;
    }
}
