package com.app.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;

import com.app.comp.Validater;
import com.app.comp.WebUtil;
import com.app.data.dto.AspectRatioDto;
import com.app.data.dto.AspectRatioKeyDto;
import com.app.data.dto.AspectRatioKeysDto;
import com.app.data.dto.ConfigurationDto;
import com.app.data.dto.ConfigurationVideoDto;
import com.app.data.dto.ConsumerProcessDto;
import com.app.data.dto.GlobalConfigurationDto;
import com.app.data.dto.PlayerRequestDto;
import com.app.data.dto.ProviderDto;
import com.app.data.dto.ProviderTokenDto;
import com.app.data.dto.RoleDto;
import com.app.data.dto.UserDto;
import com.app.data.dto.UserTokenDto;
import com.app.data.dto.UserTokenVideoDto;
import com.app.data.dto.VideoAnalysisDto;
import com.app.data.dto.VideoDetailProgressDto;
import com.app.data.dto.VideoDetailUserDto;
import com.app.data.dto.VideoMasterDto;
import com.app.data.dto.VideoPlayEventDetailDto;
import com.app.data.dto.VideoPlayEventDto;
import com.app.data.service.DataService;
import com.app.data.util.Constants;
import com.app.data.util.Pagination;
import com.app.data.util.Utility;
import com.app.util.WebUtility;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class PlayController {

	@Value("${playerUrl}")
	private String playerUrl;

	@Autowired
	private DataService dataService;

	@Autowired
	private Validater validater;

	@Autowired
	private WebUtil webUtil;

	@PostMapping("/play")
	public String play(Model model, HttpServletRequest req, HttpServletResponse res) {

		HttpSession session = req.getSession(false);

		if (session == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object objUserDto = session.getAttribute("userDto");
		if (objUserDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		UserDto userDto = (UserDto) objUserDto;

		this.init(model, req, userDto);
		model.addAttribute("buildTime", session.getAttribute("buildTime"));

		String parentPage = req.getParameter("parentPage");
		if (parentPage != null && parentPage.equalsIgnoreCase("true")) {

			String baseurl = webUtil.getBasePath(req);

			List<ProviderDto> providerList = new ArrayList<ProviderDto>();
			List<VideoMasterDto> videoMasterList = new ArrayList<VideoMasterDto>();
			String hasVideos = "";
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

			return "test";
		}

		String videoId = req.getParameter("videoMasterId");

		String showWatermark = req.getParameter("showWatermark");

		String userToken = req.getParameter("userToken");
		String sessionvalue = req.getParameter("sessionTimeOutValue");
		String sessionIncrement = req.getParameter("sessionIncrement");
		String providerId = req.getParameter("providerId");
		String playFromBegin = req.getParameter("playFromBegin");

		if (req.getParameter("sessionTimeOutValue") != null || req.getParameter("sessionTimeOutValue") == null) {
			boolean valid = Utility.isSessionTimeOut(req.getParameter("sessionTimeOutValue"));
			if (!valid) {
				model.addAttribute("message", "Invalid Request");
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				return "nodata";
			}
		}

		if (providerId == null || videoId == null || showWatermark == null || userToken == null || videoId.isEmpty() || showWatermark.isEmpty() || userToken.isEmpty() || videoId.isBlank() || showWatermark.isBlank() || userToken.isBlank() || userToken.equalsIgnoreCase("null") || videoId.equalsIgnoreCase("null") || showWatermark.equalsIgnoreCase("null")) {
			// if ( showWatermark == null || userToken == null || showWatermark.isEmpty() ||
			// userToken.isEmpty() || showWatermark.isBlank() || userToken.isBlank() ||
			// userToken.equalsIgnoreCase("null") || showWatermark.equalsIgnoreCase("null"))
			// {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (validateInput(providerId, videoId, showWatermark, userToken, sessionIncrement) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (req.getParameter("videoMasterId") != null && !req.getParameter("videoMasterId").isEmpty()) {
			List<String> masterId = dataService.getVideoMasterId(req.getParameter("videoMasterId"));

			if (masterId == null || masterId.isEmpty()) {
				model.addAttribute("message", "Invalid Request");
				res.setStatus(HttpStatus.BAD_REQUEST.value());
				return "nodata";
			}

		}

		if (videoId != null && !videoId.isEmpty()) {
			VideoMasterDto masterDto = dataService.findMaster(videoId);
			if (!masterDto.getId().equalsIgnoreCase(videoId)) {
				model.addAttribute("message", "Invalid Request");
				res.setStatus(HttpStatus.BAD_REQUEST.value());
				return "nodata";
			}
		}

		model.addAttribute("playerUrl", playerUrl);
		model.addAttribute("videoId", videoId);

		model.addAttribute("showWatermark", showWatermark);
		model.addAttribute("userToken", userToken);
		model.addAttribute("sessiontimeout", sessionvalue);
		model.addAttribute("sessionIncrement", sessionIncrement);
		model.addAttribute("providerId", providerId);
		model.addAttribute("playFromBegin", playFromBegin);

		return "play";
	}

	@PostMapping("/aspectratios")
	public String aspectRatiosPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		return aspectRatios(model, req, res, (UserDto) userDto);
	}

	@PostMapping("/videos")
	public String videosPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}
		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		Pagination p = new Pagination();

		this.setGridHeight(p, req, 0.38);

		int currentPage = 1;

		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}

		p.setPageNumber(currentPage);
		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0 && WebUtility.isHtml(req.getParameter("providerValue"))) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		String inputVal = "";
		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0) {
			inputVal = req.getParameter("providerValue").toString().trim();
			p.setProviderValue("%" + inputVal + "%");
		}

		model.addAttribute("inputProvider", inputVal);

		Long count = dataService.countVideoMasters(p, (UserDto) userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		List<VideoMasterDto> videoMasterDtoList = dataService.findVideoMasters(p, (UserDto) userDto);

		model.addAttribute("videoMasterList", videoMasterDtoList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);
		model.addAttribute("serverDateTime", validater.getServerDateTime());

		return "videos";
	}

	@PostMapping("/videosprogress")
	public String videosProgressPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		String userEmail = "";

		if (req.getParameter("userValue") != null && req.getParameter("userValue").length() > 0) {
			userEmail = req.getParameter("userValue").toString().trim();
		}

		if (userEmail != null && !userEmail.isEmpty() && WebUtility.isHtml(userEmail)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		String videoName = "";
		if (req.getParameter("videoValue") != null && req.getParameter("videoValue").length() > 0) {
			videoName = req.getParameter("videoValue").toString().trim();
		}

		if (videoName != null && !videoName.isEmpty() && WebUtility.isHtml(videoName)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Pagination p = new Pagination();

		this.setGridHeight(p, req, 0.50);

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		int currentPage = 1;

		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}

		p.setPageNumber(currentPage);

		if (userEmail != null && userEmail.length() > 0) {
			p.setUserValue("%" + userEmail + "%");
		}

		if (videoName != null && videoName.length() > 0) {
			p.setVideoValue("%" + videoName + "%");
		}

		model.addAttribute("inputEmail", userEmail);
		model.addAttribute("inputVideo", videoName);

		Long count = dataService.countVideosProgress(p, (UserDto) userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		List<VideoDetailProgressDto> videosProgressList = dataService.findVideosProgress(p, (UserDto) userDto);

		if (videosProgressList != null && videosProgressList.size() > 0) {

			String videoDetailProgressId = videosProgressList.get(0).getId();

			List<VideoDetailUserDto> videoDetailUserList = dataService.findVideoDetailUser(videoDetailProgressId);

			String videoUserHtml = WebUtility.getVideoProgressRecords(videoDetailUserList);

			model.addAttribute("videoUserHtml", videoUserHtml);

		}

		model.addAttribute("videosProgressList", videosProgressList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());
		if (videosProgressList != null && videosProgressList.size() > 0) {
			model.addAttribute("firstColoumnId", videosProgressList.get(0).getId());

		} else {
			model.addAttribute("firstColoumnId", "");

		}

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		return "videosprogress";
	}

	@PostMapping("/providers")
	public String providersPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		List<ProviderTokenDto> providerTokenDtoList = null;
		Long count = (long) 0;
		String inputValue = null;
		Pagination p = new Pagination();
		this.setGridHeight(p, req, 0.38);
		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0 && WebUtility.isHtml(req.getParameter("providerValue"))) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}
		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0) {
			inputValue = req.getParameter("providerValue").toString().trim();
			p.setProviderValue("%" + inputValue + "%");

		}

		if (req.getParameter("providerTokenId") != null && req.getParameter("providerTokenId").length() > 0) {
			if (WebUtility.isHtml(req.getParameter("providerTokenId"))) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			} else {
				ProviderTokenDto dto = dataService.findProviderTokenById(req.getParameter("providerTokenId"));
				if (dto != null) {

					Date current = new Date();
					dto.setDeleted(true);
					dto.setUpdatedDate(current);

					dataService.deleteProviderToken(dto);
					model.addAttribute("message", "Successfully Deleted Provider Token  for " + dto.getProviderName());

				} else {
					res.setStatus(HttpStatus.UNAUTHORIZED.value());
					model.addAttribute("message", "Invalid Request");
					return "nodata";
				}

			}
		}
		model.addAttribute("inputProvider", inputValue);
		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		int currentPage = 1;
		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}
		p.setPageNumber(currentPage);

		count = dataService.countProviderTokens(p, (UserDto) userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		providerTokenDtoList = dataService.findProviderTokens(p, (UserDto) userDto);

		List<ProviderDto> providerList = dataService.findAllProviders((UserDto) userDto);

		model.addAttribute("providerList", providerList);

		model.addAttribute("providerTokenList", providerTokenDtoList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);
		model.addAttribute("serverDateTime", validater.getServerDateTime());

		UserDto dto = (UserDto) userDto;

		StringBuffer sbAddProvider = new StringBuffer();

		if (dto.getRole().equalsIgnoreCase(Constants.superAdmin)) {
			sbAddProvider.append("<button type=\"button\" class=\"search-btn\" onclick=\"javascript:showAddProvider()\">Add Provider</button>");
		}

		model.addAttribute("addProvider", sbAddProvider.toString());

		return "providers";
	}

	@PostMapping("/playerRequests")
	public String playerRequestsPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		List<PlayerRequestDto> playerRequestDtoList = null;
		Long count = (long) 0;
		// String inputValue = null;
		Pagination p = new Pagination();
		this.setGridHeight(p, req, 0.38);
		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

