package com.app.controller;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.app.comp.WebUtil;
import com.app.data.dto.ProviderDto;
import com.app.data.dto.UserDto;
import com.app.data.dto.VideoMasterDto;
import com.app.data.service.DataService;
import com.app.util.WebUtility;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class IndexController {

	private static final Logger logger = LogManager.getLogger(IndexController.class);

	@Autowired
	private DataService dataService;

	@Autowired
	private WebUtil webUtil;

	private String buildFile = "buildinfo.properties";

	@Value("${playerUrl}")
	private String playerUrl;

	@GetMapping("/index")
	public String index(Model model, HttpServletRequest req) {
		req.getSession().removeAttribute("userDto");
		model.addAttribute("baseurl", webUtil.getBasePath(req));
		this.setBuildTime(model, req);
		return "login";
	}

	@GetMapping("/")
	public String IndexPage(Model model, HttpServletRequest req) {
		req.getSession().removeAttribute("userDto");
		model.addAttribute("baseurl", webUtil.getBasePath(req));
		this.setBuildTime(model, req);
		return "login";
	}

	@PostMapping("/")
	public String IndexPagePost(Model model, HttpServletRequest req) {
		req.getSession().removeAttribute("userDto");
		model.addAttribute("baseurl", webUtil.getBasePath(req));
		this.setBuildTime(model, req);
		return "login";
	}

	@PostMapping("/home")
	public String homePost(Model model, HttpServletRequest req, HttpServletResponse res) {
		model.addAttribute("baseurl", webUtil.getBasePath(req));
		String error_message = req.getParameter("error_message");
		if (error_message != null && error_message.length() > 0) {
			model.addAttribute("errorMessage", error_message);
		}
		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			this.setBuildTime(model, req);
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("errorMessage", "Your session has expired! please login again");
			return "login";
		}

		this.init(model, req, (UserDto) userDto);
		this.setBuildTime(model, req);

		return "test";
	}

	@PostMapping("/test")
	public String testPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		String path = webUtil.getBasePath(req);

		model.addAttribute("baseurl", path);

		String error_message = req.getParameter("error_message");
		if (error_message != null && error_message.length() > 0) {
			model.addAttribute("errorMessage", error_message);
		}

		Object userDto = req.getSession().getAttribute("userDto");

		if (userDto == null) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("message", "Invalid Request");
			return "nodata";

		}

