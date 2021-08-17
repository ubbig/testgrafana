package com.selab.livinglab;

import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;
import javax.annotation.PostConstruct;

@EnableScheduling
@EnableAspectJAutoProxy
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class LivinglabApplication {
    
    @Setter(onMethod_ = @Autowired)
    private LivinglabApplication initializer;

    @PostConstruct
    public void Started() throws Exception{
    }
    public static void main(String[] args) {
        SpringApplication.run(LivinglabApplication.class, args);
    }

}