//		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0 && WebUtility.isHtml(req.getParameter("providerValue"))) {
//			res.setStatus(HttpStatus.UNAUTHORIZED.value());
//			model.addAttribute("message", "Invalid Request");
//			return "nodata";
//		}
		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(page) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}
//
//		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0) {
//			inputValue = req.getParameter("providerValue").toString().trim();
//			p.setProviderValue("%" + inputValue + "%");
//
//		}
//
//		if (req.getParameter("providerTokenId") != null && req.getParameter("providerTokenId").length() > 0) {
//			if (WebUtility.isHtml(req.getParameter("providerTokenId"))) {
//				res.setStatus(HttpStatus.UNAUTHORIZED.value());
//				model.addAttribute("message", "Invalid Request");
//				return "nodata";
//			} else {
//				ProviderTokenDto dto = dataService.findProviderTokenById(req.getParameter("providerTokenId"));
//				if (dto != null) {
//
//					Date current = new Date();
//					dto.setDeleted(true);
//					dto.setUpdatedDate(current);
//
//					dataService.deleteProviderToken(dto);
//					model.addAttribute("message", "Sucessfully Deleted Provider Token  for " + dto.getProviderName());
//
//				} else {
//					res.setStatus(HttpStatus.UNAUTHORIZED.value());
//					model.addAttribute("message", "Invalid Request");
//					return "nodata";
//				}
//
//			}
//		}
//		model.addAttribute("inputProvider", inputValue);

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		int currentPage = 1;
		if (page != null && page.length() > 0) {
			currentPage = Integer.parseInt(page);
		}
		p.setPageNumber(currentPage);

		count = dataService.countPlayerRequests(p, (UserDto) userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		playerRequestDtoList = dataService.findPlayerRequests(p, (UserDto) userDto);

		model.addAttribute("playerRequestList", playerRequestDtoList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		return "playerrequests";
	}

	@PostMapping("/users")
	public String usersPost(Model model, HttpServletRequest req, HttpServletResponse res) {
		List<UserTokenDto> userList = null;
		Long count = (long) 0;
		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}
		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		String message = req.getParameter("message");
		if (message != null && WebUtility.isHtml(message)) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (req.getParameter("inputValue") != null && req.getParameter("inputValue").length() > 0 && WebUtility.isHtml(req.getParameter("inputValue"))) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}
		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		Pagination p = new Pagination();
		this.setGridHeight(p, req, 0.60);

		int currentPage = 1;
		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}
		String inputVal = "";

		if (req.getParameter("inputValue") != null && req.getParameter("inputValue").length() > 0) {
			inputVal = req.getParameter("inputValue").toString().trim();

			p.setUserValue("%" + inputVal + "%");

		}

		model.addAttribute("inputEmail", inputVal);

		p.setPageNumber(currentPage);

		count = dataService.countUserTokens(p, (UserDto) userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		userList = dataService.findUserTokens(p, (UserDto) userDto);

		model.addAttribute("userList", userList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());
		model.addAttribute("message", message);
		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		List<UserTokenVideoDto> userTokenVideoList = new ArrayList<UserTokenVideoDto>();

		if (userList != null && userList.size() > 0) {
			String userTokenId = userList.get(0).getId();

			if (req.getParameter("userTokenId") != null && !req.getParameter("userTokenId").isEmpty()) {
				userTokenId = req.getParameter("userTokenId");

			}

			userTokenVideoList = dataService.findUserTokenVideos(userTokenId);
		}

		int dGridHeight = 200;
//		if (req.getParameter("gridHeight") != null && !req.getParameter("gridHeight").isEmpty()) {
//			Integer gridHeight = Integer.parseInt(req.getParameter("gridHeight"));
//			Double d = gridHeight * 0.65;
//			dGridHeight = gridHeight - d.intValue();
//		}
		int add = 0;
		if (userTokenVideoList.size() < 30) {
			add = 30 - userTokenVideoList.size();
		}

		model.addAttribute("userTokenVideoList", userTokenVideoList);
		model.addAttribute("dCount", userTokenVideoList.size());
		model.addAttribute("dPageSize", (userTokenVideoList.size() + add));
		model.addAttribute("dCurrentPage", 1);
		model.addAttribute("dGridHeight", dGridHeight);

		int dStartRecord = 0;
		model.addAttribute("dStartRecord", dStartRecord);

		return "users";
	}

