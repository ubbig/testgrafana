package com.selab.livinglab.Controller;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ui.Model;


import javax.servlet.http.HttpServletRequest;


@Controller
public class IndexController {
    static Logger logger = LoggerFactory.getLogger(IndexController.class);
    public IndexController() {
    }

@RequestMapping("/")
public String index(final Model model, final HttpServletResponse respose, final HttpServletRequest request){
        return "living/geojson";
    }

}
