package com.selab.livinglab.filter;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AjaxTimeOutFilter extends OncePerRequestFilter {

    private static final String AJAX_HEADER = "ajax";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if(isAjaxRequest(request)){
            try {
                filterChain.doFilter(request, response);
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN);
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private boolean isAjaxRequest(HttpServletRequest request){
        String ajaxHeader = request.getHeader(AJAX_HEADER);

        return ajaxHeader != null && ajaxHeader.equals("true");
    }
}
