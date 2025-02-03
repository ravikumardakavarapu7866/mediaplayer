package com.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class PlayerReactapiConfig implements WebMvcConfigurer {

	@Bean
	SecurityFilterChain configure(HttpSecurity http) throws Exception {
		http.csrf((csrf) -> csrf.disable());
		http.addFilterBefore(new PlayerReactapiBeforeFilter(), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedOrigins("*").allowedHeaders("*").exposedHeaders("Location", "Access-Control-Allow-Origin");

		// registry.addMapping("/css/**").allowedOrigins("*");
		// registry.addMapping("/**").allowedOrigins("*");
		// registry.addMapping("/**").allowedMethods("*");
		// registry.addMapping("/**").allowedOrigins("*").allowedMethods("GET", "POST",
		// "PUT", "DELETE", "OPTIONS");
	}

}
