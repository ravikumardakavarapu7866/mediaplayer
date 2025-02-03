package com.app.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.app.comp.WebUtil;
import com.app.data.dto.UserDto;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class PlayertestBeforeFilter extends OncePerRequestFilter {
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

		StringBuffer requestUrl = request.getRequestURL();

		boolean process = true;

		if (requestUrl.toString().endsWith("index")) {
			process = false;
		} else if (requestUrl.toString().endsWith("/")) {
			process = false;
		} else if (requestUrl.toString().endsWith("loginPage")) {
			process = false;
		} else if (requestUrl.toString().endsWith(".js")) {
			process = false;
		} else if (requestUrl.toString().endsWith(".css")) {
			process = false;
		} else if (requestUrl.toString().endsWith("errorPage")) {
			process = false;
		} else if (requestUrl.toString().endsWith("login")) {
			process = false;
		} else if (requestUrl.toString().endsWith("test.html")) {
			process = false;
		}

		if (process) {
			WebUtil webUtil = new WebUtil();
			logger.debug("requestUrl:" + requestUrl);
			HttpSession session = request.getSession(false);

			String baseUrl = webUtil.getBasePath(request);

			if (session == null) {
				response.setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
				response.setHeader("Location", baseUrl + "/loginPage");
			} else {
				if (session.getAttribute("userDto") != null) {
					Object userDto = session.getAttribute("userDto");
					String userEmailSession = ((UserDto) userDto).getUserEmail();
					String userEmailReqParam = request.getParameter("userEmail");

					if (userEmailReqParam != null) {
						if (!(userEmailSession.equalsIgnoreCase(userEmailReqParam))) {
							response.setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
							response.setHeader("Location", baseUrl + "/errorPage");
							return;
						}
					}
				}
			}

		}

		filterChain.doFilter(request, response);

	}

}