//	@PostMapping("/uservideos")
//	public String userVideosPost(Model model, HttpServletRequest req, HttpServletResponse res) {
//		List<UserVideoDto> userVideosList = null;
//		Long count = (long) 0;
//		boolean validation = WebUtility.isValidRequest(req, res);
//		if (!validation) {
//			model.addAttribute("message", "Invalid Request");
//			return "nodata";
//		}
//		String page = req.getParameter("currentPage");
//		if (page == null) {
//			model.addAttribute("message", "Invalid Request");
//			res.setStatus(HttpStatus.UNAUTHORIZED.value());
//			return "nodata";
//		}
//
//		String message = req.getParameter("message");
//
//		if (message != null && WebUtility.isHtml(message)) {
//			res.setStatus(HttpStatus.UNAUTHORIZED.value());
//			model.addAttribute("message", "Invalid Request");
//			return "nodata";
//		}
//
//		if (req.getParameter("inputValue") != null && req.getParameter("inputValue").length() > 0 && WebUtility.isHtml(req.getParameter("inputValue"))) {
//			res.setStatus(HttpStatus.UNAUTHORIZED.value());
//			model.addAttribute("message", "Invalid Request");
//			return "nodata";
//		}
//		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
//			model.addAttribute("message", "Invalid Request");
//			res.setStatus(HttpStatus.UNAUTHORIZED.value());
//			return "nodata";
//		}
//		this.init(model, req);
//		Pagination p = new Pagination();
//		this.setGridHeight(p, req, 0.38);
//
//		int currentPage = 1;
//		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
//			currentPage = Integer.parseInt(req.getParameter("currentPage"));
//		}
//		String inputVal = "";
//
//		if (req.getParameter("inputValue") != null && req.getParameter("inputValue").length() > 0) {
//			inputVal = req.getParameter("inputValue").toString().trim();
//			p.setUserValue("%" + inputVal + "%");
//
//		}
//
//		model.addAttribute("inputEmail", inputVal);
//
//		p.setPageNumber(currentPage);
//
//		count = dataService.countUserVideos(p);
//
//		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
//		if (intPages != 0) {
//			if (currentPage > intPages) {
//				res.setStatus(HttpStatus.UNAUTHORIZED.value());
//				model.addAttribute("message", "Invalid Request");
//				return "nodata";
//			}
//		}
//
//		userVideosList = dataService.findUserVideos(p);
//
//		model.addAttribute("userVideosList", userVideosList);
//		model.addAttribute("count", count);
//		model.addAttribute("pageSize", p.getPageSize());
//		model.addAttribute("currentPage", currentPage);
//		model.addAttribute("gridHeight", p.getGridHeight());
//		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
//		model.addAttribute("startRecord", startRecord);
//		model.addAttribute("message", message);
//
//		return "uservideos";
//	}

	@PostMapping("/usertoken")
	public String usertokenPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);

		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		List<ProviderDto> providerDtoList = dataService.findActiveProviders((UserDto) userDto);

		model.addAttribute("providerList", providerDtoList);
		model.addAttribute("serverDateTime", validater.getServerDateTime());
		model.addAttribute("serverDate", validater.getServerDate());

		List<UserDto> userList = dataService.findProviderUsers(providerDtoList.get(0).getId());

		model.addAttribute("userList", userList);

		this.getGridProvideVideos(model, req, providerDtoList.get(0).getId());

		return "usertoken";
	}

	@PostMapping("/providervideos")
	public String providerVideosPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);

		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("pvCurrentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		this.getGridProvideVideos(model, req, null);

		return "providervideos";
	}

	private void getGridProvideVideos(Model model, HttpServletRequest req, String providerIdParam) {
		Pagination pv = new Pagination();
		this.setGridHeight(pv, req, 0.55);

		Object userDto = req.getSession().getAttribute("userDto");

		int pvCurrentPage = 1;
		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			pvCurrentPage = Integer.parseInt(req.getParameter("currentPage"));
		}

		String providerId = null;
		if (req.getParameter("providerId") != null && req.getParameter("providerId").length() > 0) {
			providerId = req.getParameter("providerId");
		}

		if (providerIdParam != null && providerIdParam.length() > 0) {
			providerId = providerIdParam;
		}

		pv.setPageNumber(pvCurrentPage);
		pv.setProviderId(providerId);

		Long pvCount = dataService.countVideoMasters(pv, (UserDto) userDto);

		List<VideoMasterDto> providerVideosList = dataService.findActiveVideos(pv, (UserDto) userDto);

		model.addAttribute("pvCount", pvCount);
		model.addAttribute("pvList", providerVideosList);
		model.addAttribute("pvPageSize", pv.getPageSize());
		model.addAttribute("pvCurrentPage", pvCurrentPage);
		model.addAttribute("pvGridHeight", pv.getGridHeight());
		int pvStartRecord = (pv.getPageNumber() - 1) * pv.getPageSize();
		model.addAttribute("pvStartRecord", pvStartRecord);
	}

	/*
	 * @PostMapping("/saveAspectRatio") public String saveAspectRatio(Model model,
	 * HttpServletRequest req, HttpServletResponse res) {
	 * 
	 * String width = req.getParameter("widthParam"); String height =
	 * req.getParameter("heightParam"); String videoBitrate =
	 * req.getParameter("videoBitrateParam"); String audioBitrate =
	 * req.getParameter("audioBitrateParam");
	 * 
	 * AspectRatioDto dto = new AspectRatioDto();
	 * dto.setWidth(Integer.valueOf(width)); dto.setHeight(Integer.valueOf(height));
	 * dto.setVideoBitrate(videoBitrate); dto.setAudioBitrate(audioBitrate);
	 * 
	 * String aspectRatio = WebUtility.getAspectRatio(dto.getWidth(),
	 * dto.getHeight());
	 * 
	 * dto.setAspectRatio(aspectRatio);
	 * 
	 * Date current = new Date(); dto.setCreatedDate(current);
	 * dto.setUpdatedDate(current);
	 * 
	 * String returnMessage = dataService.saveAspectRatio(dto);
	 * model.addAttribute("message", returnMessage);
	 * 
	 * return aspectRatios(model, req, res); }
	 */

	@PostMapping("/consumerprocess")
	public String consumerprocessPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Pagination p = new Pagination();

		this.setGridHeight(p, req, 0.38);

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		String userEmail = "";

		if (req.getParameter("userValue") != null && req.getParameter("userValue").length() > 0) {
			userEmail = req.getParameter("userValue").toString().trim();
		}

		if (userEmail != null && !userEmail.isEmpty() && WebUtility.isHtml(userEmail)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		String videoName = "";
		if (req.getParameter("videoValue") != null && req.getParameter("videoValue").length() > 0) {
			videoName = req.getParameter("videoValue").toString().trim();
		}

		if (videoName != null && !videoName.isEmpty() && WebUtility.isHtml(videoName)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		int currentPage = 1;

		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}

		p.setPageNumber(currentPage);

		if (userEmail != null && userEmail.length() > 0) {
			p.setUserValue("%" + userEmail + "%");
		}

		if (videoName != null && videoName.length() > 0) {
			p.setVideoValue("%" + videoName + "%");
		}

		model.addAttribute("inputEmail", userEmail);
		model.addAttribute("inputVideo", videoName);

		Long count = dataService.countConsumerProcess(p, (UserDto) userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		List<ConsumerProcessDto> consumerProcessList = dataService.findConsumerProcess(p, (UserDto) userDto);

		model.addAttribute("consumerProcessList", consumerProcessList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		return "consumerprocess";
	}

	@PostMapping("/playevents")
	public String playEventsPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Pagination p = new Pagination();

		this.setGridHeight(p, req, 0.60);

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		String userEmail = "";

		if (req.getParameter("userValue") != null && req.getParameter("userValue").length() > 0) {
			userEmail = req.getParameter("userValue").toString().trim();
		}

		if (userEmail != null && !userEmail.isEmpty() && WebUtility.isHtml(userEmail)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		String videoName = "";
		if (req.getParameter("videoValue") != null && req.getParameter("videoValue").length() > 0) {
			videoName = req.getParameter("videoValue").toString().trim();
		}

		if (videoName != null && !videoName.isEmpty() && WebUtility.isHtml(videoName)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		int currentPage = 1;

		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}

		p.setPageNumber(currentPage);

		if (userEmail != null && userEmail.length() > 0) {
			p.setUserValue("%" + userEmail + "%");
		}

		if (videoName != null && videoName.length() > 0) {
			p.setVideoValue("%" + videoName + "%");
		}

		model.addAttribute("inputEmail", userEmail);
		model.addAttribute("inputVideo", videoName);

		Long count = dataService.countPlayEvents(p, (UserDto) userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		List<VideoPlayEventDto> playEventList = dataService.findPlayEvents(p, (UserDto) userDto);

		model.addAttribute("playEventList", playEventList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());
		if (playEventList != null && playEventList.size() > 0) {
			model.addAttribute("firstColoumnId", playEventList.get(0).getId());
		} else {
			model.addAttribute("firstColoumnId", "");
		}

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		List<VideoPlayEventDetailDto> playEventDetailList = new ArrayList<VideoPlayEventDetailDto>();

		if (playEventList != null && playEventList.size() > 0) {
			String playEventId = playEventList.get(0).getId();

			if (req.getParameter("playEventId") != null && !req.getParameter("playEventId").isEmpty()) {
				playEventId = req.getParameter("playEventId");

			}

			playEventDetailList = dataService.findPlayEventDetail(playEventId);
		}

		int dGridHeight = 200;
//		if (req.getParameter("gridHeight") != null && !req.getParameter("gridHeight").isEmpty()) {
//			Integer gridHeight = Integer.parseInt(req.getParameter("gridHeight"));
//			Double d = gridHeight * 0.65;
//			dGridHeight = gridHeight - d.intValue();
//		}
		int add = 0;
		if (playEventDetailList.size() < 30) {
			add = 30 - playEventDetailList.size();
		}

		model.addAttribute("playEventDetailList", playEventDetailList);
		model.addAttribute("dCount", playEventDetailList.size());
		model.addAttribute("dPageSize", (playEventDetailList.size() + add));
		model.addAttribute("dCurrentPage", 1);
		model.addAttribute("dGridHeight", dGridHeight);

		int dStartRecord = 0;
		model.addAttribute("dStartRecord", dStartRecord);

		return "playevents";
	}

	@PostMapping("/configuration")
	public String configurationPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		if ((req.getParameter("pCurrentPage") == null) || (req.getParameter("pvCurrentPage") == null) || (req.getParameter("gCurrentPage") == null)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isHtml(req.getParameter("gridProviderId"))) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("pCurrentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("gCurrentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("pvCurrentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		List<ProviderDto> providerDtoList = dataService.findActiveProviders((UserDto) userDto);

		String gridProviderId = "0";

		if (req.getParameter("gridProviderId") != null && req.getParameter("gridProviderId").length() > 0) {
			gridProviderId = req.getParameter("gridProviderId");
		}

		boolean pageChecking = this.getConfigurationResults(model, req, res, gridProviderId, (UserDto) userDto);
		if (pageChecking == true) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		model.addAttribute("gridProviderList", providerDtoList);

		model.addAttribute("providersSelect", providerDtoList);

		List<VideoMasterDto> videoMasterList = this.getConfigProviderVideos(model, "");

		model.addAttribute("videosSelect", videoMasterList);

		List<ConfigurationDto> items = WebUtility.getConfigSelectKeys();

		model.addAttribute("configSelect", items);

		return "configuration";
	}

//	@PostMapping("/saveConfiguration")
//	public String saveConfigurationKeys(@RequestBody ConfigParam configParam, Model model, HttpServletRequest req, HttpServletResponse res) {
//		boolean validation = WebUtility.isValidRequest(req, res);
//		if (!validation) {
//			model.addAttribute("message", "Invalid Request");
//			return "nodata";
//		}
//		this.init(model, req);
//
//		String msg = "";
//		// ConfigurationDto dtoReturned = null;
//
//		//String providerId = req.getParameter("providerParam");
//		//String configKey = req.getParameter("configKeyParam");
//		//String configValue = req.getParameter("configValueParam");
//		
//		String providerId = configParam.getProviderId();
//		String configKey = configParam.getConfigKey();
//		String configValue = configParam.getConfigValue();
//
//		if (providerId != null) {
//			providerId = providerId.trim();
//		}
//
//		if ((providerId == null || providerId.isEmpty())) {
//			model.addAttribute("message", "Invalid Request");
//			res.setStatus(HttpStatus.BAD_REQUEST.value());
//			return "nodata";
//		}
//
//		//String videoMasterId = req.getParameter("selectVideoParam");
//		String videoMasterId = configParam.getSelectVideo();
//		if (providerId != null && !providerId.isEmpty() && WebUtility.isHtml(providerId)) {
//			model.addAttribute("message", "Invalid Request");
//			res.setStatus(HttpStatus.BAD_REQUEST.value());
//			return "nodata";
//		}
//
//		if ((providerId != null && !providerId.isEmpty())) {
//			List<String> id = dataService.getproviderId(providerId);
//
//			if (id == null || id.isEmpty()) {
//				model.addAttribute("message", "Invalid Request");
//				res.setStatus(HttpStatus.BAD_REQUEST.value());
//				return "nodata";
//			}
//
//		}
//
//		if (videoMasterId != null && !videoMasterId.isEmpty() && WebUtility.isHtml(videoMasterId)) {
//			model.addAttribute("message", "Invalid Request");
//			res.setStatus(HttpStatus.BAD_REQUEST.value());
//			return "nodata";
//		}
//
//		if (videoMasterId != null && !videoMasterId.isEmpty()) {
//			List<String> masterId = dataService.getVideoMasterId(videoMasterId);
//
//			if (masterId == null || masterId.isEmpty()) {
//				model.addAttribute("message", "Invalid Request");
//				res.setStatus(HttpStatus.BAD_REQUEST.value());
//				return "nodata";
//			}
//
//		}
//		if (configValue != null && !configValue.isEmpty() && WebUtility.isHtml(configValue)) {
//			model.addAttribute("message", "Invalid Request");
//			res.setStatus(HttpStatus.BAD_REQUEST.value());
//			return "nodata";
//		}
//
//		if (providerId != null && configKey != "select a key" && configValue != "") {
//
//			String[] watermarkValues = { "Black", "Blue", "Cyan", "Gray", "Green", "Magenta", "Orange", "Pink", "Red", "White", "Yellow" };
//			boolean existWaterMarkColor = false;
//			boolean booleanVal = false;
//			boolean numberVal = false;
//			boolean textVal = false;
//
//			if (configKey.equals("FullScreen") || configKey.equals("Mini-Player") || configKey.equals("PlayBackSpeed") || configKey.equals("Resolution") || configKey.equals("ShowLanguages") || configKey.equals("ShowTheaterMode") || configKey.equals("ShowVideoDescription")) {
//				if (configValue.equals("True") || configValue.equals("False")) {
//					booleanVal = true;
//				}
//			} else if (configKey.equals("InitialDelayTime") || configKey.equals("InitialFragmentsToActivemq") || configKey.equals("NextButtonShowTime") || configKey.equals("PlayerDelayTime") || configKey.equals("PlayFragmentsToActivemq") || configKey.equals("PreviousButtonShowTime") || configKey.equals("VideoDescriptionLength") || configKey.equals("VideoForwardSeconds") || configKey.equals("VideoPreviewImageSeconds") || configKey.equals("VideoRewindSeconds")) {
//				if (configValue.matches(".*[1-9].*") && !configValue.startsWith("0")) {
//					numberVal = true;
//				}
//			} else if (configKey.equals("NextButtonShowText") || configKey.equals("PreviousButtonShowText")) {
//				if (configValue.matches(".*[a-zA-z].*")) {
//					textVal = true;
//				}
//			} else if (configKey.equals("WatermarkColor")) {
//				for (String val : watermarkValues) {
//					if (configValue.equals(val)) {
//						existWaterMarkColor = true;
//						break;
//					}
//				}
//			}
//
//			if (configKey.equals("VideoPreviewImageSeconds")) {
//				if (videoMasterId != null && videoMasterId.length() > 0) {
//					model.addAttribute("message", "Invalid Request");
//					res.setStatus(HttpStatus.BAD_REQUEST.value());
//					return "nodata";
//				}
//			}
//			if ((booleanVal || numberVal || textVal || existWaterMarkColor)) {
//				if (videoMasterId != null && videoMasterId.length() > 0) {
//
//					ConfigurationVideoDto dto = new ConfigurationVideoDto();
//					dto.setProviderId(providerId);
//					dto.setVideoMasterId(videoMasterId);
//					dto.setConfigKey(configKey);
//					dto.setConfigValue(configValue);
//
//					Date current = new Date();
//					dto.setCreatedDate(current);
//					dto.setUpdatedDate(current);
//
//					msg = dataService.saveProviderVideoConfigKey(dto);
//				} else {
//					ConfigurationDto dto = new ConfigurationDto();
//					dto.setProviderId(providerId);
//					dto.setConfigKey(configKey);
//					dto.setConfigValue(configValue);
//
//					Date current = new Date();
//					dto.setCreatedDate(current);
//					dto.setUpdatedDate(current);
//					msg = dataService.saveProviderConfigKey(dto);
//				}
//			} else {
//				model.addAttribute("message", "Invalid Request");
//				res.setStatus(HttpStatus.BAD_REQUEST.value());
//				return "nodata";
//			}
//		}
//
//		model.addAttribute("message", msg);
//
//		List<ProviderDto> providerDtoList = dataService.findActiveProviders();
//
//		String gridProviderId = providerDtoList.get(0).getId();
//
//		if (req.getParameter("gridProviderId") != null && req.getParameter("gridProviderId").length() > 0) {
//			gridProviderId = req.getParameter("gridProviderId");
//		}
//
//		this.getConfigurationResults(model, req, res, gridProviderId);
//
//		this.getGridProviders(model, providerDtoList, gridProviderId);
//
//		model.addAttribute("gridProviderList", providerDtoList);
//
//		model.addAttribute("providersSelect", providerDtoList);
//
//		List<VideoMasterDto> videoMasterList = this.getConfigProviderVideos(model, "");
//
//		model.addAttribute("videosSelect", videoMasterList);
//
//		List<ConfigurationDto> items = WebUtility.getConfigSelectKeys();
//
//		model.addAttribute("configSelect", items);
//
//		return "configuration";
//	}

	@PostMapping("/upload")
	public String uploadPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		List<ProviderDto> providerDtoList = dataService.findAllProviders((UserDto) userDto);
//		if (providerDtoList != null && providerDtoList.isEmpty() == false) {
//			String events = WebUtility.getSelectEvents(null);
//
//			StringBuffer sb = new StringBuffer();
//
//			sb.append("<select class=\"selectProviderName\" id=\"providerName\" " + events + ">");
//			sb.append("<option disabled selected >Select Provider</option>");
//			if (providerDtoList != null && providerDtoList.isEmpty() == false) {
//
//				for (int i = 0; i < providerDtoList.size(); i++) {
//					ProviderDto dto = providerDtoList.get(i);
//					String label = dto.getProviderName();
//
//					sb.append("<option onclick=\"dropClick()\" id=\"" + dto.getId() + "\" value=\"" + dto.getProviderName() + "\">" + label + "</option>");
//				}
//			}
//			sb.append("</select >");
//			model.addAttribute("providerList", sb.toString());
//		}

		model.addAttribute("providerList", providerDtoList);
		model.addAttribute("serverDateTime", validater.getServerDateTime());
		return "uploadform";
	}

	@PostMapping("/thumbnailUpload")
	public String thumbnailUploadPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		List<ProviderDto> providerDtoList = dataService.findActiveProviders((UserDto) userDto);

		model.addAttribute("providerList", providerDtoList);

		model.addAttribute("videosSelect", new ArrayList<VideoMasterDto>());

		return "thumbnailupload";
	}

	private void init(Model model, HttpServletRequest req, UserDto userDto) {

		String baseurl = webUtil.getBasePath(req);

		model.addAttribute("baseurl", baseurl);

		WebUtility.getMenuItems(model, baseurl, userDto, req);

		String userEmail = ((UserDto) userDto).getUserEmail();
		model.addAttribute("userEmail", userEmail);

	}

	private String aspectRatios(Model model, HttpServletRequest req, HttpServletResponse res, UserDto userDto) {

		Pagination p = new Pagination();

		this.setGridHeight(p, req, 0.35);

		int currentPage = 1;

		String inputValue = null;

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}

		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0 && WebUtility.isHtml(req.getParameter("providerValue"))) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0) {
			inputValue = req.getParameter("providerValue").toString().trim();
			p.setProviderValue("%" + inputValue + "%");

		}

		p.setPageNumber(currentPage);
		// p.setPageSize(2);

		Long count = dataService.countAspectRatios(p, userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}

		}

		List<ProviderDto> providerList = dataService.findAllProviders(userDto);

		model.addAttribute("providerList", providerList);

		List<AspectRatioKeyDto> dtoList = dataService.findAspectRatioKeys(null);

		HashMap<String, List<AspectRatioKeyDto>> keyMap = new HashMap<String, List<AspectRatioKeyDto>>();

		List<AspectRatioKeyDto> items;

		for (AspectRatioKeyDto dto : dtoList) {

			if (keyMap.containsKey(dto.getAspectRatio())) {
				items = keyMap.get(dto.getAspectRatio());
			} else {
				items = new ArrayList<AspectRatioKeyDto>();
			}

			items.add(dto);

			keyMap.put(dto.getAspectRatio(), items);

		}

		List<AspectRatioKeysDto> keys = new ArrayList<AspectRatioKeysDto>();

		for (String key : keyMap.keySet()) {
			AspectRatioKeysDto obj = new AspectRatioKeysDto();
			obj.setAspectRatio(key);
			obj.setItems(keyMap.get(key));
			keys.add(obj);
		}

		model.addAttribute("aspectRatioSelect", keys);
		model.addAttribute("aspectRatioWidthHeightSelect", keys.get(0).getItems());

		List<AspectRatioDto> aspectRatioDtoList = dataService.findAspectRatios(p, userDto);

		model.addAttribute("apectRatioList", aspectRatioDtoList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		return "aspectratios";
	}