//		String referrer = req.getHeader("Referer");
//		String refererPath = path + "/play";
//		if (referrer.equalsIgnoreCase(refererPath)) {
//			userEmail = req.getSession().getAttribute("userDto").toString();
//			this.setBuildTime(model, req);
//			this.init(model, req, userEmail);
//			return "test";
//		}
//		if (userEmail != null) {
//			boolean isValid = WebUtility.isValidEmail(userEmail);
//			if (isValid) {
//				req.getSession().setAttribute("userEmail", userEmail);
//				userEmail = req.getSession().getAttribute("userEmail").toString();
//				this.setBuildTime(model, req);
//				this.init(model, req, userEmail);
//				return "test";
//			}
//		}

		this.init(model, req, (UserDto) userDto);
		this.setBuildTime(model, req);

		return "test";
	}

	@PostMapping("/loginPage")
	public String loginPage(Model model, HttpServletRequest req) {
		req.getSession().removeAttribute("userDto");
		model.addAttribute("baseurl", webUtil.getBasePath(req));
		model.addAttribute("errorMessage", "Your session has expired! please login again");
		this.setBuildTime(model, req);
		return "login";
	}

	@PostMapping("/login")
	public String loginPost(Model model, HttpServletRequest req, HttpServletResponse res) {
		String path = webUtil.getBasePath(req);

		model.addAttribute("baseurl", path);
		String userEmail = req.getParameter("userEmail");
		String userPassword = req.getParameter("userPassword");
		String error_message = req.getParameter("error_message");
		logger.debug("errorMessage = " + error_message);
		if (error_message != null && error_message.length() > 0) {
			model.addAttribute("errorMessage", error_message);
			if (error_message.equalsIgnoreCase("Your session has expired!")) {
				return "login";
			}
		}

		if (userEmail == null || userPassword == null || userEmail.isEmpty() || userEmail.isBlank() || userPassword.isEmpty() || userPassword.isBlank()) {
			model.addAttribute("errorMessage", "Invalid Request");
			// res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "login";
		}

		List<UserDto> userDtos = dataService.findUserByEmail(userEmail);
		if (userDtos == null || userDtos.size() == 0) {
			model.addAttribute("errorMessage", "Invalid Request");
			return "login";
		}

		UserDto userDto = null;
		for (UserDto dto : userDtos) {
			if (dto.getPassword().equalsIgnoreCase(userPassword)) {
				userDto = dto;
			}
		}

		if (userDto == null) {
			model.addAttribute("errorMessage", "Invalid Request");
			return "login";
		}
		
		if (userDto.getActive().equalsIgnoreCase("false")) {
			model.addAttribute("errorMessage", "Invalid Request");
			return "login";
		}

		HttpSession httpSession = req.getSession();

		httpSession.setAttribute("loginUser", userDto);
		httpSession.setAttribute("userImpersonate", false);
		httpSession.setAttribute("userDto", userDto);

		this.init(model, req, userDto);
		this.setBuildTime(model, req);

		return "test";
	}

	@PostMapping("/errorPage")
	public String errorPage() {

		return "error-400";
	}

	private void setBuildTime(Model model, HttpServletRequest req) {
		try {

			if (req.getSession().getAttribute("buildTime") == null) {
				Properties configProperties = new Properties();

				InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(buildFile);

				configProperties.load(inputStream);

				req.getSession().setAttribute("buildTime", configProperties.getProperty("build"));
			}

			model.addAttribute("buildTime", req.getSession().getAttribute("buildTime"));
		} catch (Exception e) {
			// System.out.println("Could not load the file");
			e.printStackTrace();
		}
	}

	private void init(Model model, HttpServletRequest req, UserDto userDto) {

		String baseurl = webUtil.getBasePath(req);
		String hasVideos = "";

		List<ProviderDto> providerList = new ArrayList<ProviderDto>();
		List<VideoMasterDto> videoMasterList = new ArrayList<VideoMasterDto>();
		// String userToken = "";
		if (userDto != null) {

			// String userId = userDto.getId();

			// userToken = videoService.findUserToken(userId);

			providerList = dataService.findUserProviders(userDto);

			if (providerList != null && providerList.size() > 0) {
				videoMasterList = dataService.findUserVideos(providerList.get(0).getId(), userDto);
			}
		}
		if (providerList == null || providerList.size() == 0) {
			hasVideos = "You do not have any videos assigned to you";

		}
		if (videoMasterList == null || videoMasterList.size() == 0) {
			hasVideos = "You do not have any videos assigned to you";

		}
		model.addAttribute("userEmail", userDto.getUserEmail());
		// model.addAttribute("userToken", userToken);
		model.addAttribute("hasVideos", hasVideos);
		model.addAttribute("providersSelect", providerList);

		HashMap<String, Object> returnMap = WebUtility.getHomeVideos(videoMasterList, playerUrl, baseurl);

		model.addAttribute("videoSelecItems", videoMasterList);

		model.addAttribute("videoMovies", returnMap.get("videoMovies"));

		model.addAttribute("videoSeries", returnMap.get("videoSeries"));

		WebUtility.getMenuItems(model, baseurl, userDto, req);

	}

	@PostMapping("/end")
	public String endPost(Model model, HttpServletRequest req, HttpServletResponse res) {
		model.addAttribute("baseurl", webUtil.getBasePath(req));

		HttpSession httpSession = req.getSession();

		Object userDto = httpSession.getAttribute("userDto");
		if (userDto == null) {
			this.setBuildTime(model, req);
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("errorMessage", "Your session has expired! please login again");
			return "login";
		}

		Object loginUser = httpSession.getAttribute("loginUser");

		httpSession.setAttribute("userImpersonate", false);
		httpSession.setAttribute("userDto", loginUser);

		this.init(model, req, (UserDto) loginUser);
		this.setBuildTime(model, req);

		return "test";
	}

//	private void providersSelect(Model model, List<ProviderDto> providerDtoList) {
//
//		String events = WebUtility.getSelectEvents("homeProviderChange(this)");
//
//		StringBuffer sb = new StringBuffer();
//
//		sb.append("<select id=\"selectProvider\" style=\"width:95%\" " + events + ">");
//		// sb.append("<option disabled selected value=\"\" >select provider</option>");
//		if (providerDtoList != null && providerDtoList.isEmpty() == false) {
//
//			for (int i = 0; i < providerDtoList.size(); i++) {
//				ProviderDto dto = providerDtoList.get(i);
//				String label = dto.getProviderName();
//
//				sb.append("<option onclick=\"dropClick()\"  id=\"" + dto.getId() + "\" value=\"" + dto.getId() + "\">" + label + "</option>");
//			}
//		}
//		sb.append("</select>");
//		model.addAttribute("providersSelect", sb.toString());
//
//	}

}