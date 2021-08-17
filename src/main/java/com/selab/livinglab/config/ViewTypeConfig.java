package com.selab.livinglab.config;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ViewTypeConfig {
    
    static Logger logger = LoggerFactory.getLogger(ViewTypeConfig.class);
    protected String typeReturnConfig(String type){
        String returnConfigPath = this.getClass().getResource("/").getPath();
        
        logger.info("viewtypeconfig-> " + returnConfigPath);
        return returnConfigPath;
    }
}
