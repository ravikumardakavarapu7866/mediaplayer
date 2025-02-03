package com.app.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class CustomErrorController  implements ErrorController{
	
	private static final Logger logger = LogManager.getLogger(CustomErrorController.class);

	@RequestMapping("/error")
	public String handleError(HttpServletRequest request, HttpServletResponse res) {
		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        logger.debug("errorcode:" + status);
		if (status != null) {
			Integer statusCode = Integer.valueOf(status.toString());

			if (statusCode == HttpStatus.UNAUTHORIZED.value()) {
				return "error-401";
			} else if (statusCode == HttpStatus.FORBIDDEN.value()) {
				return "error-403";
			} else if (statusCode == HttpStatus.NOT_FOUND.value()) {
				return "error-404";

			} else {
				res.setStatus(HttpStatus.BAD_REQUEST.value());
			}
			
				
		} 
		
		
		
		return "error";
	}
}
