package com.selab.livinglab.config;



import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.slf4j.LoggerFactory;

@Configuration
public class imgServerConfig implements WebMvcConfigurer{

    static Logger logger = LoggerFactory.getLogger(imgServerConfig.class);

    @Value("${imgServerConfig.resources.location}")
    private String resourcesLocation;
    @Value("${imgServerConfig.resources.uri_path}")
    private String resourcesUriPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(resourcesUriPath + "/**")
                .addResourceLocations("http://" + resourcesLocation);
    }  


}