//	private void providersList(Model model, List<ProviderDto> providerDtoList) {
//
//		String events = WebUtility.getSelectEvents("configProviderChange(this)");
//
//		StringBuffer sb = new StringBuffer();
//
//		sb.append("<select class=\"providerConfig\" id=\"selectProvider\" " + events + ">");
//		sb.append("<option disabled selected value=\"\" >Select Provider</option>");
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
//		model.addAttribute("providerList", sb.toString());
//
//	}

	private List<VideoMasterDto> getConfigProviderVideos(Model model, String providerId) {
		List<VideoMasterDto> videoMasterList = new ArrayList<VideoMasterDto>();

		if (providerId != "") {

			videoMasterList = dataService.findAllActiveMaster(providerId);

		}

		// String html = WebUtility.getConfigProviderVideos(videoMasterList, 200);

		// model.addAttribute("videoSelect", html);
		return videoMasterList;
	}

	private boolean getConfigurationResults(Model model, HttpServletRequest req, HttpServletResponse res, String providerId, UserDto userDto) {
		boolean pageChecking = false;
		Pagination gp = new Pagination();
		this.setGridHeight(gp, req, 0.82);

		int globalCurrentPage = 1;

		if (req.getParameter("gCurrentPage") != null && req.getParameter("gCurrentPage").length() > 0) {
			globalCurrentPage = Integer.parseInt(req.getParameter("gCurrentPage"));
		}

		gp.setPageNumber(globalCurrentPage);

		Long gCount = dataService.countGlobalConfigKeys();

		int intPages = Utility.getPages(gCount.intValue(), gp.getPageSize());
		if (intPages != 0) {
			if (globalCurrentPage > intPages) {
				pageChecking = true;
			}
		}

		List<GlobalConfigurationDto> globalKeysList = dataService.findAllGlobalConfigKeys(gp);

		Pagination pp = new Pagination();
		this.setGridHeight(pp, req, 0.82);
		int providerCurrentPage = 1;

		if (req.getParameter("pCurrentPage") != null && req.getParameter("pCurrentPage").length() > 0) {
			providerCurrentPage = Integer.parseInt(req.getParameter("pCurrentPage"));
		}
		pp.setPageNumber(providerCurrentPage);

		Long pCount = dataService.countProviderConfigKeys();

		int intproviderPages = Utility.getPages(pCount.intValue(), pp.getPageSize());
		if (intproviderPages != 0) {
			if (providerCurrentPage > intproviderPages) {
				pageChecking = true;
			}
		}

		List<ConfigurationDto> KeysList = dataService.findAllConfigKeys(pp, userDto);

		Pagination pv = new Pagination();
		this.setGridHeight(pv, req, 0.82);
		int providerVideoCurrentPage = 1;

		if (req.getParameter("pvCurrentPage") != null && req.getParameter("pvCurrentPage").length() > 0) {
			providerVideoCurrentPage = Integer.parseInt(req.getParameter("pvCurrentPage"));
		}
		pv.setPageNumber(providerVideoCurrentPage);
		pv.setProviderId(providerId);

		Long pvCount = dataService.countProviderVideoConfigKeys(pv);

		int intproviderVideoPages = Utility.getPages(pvCount.intValue(), pv.getPageSize());
		if (intproviderVideoPages != 0) {
			if (providerVideoCurrentPage > intproviderVideoPages) {
				pageChecking = true;
			}
		}

		List<ConfigurationVideoDto> pvKeysList = dataService.findAllVideoConfigKeys(pv);

		model.addAttribute("gCount", gCount);
		model.addAttribute("gConfigKeys", globalKeysList);
		model.addAttribute("gPageSize", gp.getPageSize());
		model.addAttribute("gCurrentPage", globalCurrentPage);
		model.addAttribute("gGridHeight", gp.getGridHeight());

		int gStartRecord = (gp.getPageNumber() - 1) * gp.getPageSize();
		model.addAttribute("gStartRecord", gStartRecord);

		model.addAttribute("pCount", pCount);
		model.addAttribute("pConfigKeys", KeysList);
		model.addAttribute("pPageSize", pp.getPageSize());
		model.addAttribute("pCurrentPage", providerCurrentPage);
		model.addAttribute("pGridHeight", pp.getGridHeight());
		int pStartRecord = (pp.getPageNumber() - 1) * pp.getPageSize();
		model.addAttribute("pStartRecord", pStartRecord);

		model.addAttribute("pvCount", pvCount);
		model.addAttribute("pvConfigKeys", pvKeysList);
		model.addAttribute("pvPageSize", pv.getPageSize());
		model.addAttribute("pvCurrentPage", providerVideoCurrentPage);
		model.addAttribute("pvGridHeight", pv.getGridHeight());
		int pvStartRecord = (pv.getPageNumber() - 1) * pv.getPageSize();
		model.addAttribute("pvStartRecord", pvStartRecord);
		return pageChecking;

	}

	private boolean validateInput(String providerId, String videoId, String showWaterMark, String userToken, String sessionIncrement) {

		if (Utility.isHtml(providerId)) {
			return false;
		}

		if (Utility.isHtml(videoId)) {
			return false;
		}

		if (Utility.isHtml(showWaterMark)) {
			return false;
		}

		if (Utility.isHtml(userToken)) {
			return false;
		}

		if (Utility.isShowWaterMark(showWaterMark) == false) {
			return false;
		}

		if (Utility.isSessionIncrement(sessionIncrement) == false) {
			return false;
		}

		return true;
	}

	@PostMapping("/delete")
	public String deleteVideosProcess(Model model, HttpServletRequest req, HttpServletResponse res) {

		String videoMasterIds = req.getParameter("videoMasterIds");

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (videoMasterIds != null && !videoMasterIds.isEmpty() && WebUtility.isHtml(videoMasterIds)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}
		if (req.getParameter("inputValue") != null && req.getParameter("inputValue").length() > 0 && WebUtility.isHtml(req.getParameter("inputValue"))) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}
		if (videoMasterIds != null) {

			String[] ids = videoMasterIds.split(",");
			List<String> selectVideoMasterIds = new ArrayList<String>();
			List<String> selectDeleteNames = new ArrayList<String>();

			for (String videoId : ids) {
				List<String> masterId = dataService.getVideoMasterId(videoId);

				if (masterId == null || masterId.isEmpty()) {
					model.addAttribute("message", "Invalid Request");
					res.setStatus(HttpStatus.UNAUTHORIZED.value());
					return "nodata";
				}

				VideoMasterDto masterDto = dataService.findMaster(videoId);
				if (masterDto != null) {
					String selectedVideoNames = masterDto.getVideoName();
					selectDeleteNames.add(selectedVideoNames);
					selectVideoMasterIds.add(videoId);
					dataService.deleteProcess(selectVideoMasterIds);
					model.addAttribute("message", selectDeleteNames.toString().replaceAll("\\[|\\]", "") + " has been deleted");

				}

			}

		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		Pagination p = new Pagination();
		this.setGridHeight(p, req, 0.38);
		int currentPage = 1;
		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}

		String inputVal = "";
		if (req.getParameter("providerValue") != null && req.getParameter("providerValue").length() > 0) {
			inputVal = req.getParameter("providerValue").toString().trim();
			p.setProviderValue("%" + inputVal + "%");
		}

		model.addAttribute("inputProvider", inputVal);

		p.setPageNumber(currentPage);

		Long count = dataService.countActiveVideos(p, (UserDto) userDto);
		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		List<VideoMasterDto> videoMasterDtoList = dataService.findActiveVideos(p, (UserDto) userDto);

		model.addAttribute("activeVideoMasterList", videoMasterDtoList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		return "deleteform";
	}

	private void setGridHeight(Pagination p, HttpServletRequest req, double percent) {
		if (req.getParameter("gridHeight") != null && !req.getParameter("gridHeight").isEmpty()) {
			Integer gridHeight = Integer.parseInt(req.getParameter("gridHeight"));
			Double d = gridHeight * percent;
			p.setGridHeight(gridHeight - d.intValue());
		}
	}

	@PostMapping("/providerConfig")
	public String providerConfigPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);

		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("pCurrentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		Pagination pp = new Pagination();
		this.setGridHeight(pp, req, 0.82);
		int providerCurrentPage = 1;

		if (req.getParameter("pCurrentPage") != null && req.getParameter("pCurrentPage").length() > 0) {
			providerCurrentPage = Integer.parseInt(req.getParameter("pCurrentPage"));
		}
		pp.setPageNumber(providerCurrentPage);

		Long pCount = dataService.countProviderConfigKeys();

		int intproviderPages = Utility.getPages(pCount.intValue(), pp.getPageSize());
		if (intproviderPages != 0) {
			if (providerCurrentPage > intproviderPages) {
				model.addAttribute("message", "Invalid Request");
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				return "nodata";

			}
		}

		List<ConfigurationDto> KeysList = dataService.findAllConfigKeys(pp, (UserDto) userDto);

		model.addAttribute("pCount", pCount);
		model.addAttribute("pConfigKeys", KeysList);
		model.addAttribute("pPageSize", pp.getPageSize());
		model.addAttribute("pCurrentPage", providerCurrentPage);
		model.addAttribute("pGridHeight", pp.getGridHeight());
		int pStartRecord = (pp.getPageNumber() - 1) * pp.getPageSize();
		model.addAttribute("pStartRecord", pStartRecord);

		return "providerconfig";
	}

	@PostMapping("/providerVideosKeysSearch")
	public String providerVideosKeysSearch(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);

		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("pvCurrentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		Pagination pv = new Pagination();
		this.setGridHeight(pv, req, 0.82);
		int providerVideoCurrentPage = 1;
		String providerId = null;

		if (req.getParameter("pvCurrentPage") != null && req.getParameter("pvCurrentPage").length() > 0) {
			providerVideoCurrentPage = Integer.parseInt(req.getParameter("pvCurrentPage"));
		}
		if (req.getParameter("gridProviderId") != null && req.getParameter("gridProviderId").length() > 0) {
			providerId = req.getParameter("gridProviderId");
		}
		pv.setPageNumber(providerVideoCurrentPage);
		pv.setProviderId(providerId);

		Long pvCount = dataService.countProviderVideoConfigKeys(pv);

		int intproviderVideoPages = Utility.getPages(pvCount.intValue(), pv.getPageSize());
		if (intproviderVideoPages != 0) {
			if (providerVideoCurrentPage > intproviderVideoPages) {
				model.addAttribute("message", "Invalid Request");
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				return "nodata";
			}
		}

		List<ConfigurationVideoDto> pvKeysList = dataService.findAllVideoConfigKeys(pv);

		model.addAttribute("pvCount", pvCount);
		model.addAttribute("pvConfigKeys", pvKeysList);
		model.addAttribute("pvPageSize", pv.getPageSize());
		model.addAttribute("pvCurrentPage", providerVideoCurrentPage);
		model.addAttribute("pvGridHeight", pv.getGridHeight());
		int pvStartRecord = (pv.getPageNumber() - 1) * pv.getPageSize();
		model.addAttribute("pvStartRecord", pvStartRecord);

		return "providervideosconfig";
	}

	@PostMapping("/getUserDetails")
	public String getUserDetailsPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);

		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		Pagination p = new Pagination();
		this.setGridHeight(p, req, 0.38);

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);
		String userEmail = "";
		if (req.getParameter("userValue") != null && req.getParameter("userValue").length() > 0) {
			userEmail = req.getParameter("userValue").toString().trim();
		}

		if (userEmail != null && !userEmail.isEmpty() && WebUtility.isHtml(userEmail)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		int currentPage = 1;
		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}
		p.setPageNumber(currentPage);

		if (userEmail != null && userEmail.length() > 0) {
			p.setUserValue("%" + userEmail + "%");
		}

		Long count = dataService.countUsers(p, (UserDto) userDto);
		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		List<ProviderDto> providerList = dataService.findAllProviders((UserDto) userDto);

		model.addAttribute("providerList", providerList);

		List<RoleDto> rolesList = dataService.findProviderUserRoles();

		model.addAttribute("rolesList", rolesList);

		List<UserDto> userDetails = dataService.findUsers(p, (UserDto) userDto);
		model.addAttribute("inputEmail", userEmail);
		model.addAttribute("userDetails", userDetails);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());
		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		return "userDataForm";
	}

	@PostMapping("/videoAnalysis")
	public String videoAnalysisPost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);

		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(req.getParameter("currentPage")) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		String userEmail = "";

		if (req.getParameter("userValue") != null && req.getParameter("userValue").length() > 0) {
			userEmail = req.getParameter("userValue").toString().trim();
		}

		if (userEmail != null && !userEmail.isEmpty() && WebUtility.isHtml(userEmail)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		String videoName = "";
		if (req.getParameter("videoValue") != null && req.getParameter("videoValue").length() > 0) {
			videoName = req.getParameter("videoValue").toString().trim();
		}

		if (videoName != null && !videoName.isEmpty() && WebUtility.isHtml(videoName)) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		Pagination p = new Pagination();

		this.setGridHeight(p, req, 0.65);

		List<ProviderDto> providerList = new ArrayList<ProviderDto>();
		List<VideoMasterDto> videoMasterList = new ArrayList<VideoMasterDto>();

		providerList = dataService.findAllProviders((UserDto) userDto);

		if (providerList != null && providerList.size() > 0) {
			videoMasterList = dataService.findAllActiveMaster(providerList.get(0).getId());
		}

		model.addAttribute("providerSelect", providerList);
		model.addAttribute("videoSelect", videoMasterList);

		int currentPage = 1;

		if (req.getParameter("currentPage") != null && req.getParameter("currentPage").length() > 0) {
			currentPage = Integer.parseInt(req.getParameter("currentPage"));
		}

		p.setPageNumber(currentPage);

		if (userEmail != null && userEmail.length() > 0) {
			p.setUserValue("%" + userEmail + "%");
		}

		if (videoName != null && videoName.length() > 0) {
			p.setVideoValue("%" + videoName + "%");
		}

		model.addAttribute("inputEmail", userEmail);
		model.addAttribute("inputVideo", videoName);

		Long count = dataService.countVideoAnalysis(p);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		List<VideoAnalysisDto> dtoList = dataService.findVideoAnalysis(p);

		model.addAttribute("videoAnalysisList", dtoList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		return "videoanalysis";
	}

	@PostMapping("/userimpersonate")
	public String userImpersonatePost(Model model, HttpServletRequest req, HttpServletResponse res) {

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		String message = req.getParameter("message");
		if (message != null && WebUtility.isHtml(message)) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		List<ProviderDto> providerList = dataService.findAllUserProviders((UserDto) userDto);

		List<UserDto> userList = new ArrayList<UserDto>();// dataService.findProviderUsers(providerList.get(0).getId());

		model.addAttribute("providerList", providerList);
		model.addAttribute("userList", userList);

		return "userimpersonate";
	}

	@PostMapping("/authFailures")
	public String authFailuresPOst(Model model, HttpServletRequest req, HttpServletResponse res) {

		List<PlayerRequestDto> playerRequestDtoList = null;
		Long count = (long) 0;

		Pagination p = new Pagination();
		this.setGridHeight(p, req, 0.38);
		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			model.addAttribute("message", "Invalid Request");
			return "nodata";
		}

		String page = req.getParameter("currentPage");
		if (page == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		if (WebUtility.isValidCurrentPage(page) == false) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		Object userDto = req.getSession().getAttribute("userDto");
		if (userDto == null) {
			model.addAttribute("message", "Invalid Request");
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "nodata";
		}

		this.init(model, req, (UserDto) userDto);

		int currentPage = 1;
		if (page != null && page.length() > 0) {
			currentPage = Integer.parseInt(page);
		}
		p.setPageNumber(currentPage);

		count = dataService.countAuthFailures(p, (UserDto) userDto);

		int intPages = Utility.getPages(count.intValue(), p.getPageSize());
		if (intPages != 0) {
			if (currentPage > intPages) {
				res.setStatus(HttpStatus.UNAUTHORIZED.value());
				model.addAttribute("message", "Invalid Request");
				return "nodata";
			}
		}

		playerRequestDtoList = dataService.findAuthFailures(p, (UserDto) userDto);

		model.addAttribute("authFailuresList", playerRequestDtoList);
		model.addAttribute("count", count);
		model.addAttribute("pageSize", p.getPageSize());
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("gridHeight", p.getGridHeight());

		int startRecord = (p.getPageNumber() - 1) * p.getPageSize();
		model.addAttribute("startRecord", startRecord);

		return "authfailures";
	}

}
