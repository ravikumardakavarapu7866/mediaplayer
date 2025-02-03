package com.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@EnableScheduling
@PropertySource("file:/player/config/playerreactapi.properties")
public class PlayerreactapiApplication extends SpringBootServletInitializer { 

	public static void main(String[] args) {

		SpringApplication.run(PlayerreactapiApplication.class, args);

	}

}
