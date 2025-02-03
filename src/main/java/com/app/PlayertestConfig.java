package com.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.security.web.util.matcher.AnyRequestMatcher;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.app.filter.PlayertestAfterFilter;
import com.app.filter.PlayertestBeforeFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class PlayertestConfig  implements WebMvcConfigurer {
	@Bean
	public SecurityFilterChain configure(HttpSecurity http) throws Exception {		
		http.csrf((csrf) -> csrf.disable());	
		http.headers(headers -> headers.addHeaderWriter(new StaticHeadersWriter("Access-Control-Max-Age", "1"))
				.xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
				.contentSecurityPolicy(cps -> cps.policyDirectives("object-src 'none'"))
				    
				.addHeaderWriter(new StaticHeadersWriter("Expect-Ct","enforce,max-age=7776000"))
				.referrerPolicy(referrerPolicy -> referrerPolicy.policy(ReferrerPolicy.SAME_ORIGIN))
				.httpStrictTransportSecurity(hstsConfig -> {					
					hstsConfig.maxAgeInSeconds(31556927);
					hstsConfig.includeSubDomains(true);
					hstsConfig.preload(true);
					hstsConfig.requestMatcher(AnyRequestMatcher.INSTANCE);
				}));
		http.addFilterBefore(new PlayertestBeforeFilter(), UsernamePasswordAuthenticationFilter.class);
		http.addFilterAfter( new PlayertestAfterFilter(), BasicAuthenticationFilter.class);
		return http.build();
	}
	
	
	
}
