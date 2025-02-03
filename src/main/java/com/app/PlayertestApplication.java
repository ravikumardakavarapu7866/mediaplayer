package com.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.PropertySource;


@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@PropertySource("file:/player/config/application.properties")
public class PlayertestApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(PlayertestApplication.class, args);
	}

}
