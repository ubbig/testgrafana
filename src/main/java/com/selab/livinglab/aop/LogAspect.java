package com.selab.livinglab.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.lang.reflect.Method;
import java.security.Principal;

@Slf4j
@Aspect
@Component
public class LogAspect {

    @Around("execution(* selab.livinglab.test.Controller.*.*(..))")
    public Object doAroundControl(ProceedingJoinPoint proceedingJoinPoint) throws Throwable{
        MethodSignature proceedingSignature = (MethodSignature) proceedingJoinPoint.getSignature();

        Method method = proceedingSignature.getMethod();
        boolean isPost = method.isAnnotationPresent(PostMapping.class);
        boolean isPut = method.isAnnotationPresent(PutMapping.class);
        boolean isDelete = method.isAnnotationPresent(DeleteMapping.class);

        if(isPost || isPut || isDelete) {
            String userName = "";
            StringBuilder argsStringBuilder = new StringBuilder();
            String[] paramNames = proceedingSignature.getParameterNames();
            Object[] args = proceedingJoinPoint.getArgs();

            for (int i = 0; i < args.length; i++) {
                Object arg = args[i];
                String argName = paramNames[i];

                if(arg instanceof Principal){
                    Principal principal = (Principal) arg;
                    userName = principal.getName();
                    continue;
                }
                argsStringBuilder.append(argName)
                        .append(":")
                        .append(arg != null ? arg.toString() : "null")
                        .append(" | ");
            }

            // bhjung TODO : DB로깅
            String logString = String.format("method:%s | user:%s\n\targs= %s", proceedingSignature.toShortString(), userName, argsStringBuilder);

            log.info(logString);
        } else {
            log.error("method invalid {}", method.getName());
        }

        Object result = proceedingJoinPoint.proceed();      // AOP 대상이된 메서드 실행

        return result;
    }
}
