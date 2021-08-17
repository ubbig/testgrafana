package com.selab.livinglab.Controller;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.LoggerFactory;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

public class GeoJsonController {
    static Logger logger = LoggerFactory.getLogger(IndexController.class);
    public IndexController() {
    }

@RequestMapping("/")
public String index(final Model model, final HttpServletResponse respose, final HttpServletRequest request){
        return "living/lab";
    }
}
