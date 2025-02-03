package com.app.rest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.net.ssl.TrustManagerFactory;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.app.comp.JwtHelper;
import com.app.comp.Validater;
import com.app.comp.WebUtil;
import com.app.controller.CustomException;
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
import com.app.data.dto.VideoDetailProgressDto;
import com.app.data.dto.VideoDetailUserDto;
import com.app.data.dto.VideoMasterDto;
import com.app.data.dto.VideoPlayEventDetailDto;
import com.app.data.dto.VideoPlayEventDto;
import com.app.data.http.PlayerApiResponse;
import com.app.data.http.SaveAspectRequestAdmin;
import com.app.data.http.SaveUserRequestAdmin;
import com.app.data.http.UpdateUserRequest;
import com.app.data.http.UpdateVideoRequest;
import com.app.data.http.UploadRequest;
import com.app.data.http.UploadThumbnailRequest;
import com.app.data.http.UserTokenRequest;
import com.app.data.service.DataService;
import com.app.data.util.Constants;
import com.app.http.CommonPayloadRequest;
import com.app.http.UsersRequest;
import com.app.http.UsersResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class PlayerReactapiController {

	private final static Logger logger = LogManager.getLogger(JwtHelper.class);

	@Value("${playerapiUrl}")
	private String playerapiUrl;

	@Value("${playerUrl}")
	private String playerUrl;

	@Value("${videoSchedular.hotFolder}")
	private String hotFolder;

	@Autowired
	private DataService dataService;

	@Autowired
	private JwtHelper jwtHelper;

	@Autowired
	private Validater validater;

	@Autowired
	private WebUtil webUtil;

	private WebClient _webClient;

	private WebClient getWebClient() throws IOException, KeyStoreException, NoSuchAlgorithmException, CertificateException {
		if (this._webClient == null) {
			TrustManagerFactory trustManagerFactory = InsecureTrustManagerFactory.INSTANCE;
			SslContext sslContext = SslContextBuilder.forClient().trustManager(trustManagerFactory).build();

			reactor.netty.http.client.HttpClient hc = reactor.netty.http.client.HttpClient.create().secure(t -> t.sslContext(sslContext).handshakeTimeout(Duration.ofSeconds(120)));
			ReactorClientHttpConnector rchc = new ReactorClientHttpConnector(hc);

			this._webClient = WebClient.builder().clientConnector(rchc).build();
		}
		return this._webClient;
	}

// .........userLoginProcess........//
	@CrossOrigin
	@PostMapping("/userLogin")
	@ResponseBody
	public ResponseEntity<?> userLoginProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);
			List<UserDto> userDtos = dataService.findUserByEmail(userRequest.getEmail());
			if (userDtos == null || userDtos.size() == 0) {
				apiResponse.setMessage("Invalid Payload.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
			}

			UserDto userDto = null;
			for (UserDto dto : userDtos) {
				if (dto.getPassword().equalsIgnoreCase(userRequest.getPassword())) {
					userDto = dto;
				}
			}

			if (userDto == null) {
				apiResponse.setMessage("Invalid Payload.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
			}

			if (userDto.getActive().equalsIgnoreCase("false")) {
				apiResponse.setMessage("Invalid Payload.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
			}

			request.getSession().setAttribute("userDto", userDto);

			UsersResponse payloadResponse = new UsersResponse();
			payloadResponse.setUserRole(userDto.getRole());
			payloadResponse.setUserId(userDto.getId());
			return ResponseEntity.ok(payloadResponse);

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
	}

	@CrossOrigin
	@PostMapping("/userTokenVideos")
	@ResponseBody
	public ResponseEntity<?> userTokenVideosProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			List<ProviderDto> providerList = new ArrayList<ProviderDto>();
			List<VideoMasterDto> videoMasterList = new ArrayList<VideoMasterDto>();

			String userId = userRequest.getUserID();

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			if (userId != null) {
				providerList = dataService.findUserProviders(userDto);

				if (providerList != null && providerList.size() > 0) {
					videoMasterList = dataService.findUserVideos(providerList.get(0).getId(), userDto);
				}
			}

			if (providerList == null || providerList.size() == 0) {
				apiResponse.setMessage("You do not have any videos assigned to you.");
				return ResponseEntity.ok(apiResponse);

			}
			if (videoMasterList == null || videoMasterList.size() == 0) {
				apiResponse.setMessage("You do not have any videos assigned to you.");
				return ResponseEntity.ok(apiResponse);

			} else {
				return ResponseEntity.ok(videoMasterList);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
	}

//............Get AspectRatios Details............//
	@CrossOrigin
	@PostMapping("/aspectRatios")
	@ResponseBody
	public ResponseEntity<?> aspectRatiosProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<AspectRatioDto> aspectRatiosList = dataService.getAspectRatios(userDto);
			if (aspectRatiosList != null && !aspectRatiosList.isEmpty()) {
				return ResponseEntity.ok(aspectRatiosList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/aspectRatioKeys")
	@ResponseBody
	public ResponseEntity<?> aspectRatioKeysProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			// UsersRequest userRequest = this.decryptedPayloadProcess(payload);

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

			return ResponseEntity.ok(keys);

//			if (dtoList != null && !dtoList.isEmpty()) {
//				return ResponseEntity.ok(dtoList);
//			} else {
//				apiResponse.setMessage("No data available.");
//				apiResponse.setStatus("Failed");
//				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
//			}

//		} catch (CustomException e) {
//			logger.error("Error processing payload: {}", e.getMessage());
//			apiResponse.setMessage(e.getMessage());
//			apiResponse.setStatus("Failed");
//			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/aspectRatioSave")
	@ResponseBody
	public ResponseEntity<?> aspectRatioSaveProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");
		try {

			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			ProviderDto providerDto = dataService.findProvider(userRequest.getProviderName());

			if (providerDto == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerDto.getId());

			if (providerTokenDto == null) {
				validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			} else {

				String url = playerapiUrl + "/" + Constants.playerapi.saveaspectratio;

				SaveAspectRequestAdmin sar = new SaveAspectRequestAdmin();
				sar.setId(userRequest.getId());
				sar.setProviderName(userRequest.getProviderName());
				sar.setAspectRatio(userRequest.getAspectRatio());
				sar.setWidth(userRequest.getWidth());
				sar.setHeight(userRequest.getHeight());
				sar.setVideoBitrate(userRequest.getVideoBitrate());
				sar.setAudioBitrate(userRequest.getAudioBitrate());

				String bodyPayload = new ObjectMapper().writeValueAsString(sar);

				PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).bodyValue(bodyPayload).retrieve().bodyToMono(PlayerApiResponse.class).block();

				if (responseBody != null) {
					processResponse.setMessage(responseBody.getMessage());
					if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
						processResponse.setStatus("Failed");
						return ResponseEntity.badRequest().body(processResponse);
					}
				}

			}

		} catch (WebClientResponseException we) {
			logger.error(we);

			processResponse.setStatus("Failed");
			processResponse.setMessage("Failed to process ");
			String body = we.getResponseBodyAsString();
			if (body != null && body.contains("Failed")) {
				PlayerApiResponse ur = we.getResponseBodyAs(PlayerApiResponse.class);
				validater.setFailedMessage(processResponse, ur.getMessage(), startTime);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception ex) {
			logger.error(ex);
			validater.setFailedMessage(processResponse, "Failed to process", startTime);
		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

//.............Get ConsumerProcess Details.........//
	@CrossOrigin
	@PostMapping("/consumerProcess")
	@ResponseBody
	public ResponseEntity<?> consumerProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<ConsumerProcessDto> consumerProcessList = dataService.getconsumerProcess(userDto);
			if (consumerProcessList != null && !consumerProcessList.isEmpty()) {
				return ResponseEntity.ok(consumerProcessList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

// ..............deleteVideos process........//
	@CrossOrigin
	@PostMapping("/delete")
	@ResponseBody
	public ResponseEntity<?> deleteProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<VideoMasterDto> activeVideosList = dataService.getAllActiveVideos(userDto);
			if (activeVideosList != null && !activeVideosList.isEmpty()) {
				return ResponseEntity.ok(activeVideosList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/deleteVideos")
	@ResponseBody
	public ResponseEntity<?> deleteVideosProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			String videoMasterIds = userRequest.getSelectedIds();

			String[] ids = videoMasterIds.split(",");
			List<String> selectVideoMasterIds = new ArrayList<>();
			List<String> selectDeleteNames = new ArrayList<>();

			for (String videoId : ids) {
				List<String> masterId = dataService.getVideoMasterId(videoId);

				if (masterId == null || masterId.isEmpty()) {
					apiResponse.setMessage("Invalid Request");
					apiResponse.setStatus("Failed");
					return ResponseEntity.badRequest().body(apiResponse);
				}

				List<VideoMasterDto> masterDto = dataService.findMasterId(videoId);
				if (masterDto != null) {
					for (VideoMasterDto videoMasterDto : masterDto) {
						String selectedVideoName = videoMasterDto.getVideoName();
						selectDeleteNames.add(selectedVideoName);
						selectVideoMasterIds.add(videoId);
						dataService.deleteVideoProcess(selectVideoMasterIds);
						apiResponse.setMessage(String.format("%s has been deleted successfully.", selectedVideoName));
					}
				} else {
					apiResponse.setMessage("The selected record has already been deleted.");
					apiResponse.setStatus("Failed");
					return ResponseEntity.badRequest().body(apiResponse);
				}
			}
			return ResponseEntity.ok(apiResponse);
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
	}

//..............All PlayerRequests Process........//
	@CrossOrigin
	@PostMapping("/allPlayerRequests")
	@ResponseBody
	public ResponseEntity<?> allPlayerRequestsProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<PlayerRequestDto> allPlayerRequestsList = dataService.getPlayerRequests(userDto);
			if (allPlayerRequestsList != null && !allPlayerRequestsList.isEmpty()) {
				return ResponseEntity.ok(allPlayerRequestsList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

//...........Get VideoPlayEvents List.........//
	@CrossOrigin
	@PostMapping("/videoPlayevents")
	@ResponseBody
	public ResponseEntity<?> videoPlayeventsProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<VideoPlayEventDto> playEventsList = dataService.findPlayEvents(userDto);
			if (playEventsList != null && playEventsList.size() > 0) {
				return ResponseEntity.ok(playEventsList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/videoPlayDetails")
	@ResponseBody
	public ResponseEntity<?> videoPlayDetailsProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {

			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			String playEventId = userRequest.getSelectedRowID();

			if (playEventId == null || playEventId.trim().isEmpty()) {
				apiResponse.setMessage("Play event ID is required.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			// Fetch the play event details
			List<VideoPlayEventDetailDto> playEventDetailList = dataService.findPlayEventDetail(playEventId);
			if (playEventDetailList != null && !playEventDetailList.isEmpty()) {
				return ResponseEntity.ok(playEventDetailList);
			} else {
				apiResponse.setMessage("No details found for the specified play event ID.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

//...........Get VideosPlaybackInformation.........//
	@CrossOrigin
	@PostMapping("/videoDetailProgress")
	@ResponseBody
	public ResponseEntity<?> videoDetailProgressProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}
			List<VideoDetailProgressDto> videosProgressList = dataService.findVideosProgress(userDto);
			if (videosProgressList != null && videosProgressList.size() > 0) {
				return ResponseEntity.ok(videosProgressList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/videoDetailUser")
	@ResponseBody
	public ResponseEntity<?> videoDetailUserProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);
			String videoDetailProgressId = userRequest.getSelectedRowID();

			List<VideoDetailUserDto> videoDetailUserList = dataService.findVideoDetailUser(videoDetailProgressId);
			if (videoDetailUserList != null && videoDetailUserList.size() > 0) {
				return ResponseEntity.ok(videoDetailUserList);
			} else {
				apiResponse.setMessage("No details found for the specified play event ID.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
	}

// .........Get The Providers Details.........//

	@CrossOrigin
	@PostMapping("/providers")
	@ResponseBody
	public ResponseEntity<?> providersProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<ProviderTokenDto> providersTokenList = dataService.providerTokens(userDto);
			if (providersTokenList != null && providersTokenList.size() > 0) {
				return ResponseEntity.ok(providersTokenList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/deleteProvider")
	@ResponseBody
	public ResponseEntity<?> deleteProviderProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		UsersRequest userRequest = this.decryptedPayloadProcess(payload);

		String providerTokenId = userRequest.getSelectedIds();

		if (providerTokenId != null && providerTokenId.length() > 0) {
			if (webUtil.isHtml(providerTokenId)) {
				apiResponse.setStatus("Failed");
				apiResponse.setMessage("Invalid Request");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
			} else {
				ProviderTokenDto dto = dataService.getProviderTokenById(providerTokenId);
				if (dto != null) {

					Date current = new Date();
					dto.setDeleted(true);
					dto.setUpdatedDate(current);

					dataService.deleteProviderTokens(dto);
					apiResponse.setMessage("Successfully Deleted Provider Token  for " + dto.getProviderName());

				} else {
					apiResponse.setMessage("Invalid Request");
					apiResponse.setStatus("Failed");
					return ResponseEntity.badRequest().body(apiResponse);
				}

			}
		}
		return ResponseEntity.ok(apiResponse);
	}

	@CrossOrigin
	@PostMapping("/saveProviders")
	@ResponseBody
	public ResponseEntity<?> saveProvidersProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);

			String providerName = usersRequest.getProviderName();

			if (providerName != null && providerName.trim().length() > 0) {
				boolean process = true;
				if (webUtil.isHtml(providerName)) {
					apiResponse.setStatus("Failed");
					apiResponse.setMessage("Invalid Request.");
					process = false;
				}

				String modifiedProviderName = providerName.trim();

				if (modifiedProviderName.length() > 100) {

					apiResponse.setStatus("Failed");
					apiResponse.setMessage("Provider Name cannot be more than 100 characters");
					process = false;
				}

				if (process) {

					Date current = new Date();
					ProviderDto providerDto = new ProviderDto();
					providerDto.setProviderName(modifiedProviderName);
					providerDto.setCreatedDate(current);
					providerDto.setUpdatedDate(current);

					ProviderDto providerExisting = dataService.findProviders(modifiedProviderName);

					if (providerExisting != null) {
						apiResponse.setStatus("Failed");
						apiResponse.setMessage("Provider Name exists.");
					} else {

						dataService.addProviders(providerDto);
						apiResponse.setStatus("Success");
						apiResponse.setMessage("Successfully saved " + modifiedProviderName);
					}
				}

			} else {
				apiResponse.setStatus("Failed");
				apiResponse.setMessage("Provider Name is required.");

			}

			if (apiResponse.getStatus().equalsIgnoreCase("Failed")) {
				return ResponseEntity.badRequest().body(apiResponse);
			} else {
				return ResponseEntity.ok().body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@PostMapping("/saveProviderTokens")
	@ResponseBody
	public ResponseEntity<?> saveProviderTokensProcess(@RequestBody CommonPayloadRequest payloadRequest, HttpServletRequest req, HttpServletResponse res) throws Exception {

		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(req, res)) {
			processResponse.setMessage("Invalid Request");
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		}

		try {

			UsersRequest ptr = this.decryptedPayloadProcess(payloadRequest);

			boolean validation = webUtil.isValidRequest(req, res);
			if (!validation) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (ptr == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			String url = playerapiUrl + "/" + Constants.playerapi.getprovidertoken;

			String payload = new ObjectMapper().writeValueAsString(ptr);

			PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).bodyValue(payload).retrieve().bodyToMono(PlayerApiResponse.class).block();

			if (responseBody != null) {
				processResponse.setMessage(responseBody.getMessage());
				if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
					processResponse.setStatus("Failed");
					return ResponseEntity.badRequest().body(processResponse);
				}
			}

//			ProviderTokenRequest providerTokenRequest = new ProviderTokenRequest();
//
//			providerTokenRequest.setSendToEmail(ptr.getSendToEmail());
//			providerTokenRequest.setValidFromDate(ptr.getValidFromDate());
//			providerTokenRequest.setValidEndDate(ptr.getValidEndDate());
//
//			ProviderDto providerExisting = dataService.findProvider(ptr.getProviderName());
//
//			logger.debug("providerExisting=" + providerExisting);
//
//			if (providerExisting == null) {
//				return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, "Invalid provider", startTime));
//			} else {
//
//				ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerExisting.getId());
//
//				if (providerTokenDto == null) {
//					return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers for " + ptr.getProviderName(), startTime));
//				} else {
//
//					logger.debug("providerToken id=" + providerTokenDto.getId());
//
//					String url = playerapiUrl + "/" + Constants.playerapi.getprovidertoken;
//
//					logger.debug("calling rest url=" + url);
//
//					String payload = new ObjectMapper().writeValueAsString(providerTokenRequest);
//
//					PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).bodyValue(payload).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).retrieve().bodyToMono(PlayerApiResponse.class).block();
//
//					if (responseBody != null) {
//						processResponse.setMessage(responseBody.getMessage());
//						if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
//							processResponse.setStatus("Failed");
//							return ResponseEntity.badRequest().body(processResponse);
//						}
//					}
//
//				}
//			}

		} catch (WebClientResponseException we) {
			logger.error(we);

			processResponse.setStatus("Failed");
			processResponse.setMessage("Failed to process ");
			String body = we.getResponseBodyAsString();
			if (body != null && body.contains("Failed")) {
				PlayerApiResponse ur = we.getResponseBodyAs(PlayerApiResponse.class);
				validater.setFailedMessage(processResponse, ur.getMessage(), startTime);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			processResponse.setMessage(e.getMessage());
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		} catch (Exception ex) {
			logger.error(ex);
			validater.setFailedMessage(processResponse, "Failed to process", startTime);
		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

//	@CrossOrigin
//	@PostMapping("/getprovidertoken")
//	@ResponseBody
//	public ResponseEntity<?> getProvidertoken(@RequestBody ProviderTokenRequest ptr, HttpServletRequest req) throws Exception {
//
//		long startTime = System.currentTimeMillis();
//		PlayerApiResponse processResponse = new PlayerApiResponse();
//		processResponse.setStatus("Success");
//
//		try {
//
//			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//			sdf.setLenient(false);
//
//			PlayerRequestDto playerRequestDto = webUtil.getPlayerRequestDto(req, null, "Provider");
//
//			ObjectWriter ow = new ObjectMapper().writer();
//			String payload = ow.writeValueAsString(ptr);
//
//			playerRequestDto.setPayload(payload);
//
//			PlayerApiResponse validResponse = validater.validate(ptr);
//			if (validResponse.getStatus().equalsIgnoreCase("Failed")) {
//				playerRequestDto.setStatusMessage(validResponse.getMessage());
//				asyncServices.savePlayerRequest(playerRequestDto);
//				return ResponseEntity.badRequest().body(validResponse);
//			}
//
//			ProviderDto providerDto = dataService.findProviders(ptr.getProviderName());
//			if (providerDto == null) {
//				logger.error("Provider does not exist ");
//				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
//				playerRequestDto.setStatusMessage(processResponse.getMessage());
//				asyncServices.savePlayerRequest(playerRequestDto);
//				return ResponseEntity.badRequest().body(processResponse);
//			}
//
//			Date current = new Date();
//
//			ProviderTokenDto dto = new ProviderTokenDto();
//			dto.setProviderId(providerDto.getId());
//
//			Date convertedFromDate = sdf.parse(ptr.getValidFromDate());
//			Date convertedEndDate = sdf.parse(ptr.getValidEndDate());
//
//			dto.setValidFromDate(convertedFromDate);
//			dto.setValidEndDate(convertedEndDate);
//
//			SecretKey key = jwtHelper.getSecureRandomKey();
//			String encodedKey = Base64.getUrlEncoder().encodeToString(key.getEncoded());
//
//			SecretKey encyptionKey = jwtHelper.generateAesKey();
//			IvParameterSpec encyptionIv = jwtHelper.generateIv();
//
//
//			String encodedEncrptionKey = Base64.getUrlEncoder().encodeToString(encyptionKey.getEncoded());
//			String encodedEncrptionIv = Base64.getUrlEncoder().encodeToString(encyptionIv.getIV());
//
//			logger.debug(ptr);
//
//			TokenRequest tr = new TokenRequest();
//			tr.setProviderId(providerDto.getId());
//			tr.setSecretKey(key);
//			tr.setEncryptionKey(encodedEncrptionKey);
//			tr.setEncryptionIv(encodedEncrptionIv);
//			tr.setFromDate(convertedFromDate);
//			tr.setEndDate(convertedEndDate);
//
//			String token = jwtHelper.getProviderToken(tr);
//
//			String encodedToken = Base64.getUrlEncoder().encodeToString(token.getBytes());
//
//			logger.debug("token:" + encodedToken);
//
//			dto.setToken(encodedToken);
//			dto.setSecretKey(encodedKey);
//			dto.setEncryptionKey(encodedEncrptionKey);
//			dto.setEncryptionIv(encodedEncrptionIv);
//			dto.setSendToEmail(ptr.getSendToEmail().trim());
//			dto.setDeleted(false);
//
//			dto.setCreatedDate(current);
//			dto.setUpdatedDate(current);
//
//			String providerTokenId = dataService.saveProviderTokens(dto);
//
//			processResponse.setToken(encodedToken);
//			processResponse.setMessage("Succesfully generated token for " + providerDto.getProviderName());
//
//			String fromEmail = emailServices.getFromEmail();
//			String toEmail = ptr.getSendToEmail().trim();
//			String subject = "Provider Token";
//			StringBuffer sbHtmlContent = new StringBuffer();
//
//			sbHtmlContent.append("<h1>The following are provider token details</h1>");
//			sbHtmlContent.append("<p>Provider Name  : " + providerDto.getProviderName() + "</p>");
//			sbHtmlContent.append("<p>Provider Token : " + encodedToken + "</p>");
//			sbHtmlContent.append("<p>From DateTime  : " + ptr.getValidFromDate() + "</p>");
//			sbHtmlContent.append("<p>End DateTime   : " + ptr.getValidEndDate() + "</p>");
//
//			EmailTrackerDto emailTrackerDto = new EmailTrackerDto();
//			emailTrackerDto.setProviderTokenId(providerTokenId);
//			emailTrackerDto.setFromEmail(fromEmail);
//			emailTrackerDto.setToEmail(toEmail);
//			emailTrackerDto.setSubject(subject);
//			emailTrackerDto.setContent(sbHtmlContent.toString());
//			emailTrackerDto.setEmailSent(true);
//			emailTrackerDto.setStatusMessage("Successfully sent email");
//			emailTrackerDto.setCreatedDate(current);
//			emailTrackerDto.setUpdatedDate(current);
//
//			logger.debug(emailTrackerDto);
//
//			try {
//
//				emailServices.sendHtmlEmail(fromEmail, toEmail, subject, sbHtmlContent.toString());
//
//				dataService.saveEmailTrackers(emailTrackerDto);
//
//			} catch (Exception e) {
//
//				logger.error(e);
//
//				String msg = "Successfully generated token but failed to send email to " + ptr.getSendToEmail().trim();
//
//				emailTrackerDto.setEmailSent(false);
//				emailTrackerDto.setStatusMessage(e.getMessage());
//
//
//				validater.setFailedMessage(processResponse, msg, startTime);
//
//				dataService.saveEmailTrackers(emailTrackerDto);
//			}
//			// }
//
//		} catch (Exception e) {
//
//			logger.error(e);
//
//			String msg = "Failed to get provider token";
//			validater.setFailedMessage(processResponse, msg, startTime);
//		}
//
//		processResponse.setProcessTime(validater.getProcessTime(startTime));
//
//		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
//			return ResponseEntity.badRequest().body(processResponse);
//		} else {
//			return ResponseEntity.ok().body(processResponse);
//		}
//
//	}

//...............Get UserDetails............//

	@CrossOrigin
	@PostMapping("/users")
	@ResponseBody
	public ResponseEntity<?> usersProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<UserTokenDto> userTokenList = dataService.getUserTokenDetails(userDto);
			if (userTokenList != null && !userTokenList.isEmpty()) {
				return ResponseEntity.ok(userTokenList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

//.............Get UserTokens Details....................//

	@CrossOrigin
	@PostMapping("/userDetails")
	@ResponseBody
	public ResponseEntity<?> userDetailsProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest req, HttpServletResponse res) {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		boolean validation = webUtil.isValidRequest(req, res);
		if (!validation) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			List<UserTokenVideoDto> userTokensList = dataService.getUsertokens(userRequest.getSelectedIds());
			if (userTokensList != null && !userTokensList.isEmpty()) {
				return ResponseEntity.ok(userTokensList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

//............... Get video upload status....................//

	@CrossOrigin
	@PostMapping("/videoUploadStatus")
	@ResponseBody
	public ResponseEntity<?> videoUploadStatusProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest req, HttpServletResponse res) {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		boolean validation = webUtil.isValidRequest(req, res);
		if (!validation) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<VideoMasterDto> allVideoMasterList = dataService.getAllVideos(userDto);
			if (allVideoMasterList != null && !allVideoMasterList.isEmpty()) {
				return ResponseEntity.ok(allVideoMasterList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

//............... Get AllUserdetals....................//

	@CrossOrigin
	@PostMapping("/allUserDetails")
	@ResponseBody
	public ResponseEntity<?> allUserDetailsProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		boolean validation = webUtil.isValidRequest(request, response);
		if (!validation) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<UserDto> usersList = dataService.getAllUsers(userDto);
			if (usersList != null && !usersList.isEmpty()) {
				return ResponseEntity.ok(usersList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping(path = "/uploadVideo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> uploadVideoProcess(@RequestParam("providerName") String providerName, @RequestParam("sourceId") String sourceId, @RequestParam("type") String type, @RequestParam("releaseDate") String releaseDate, @RequestParam("endDate") String endDate, @RequestParam("videoName") String videoName,
			@RequestParam("videoDescription") String videoDescription, @RequestParam("language") String language, @RequestParam(value = "videoFile", required = false) MultipartFile file, @RequestParam(value = "imageFile", required = false) MultipartFile image, @RequestParam(value = "videoUrl", required = false) String videoUrl,
			@RequestParam(value = "thumbnailUrl", required = false) String thumbnailUrl, @RequestParam(value = "seasonNumber", required = false) String seasonNumber, @RequestParam(value = "episodeNumber", required = false) String episodeNumber, @RequestParam(value = "episodeName", required = false) String episodeName, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.debug("started admin upload");
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			processResponse.setMessage("Invalid Request");
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		}

		processResponse.setStatus("Success");

		try {

			UploadRequest uploadRequest = new UploadRequest();

			uploadRequest.setVideoName(videoName);
			uploadRequest.setVideoDescription(videoDescription);
			uploadRequest.setLanguage(language);
			uploadRequest.setType(type);
			uploadRequest.setReleaseDate(releaseDate);
			uploadRequest.setEndDate(endDate);
			uploadRequest.setSourceId(sourceId);

			if (type.equalsIgnoreCase("seasons")) {
				uploadRequest.setSeasonNumber(seasonNumber);
				uploadRequest.setEpisodeNumber(episodeNumber);
				uploadRequest.setEpisodeName(episodeName);

			} else {
				uploadRequest.setSeasonNumber(null);
				uploadRequest.setEpisodeNumber(null);
				uploadRequest.setEpisodeName(null);
			}
			if (file != null) {
				uploadRequest.setVideoFileName(file.getOriginalFilename());
			} else {
				uploadRequest.setVideoUrl(videoUrl);
			}

			if (image != null) {
				uploadRequest.setImageFileName(image.getOriginalFilename());

			} else {
				uploadRequest.setThumbnailUrl(thumbnailUrl);
			}

			ProviderDto providerExisting = dataService.findProvider(providerName);

			logger.debug("providerExisting=" + providerExisting);

			if (providerExisting == null) {
				return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, "Invalid provider", startTime));
			} else {

				ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerExisting.getId());

				if (providerTokenDto == null) {
					return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers for " + providerName, startTime));
				} else {

					logger.debug("providerToken id=" + providerTokenDto.getId());

					String url = playerapiUrl + "/" + Constants.playerapi.uploadadmin;

					logger.debug("calling rest url=" + url);

					String payload = new ObjectMapper().writeValueAsString(uploadRequest);

					MultipartBodyBuilder builder = new MultipartBodyBuilder();
					builder.part("payload", payload);

					if (file != null) {
						builder.part("videoFile", file.getResource());
					}

					if (image != null) {
						builder.part("imageFile", image.getResource());
					}

					PlayerApiResponse responseBody = this.getWebClient().post().uri(url).body(BodyInserters.fromMultipartData(builder.build())).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).retrieve().bodyToMono(PlayerApiResponse.class).block();

					if (responseBody != null) {
						processResponse.setMessage(responseBody.getMessage());
						if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
							processResponse.setStatus("Failed");
							return ResponseEntity.badRequest().body(processResponse);
						}
					}

				}
			}

		} catch (WebClientResponseException we) {
			logger.error(we);

			processResponse.setStatus("Failed");
			processResponse.setMessage("Failed to upload ");
			String body = we.getResponseBodyAsString();
			if (body != null && body.contains("Failed")) {
				PlayerApiResponse ur = we.getResponseBodyAs(PlayerApiResponse.class);
				validater.setFailedMessage(processResponse, ur.getMessage(), startTime);
			}

		} catch (Exception e) {

			logger.error(e);

			processResponse.setStatus("Failed");
			processResponse.setMessage("Failed to upload ");

		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/activeProvider")
	@ResponseBody
	public ResponseEntity<?> activeProviderProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(usersRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<ProviderDto> providerDtoList = dataService.findAllProviders(userDto);
			if (providerDtoList != null && !providerDtoList.isEmpty()) {
				return ResponseEntity.ok(providerDtoList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/thumbnailProviderVideos")
	@ResponseBody
	public ResponseEntity<?> thumbnailProviderVideosProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			List<VideoMasterDto> videoMasterList = dataService.findAllActiveMaster(userRequest.getSelectedIds());
			if (videoMasterList != null && !videoMasterList.isEmpty()) {
				return ResponseEntity.ok(videoMasterList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/thumbnailProvider")
	@ResponseBody
	public ResponseEntity<?> thumbnailProviderProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(usersRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<ProviderDto> providerDtoList = dataService.findActiveProviders(userDto);
			if (providerDtoList != null && !providerDtoList.isEmpty()) {
				return ResponseEntity.ok(providerDtoList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping(path = "/saveThumbnailImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> saveThumbnailImageProcess(@RequestParam(value = "image", required = false) MultipartFile image, @RequestParam(value = "thumbnailUrl", required = false) String thumbnailUrl, @RequestParam(value = "sourceId", required = true) String sourceId, @RequestParam(value = "providerId", required = true) String providerId,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		long startTime = System.currentTimeMillis();

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UploadThumbnailRequest uploadThumbnailRequest = new UploadThumbnailRequest();
			uploadThumbnailRequest.setSourceId(sourceId);

			if (image != null) {
				// uploadThumbnailRequest.setImageFileBytes(image.getBytes());
				uploadThumbnailRequest.setImageFileName(image.getOriginalFilename());

			} else if (thumbnailUrl != null) {
				uploadThumbnailRequest.setThumbnailUrl(thumbnailUrl);

			} else {
				validater.setFailedMessage(apiResponse, "image is required.", startTime);
				return ResponseEntity.badRequest().body(apiResponse);
			}

			ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerId);

			if (providerTokenDto == null) {
				validater.setFailedMessage(apiResponse, "Please generate provider token in Admin->Providers", startTime);
				return ResponseEntity.badRequest().body(apiResponse);
			} else {

				String url = playerapiUrl + "/" + Constants.playerapi.uploadthumbnailadmin;

				// PlayerApiResponse responseBody =
				// this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE,
				// MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT,
				// MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION,
				// providerTokenDto.getToken()).bodyValue(uploadThumbnailRequest).retrieve().bodyToMono(PlayerApiResponse.class)
				// .block();

				String payload = new ObjectMapper().writeValueAsString(uploadThumbnailRequest);

				// PlayerApiResponse responseBody =
				// this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE,
				// MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT,
				// MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION,
				// providerTokenDto.getToken()).bodyValue(uploadRequest).retrieve().bodyToMono(PlayerApiResponse.class).block();

				MultipartBodyBuilder builder = new MultipartBodyBuilder();
				builder.part("payload", payload);
				// builder.part("videoFile", null);
				// builder.part("imageFile", null);

				if (image != null) {
					builder.part("imageFile", image.getResource());
				}

				PlayerApiResponse responseBody = this.getWebClient().post().uri(url).body(BodyInserters.fromMultipartData(builder.build())).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).retrieve().bodyToMono(PlayerApiResponse.class).block();

				if (responseBody != null) {
					apiResponse.setMessage(responseBody.getMessage());
					if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
						apiResponse.setStatus("Failed");
						return ResponseEntity.badRequest().body(apiResponse);
					}
				}

			}

		} catch (WebClientResponseException we) {
			logger.error(we);

			apiResponse.setStatus("Failed");
			apiResponse.setMessage("Failed to upload ");
			String body = we.getResponseBodyAsString();
			if (body != null && body.contains("Failed")) {
				PlayerApiResponse ur = we.getResponseBodyAs(PlayerApiResponse.class);
				validater.setFailedMessage(apiResponse, ur.getMessage(), startTime);
			}

		} catch (Exception e) {

			logger.error(e);

			apiResponse.setStatus("Failed");
			apiResponse.setMessage("Failed to upload thumbnail");

		}

		if (apiResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(apiResponse);
		} else {
			return ResponseEntity.ok().body(apiResponse);
		}
	}

	@CrossOrigin
	@PostMapping("/updateVideoDetails")
	@ResponseBody
	public ResponseEntity<?> updateVideoDetailsProcess(@RequestBody CommonPayloadRequest payloadRequest, HttpServletRequest request, HttpServletResponse response) throws Exception {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			processResponse.setMessage("Invalid Request");
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		}

		try {
			UsersRequest updateVideoRequestAdmin = this.decryptedPayloadProcess(payloadRequest);

			String videoMasterId = updateVideoRequestAdmin.getVideoMasterId();

			String releaseDate = updateVideoRequestAdmin.getReleaseDate();
			String endDate = updateVideoRequestAdmin.getEndDate();

			if (videoMasterId != null && !videoMasterId.isEmpty() && webUtil.isHtml(videoMasterId)) {
				processResponse.setStatus("Failed");
				processResponse.setMessage("Invalid Request.");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
			}

			if (videoMasterId != null && !videoMasterId.isEmpty()) {
				List<String> masterId = dataService.getVideoMasterId(videoMasterId);

				if (masterId == null || masterId.isEmpty()) {
					processResponse.setStatus("Failed");
					processResponse.setMessage("Invalid Request.");
					return ResponseEntity.badRequest().body(processResponse);
				}

			}

			VideoMasterDto dtoExisting = dataService.findVideoMaster(videoMasterId);
			if (dtoExisting == null) {

				validater.setFailedMessage(processResponse, "Invalid Request", startTime);

				return ResponseEntity.badRequest().body(processResponse);

			}

			String providerName = updateVideoRequestAdmin.getProviderName();

			ProviderDto providerExisting = dataService.findProvider(providerName);

			logger.debug("providerExisting=" + providerExisting);

			if (providerExisting == null) {
				return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, "Invalid provider", startTime));
			} else {

				ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerExisting.getId());

				if (providerTokenDto == null) {
					return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers for " + providerName, startTime));
				} else {

					logger.debug("providerToken id=" + providerTokenDto.getId());

					String url = playerapiUrl + "/" + Constants.playerapi.updatevideo;
					logger.debug(url);
					UpdateVideoRequest updateVideoRequest = new UpdateVideoRequest();
					updateVideoRequest.setSourceId(dtoExisting.getSourceId());
					updateVideoRequest.setLanguage(updateVideoRequestAdmin.getLanguage());
					updateVideoRequest.setVideoName(updateVideoRequestAdmin.getVideoName());
					updateVideoRequest.setVideoDescription(updateVideoRequestAdmin.getVideoDescription());
					updateVideoRequest.setEpisodeName(updateVideoRequestAdmin.getEpisodeName());
					updateVideoRequest.setReleaseDate(releaseDate.trim());
					updateVideoRequest.setEndDate(endDate);

					String payload = new ObjectMapper().writeValueAsString(updateVideoRequest);

					PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).bodyValue(payload).retrieve().bodyToMono(PlayerApiResponse.class).block();

					if (responseBody != null) {
						processResponse.setMessage(responseBody.getMessage());
						processResponse.setMessage("Successfully updated video");
						processResponse.setProcessTime(validater.getProcessTime(startTime));
						if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
							processResponse.setStatus("Failed");
							processResponse.setProcessTime(validater.getProcessTime(startTime));
							return ResponseEntity.badRequest().body(processResponse);
						} else {
							// refresh cache

							url = playerUrl + "/" + Constants.player.initCacheMaster;
							logger.debug(url);

							String res = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).retrieve().bodyToMono(String.class).block();
							logger.debug(res);

						}
					}
				}
			}

		} catch (WebClientResponseException we) {
			logger.error(we);

			processResponse.setStatus("Failed");
			processResponse.setMessage("Failed to update ");
			String body = we.getResponseBodyAsString();
			if (body != null && body.contains("Failed")) {
				PlayerApiResponse ur = we.getResponseBodyAs(PlayerApiResponse.class);
				validater.setFailedMessage(processResponse, ur.getMessage(), startTime);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			processResponse.setMessage(e.getMessage());
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		} catch (Exception e) {

			logger.error(e);
			validater.setFailedMessage(processResponse, "Failed to update", startTime);

		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/userStatusUpdate")
	@ResponseBody
	public ResponseEntity<?> userStatusUpdateProcess(@RequestBody CommonPayloadRequest payRequest, HttpServletRequest request, HttpServletResponse response) {

		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			processResponse.setMessage("Invalid Request");
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payRequest);

			String providerName = "";

			List<UserDto> userDetails = dataService.findAllUsersByIds(usersRequest.getUserIds());
			for (UserDto userDto : userDetails) {

				if (userDto.getProviderName() != null) {
					providerName = userDto.getProviderName();
					break;
				}

			}

			ProviderDto providerExisting = dataService.findProvider(providerName);
			logger.debug("providerExisting=" + providerExisting);

			if (providerExisting == null) {
				return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, "Invalid provider", startTime));
			} else {

				ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerExisting.getId());

				if (providerTokenDto == null) {
					return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers for " + providerName, startTime));
				}

				else {

					String url = playerapiUrl + "/" + Constants.playerapi.updateuser;

					UpdateUserRequest uur = new UpdateUserRequest();
					uur.setActive(usersRequest.getActive());
					uur.setUserIds(usersRequest.getUserIds());

					String payload = new ObjectMapper().writeValueAsString(uur);

					PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).bodyValue(payload).retrieve().bodyToMono(PlayerApiResponse.class).block();

					if (responseBody != null) {
						processResponse.setMessage(responseBody.getMessage());
						if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
							processResponse.setStatus("Failed");
							return ResponseEntity.badRequest().body(processResponse);
						}
					}
				}
			}
		} catch (HttpClientErrorException e) {
			logger.error(e);

		} catch (WebClientResponseException we) {
			logger.error(we);

			processResponse.setStatus("Failed");
			processResponse.setMessage("Failed to process ");
			String body = we.getResponseBodyAsString();
			if (body != null && body.contains("Failed")) {
				PlayerApiResponse ur = we.getResponseBodyAs(PlayerApiResponse.class);
				validater.setFailedMessage(processResponse, ur.getMessage(), startTime);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			processResponse.setMessage(e.getMessage());
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		} catch (Exception ex) {
			logger.error(ex);
			validater.setFailedMessage(processResponse, "Failed to process", startTime);
		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/saveUserDetails")
	@ResponseBody
	public ResponseEntity<?> saveUserDetailsProcess(@RequestBody CommonPayloadRequest payRequest, HttpServletRequest request, HttpServletResponse response) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			processResponse.setMessage("Invalid Request");
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payRequest);

			ProviderDto providerDto = dataService.findProvider(usersRequest.getProviderName());

			if (providerDto == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerDto.getId());

			if (providerTokenDto == null) {
				validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			} else {

				String url = playerapiUrl + "/" + Constants.playerapi.saveuseradmin;

				SaveUserRequestAdmin sura = new SaveUserRequestAdmin();

				sura.setId(usersRequest.getId());
				sura.setProviderName(usersRequest.getProviderName());
				sura.setRoleName(usersRequest.getRoleName());
				sura.setUserEmail(usersRequest.getUserEmail());
				sura.setUserPassword(usersRequest.getPassword());

				String payload = new ObjectMapper().writeValueAsString(sura);

				PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).bodyValue(payload).retrieve().bodyToMono(PlayerApiResponse.class).block();

				if (responseBody != null) {
					processResponse.setMessage(responseBody.getMessage());
					if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
						processResponse.setStatus("Failed");
						return ResponseEntity.badRequest().body(processResponse);
					}
				}

			}

		} catch (WebClientResponseException we) {
			logger.error(we);

			processResponse.setStatus("Failed");
			processResponse.setMessage("Failed to process ");
			String body = we.getResponseBodyAsString();
			if (body != null && body.contains("Failed")) {
				PlayerApiResponse ur = we.getResponseBodyAs(PlayerApiResponse.class);
				validater.setFailedMessage(processResponse, ur.getMessage(), startTime);
			}

		} catch (Exception ex) {
			logger.error(ex);
			validater.setFailedMessage(processResponse, "Failed to process", startTime);
		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getUserRoles")
	@ResponseBody
	public ResponseEntity<?> getUserRolesProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(usersRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<RoleDto> rolesList = dataService.findProviderUserRoles();
			if (rolesList != null && !rolesList.isEmpty()) {
				return ResponseEntity.ok(rolesList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getUserTokenVideos")
	@ResponseBody
	public ResponseEntity<?> getUserTokensProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);

			List<UserTokenVideoDto> userTokenVideoList = dataService.findUserTokenVideos(usersRequest.getSelectedRowID());

			if (userTokenVideoList != null && !userTokenVideoList.isEmpty()) {
				return ResponseEntity.ok(userTokenVideoList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getProvidervideos")
	@ResponseBody
	public ResponseEntity<?> getProvidervideosProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);
			String ProviderId = usersRequest.getSelectedIds();

			List<VideoMasterDto> providerVideosList = dataService.findActiveVideos(ProviderId);

			if (providerVideosList != null && !providerVideosList.isEmpty()) {
				return ResponseEntity.ok(providerVideosList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@PostMapping("/saveUserToken")
	@ResponseBody
	public ResponseEntity<?> saveUserTokenProcess(@RequestBody CommonPayloadRequest payloadRequest, HttpServletRequest request, HttpServletResponse response) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			processResponse.setMessage("Invalid Request");
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payloadRequest);

			String providerId = usersRequest.getProviderId();

			UserTokenRequest userTokenRequest = new UserTokenRequest();
			userTokenRequest.setUserEmail(usersRequest.getUserEmail());
			userTokenRequest.setSourceId(usersRequest.getSourceId());
			userTokenRequest.setValidFromDate(usersRequest.getValidFromDate());
			userTokenRequest.setValidEndDate(usersRequest.getValidEndDate());

			ProviderDto providerExisting = dataService.findProviderById(providerId);

			if (providerExisting == null) {
				validater.setFailedMessage(processResponse, "Invalid provider", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			} else {

				ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerExisting.getId());

				if (providerTokenDto == null) {
					String providerName = providerExisting.getProviderName();
					validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers for " + providerName, startTime);
					return ResponseEntity.badRequest().body(processResponse);
				} else {

					String url = playerapiUrl + "/" + Constants.playerapi.getusertoken;

					String payload = new ObjectMapper().writeValueAsString(userTokenRequest);

					PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).bodyValue(payload).retrieve().bodyToMono(PlayerApiResponse.class).block();

					if (responseBody != null) {
						processResponse.setMessage(responseBody.getMessage());
						if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
							processResponse.setStatus("Failed");
							return ResponseEntity.badRequest().body(processResponse);
						}

					}

				}
			}

		} catch (WebClientResponseException we) {
			logger.error(we);

			processResponse.setStatus("Failed");
			processResponse.setMessage("Failed to process ");
			String body = we.getResponseBodyAsString();
			if (body != null && body.contains("Failed")) {
				PlayerApiResponse ur = we.getResponseBodyAs(PlayerApiResponse.class);
				validater.setFailedMessage(processResponse, ur.getMessage(), startTime);
			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			processResponse.setMessage(e.getMessage());
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		} catch (Exception e) {

			logger.error(e);

			validater.setFailedMessage(processResponse, "Failed to get user token", startTime);

		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getGlobalConfigKeys")
	@ResponseBody
	public ResponseEntity<?> getGlobalConfigKeysProcess(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {

			List<GlobalConfigurationDto> globalKeysList = dataService.findAllGlobalConfigKeys();

			if (globalKeysList != null && !globalKeysList.isEmpty()) {
				return ResponseEntity.ok(globalKeysList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getProviderKeys")
	@ResponseBody
	public ResponseEntity<?> getProviderConfigKeysProcess(@RequestBody CommonPayloadRequest payloadRequest, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payloadRequest);

			UserDto userDto = dataService.findUserById(usersRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<ConfigurationDto> KeysList = dataService.findAllConfigKeys(userDto);

			if (KeysList != null && !KeysList.isEmpty()) {
				return ResponseEntity.ok(KeysList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getProviderVideoKeys")
	@ResponseBody
	public ResponseEntity<?> getProviderVideoConfigKeysProcess(@RequestBody CommonPayloadRequest payloadRequest, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payloadRequest);

			List<ConfigurationVideoDto> pvKeysList = dataService.findAllVideoConfigKeys(usersRequest.getProviderId());

			if (pvKeysList != null && !pvKeysList.isEmpty()) {
				return ResponseEntity.ok(pvKeysList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getConfigKeys")
	@ResponseBody
	public ResponseEntity<?> getConfigKeysProcess(@RequestBody CommonPayloadRequest payloadRequest, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payloadRequest);

			String type = usersRequest.getType();

			List<ConfigurationDto> items = new ArrayList<>();

			if ("Seasons".equalsIgnoreCase(type)) {
				items = WebUtil.getSeasonConfigSelectKeys();
			} else if ("Movie".equalsIgnoreCase(type)) {
				items = WebUtil.getMovieConfigSelectKeys();
			} else {
				throw new IllegalArgumentException("Invalid type: " + type);
			}

			if (items != null && !items.isEmpty()) {
				return ResponseEntity.ok(items);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@PostMapping("/saveConfigurations")
	@ResponseBody
	public ResponseEntity<?> saveConfigurationKeys(@RequestBody CommonPayloadRequest payloadRequest, HttpServletRequest request, HttpServletResponse response) {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payloadRequest);
			String msg = "";

			String providerId = usersRequest.getProviderId();
			String configKey = usersRequest.getConfigKey();
			String configValue = usersRequest.getConfigValue();

			if (providerId != null) {
				providerId = providerId.trim();
			}

			if ((providerId == null || providerId.isEmpty())) {
				apiResponse.setStatus("Failed");
				apiResponse.setMessage("Invalid Request");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			String videoMasterId = usersRequest.getSelectVideo();
			if (providerId != null && !providerId.isEmpty() && webUtil.isHtml(providerId)) {

				apiResponse.setStatus("Failed");
				apiResponse.setMessage("Invalid Request");
				return ResponseEntity.badRequest().body(apiResponse);

			}

			if ((providerId != null && !providerId.isEmpty())) {
				List<String> id = dataService.getproviderId(providerId);

				if (id == null || id.isEmpty()) {
					apiResponse.setStatus("Failed");
					apiResponse.setMessage("Invalid Request");
					return ResponseEntity.badRequest().body(apiResponse);

				}

			}

			if (videoMasterId != null && !videoMasterId.isEmpty() && webUtil.isHtml(videoMasterId)) {

				apiResponse.setStatus("Failed");
				apiResponse.setMessage("Invalid Request");
				return ResponseEntity.badRequest().body(apiResponse);

			}

			if (videoMasterId != null && !videoMasterId.isEmpty()) {
				List<String> masterId = dataService.getVideoMasterId(videoMasterId);

				if (masterId == null || masterId.isEmpty()) {
					apiResponse.setStatus("Failed");
					apiResponse.setMessage("Invalid Request");
					return ResponseEntity.badRequest().body(apiResponse);
				}

			}
			if (configValue != null && !configValue.isEmpty() && webUtil.isHtml(configValue)) {
				apiResponse.setStatus("Failed");
				apiResponse.setMessage("Invalid Request");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			if (providerId != null && configKey != "select a key" && configValue != "") {

				String[] watermarkValues = { "Black", "Blue", "Cyan", "Gray", "Green", "Magenta", "Orange", "Pink", "Red", "White", "Yellow" };
				boolean existWaterMarkColor = false;
				boolean booleanVal = false;
				boolean numberVal = false;
				boolean textVal = false;

				if (configKey.equalsIgnoreCase("FullScreen") || configKey.equalsIgnoreCase("Mini-Player") || configKey.equalsIgnoreCase("PlayBackSpeed") || configKey.equalsIgnoreCase("Resolution") || configKey.equalsIgnoreCase("ShowLanguages") || configKey.equalsIgnoreCase("ShowTheaterMode") || configKey.equalsIgnoreCase("ShowVideoDescription")) {
					if (configValue.equalsIgnoreCase("True") || configValue.equalsIgnoreCase("False")) {
						booleanVal = true;
					}
				} else if (configKey.equalsIgnoreCase("InitialDelayTime") || configKey.equalsIgnoreCase("InitialFragmentsToActivemq") || configKey.equalsIgnoreCase("NextButtonShowTime") || configKey.equalsIgnoreCase("PlayerDelayTime") || configKey.equalsIgnoreCase("PlayFragmentsToActivemq") || configKey.equalsIgnoreCase("PreviousButtonShowTime")
						|| configKey.equalsIgnoreCase("VideoDescriptionLength") || configKey.equalsIgnoreCase("VideoForwardSeconds") || configKey.equalsIgnoreCase("VideoPreviewImageSeconds") || configKey.equalsIgnoreCase("VideoRewindSeconds")) {
					if (configValue.matches(".*[1-9].*") && !configValue.startsWith("0")) {
						numberVal = true;
					}
				} else if (configKey.equalsIgnoreCase("NextButtonShowText") || configKey.equalsIgnoreCase("PreviousButtonShowText")) {
					if (configValue.matches(".*[a-zA-z].*")) {
						textVal = true;
					}
				} else if (configKey.equalsIgnoreCase("WatermarkColor")) {
					for (String val : watermarkValues) {
						if (configValue.equalsIgnoreCase(val)) {
							existWaterMarkColor = true;
							break;
						}
					}
				}

				if (configKey.equalsIgnoreCase("VideoPreviewImageSeconds")) {
					if (videoMasterId != null && videoMasterId.length() > 0) {
						apiResponse.setStatus("Failed");
						apiResponse.setMessage("Invalid Request");
						return ResponseEntity.badRequest().body(apiResponse);
					}
				}
				if ((booleanVal || numberVal || textVal || existWaterMarkColor)) {
					if (videoMasterId != null && videoMasterId.length() > 0) {

						ConfigurationVideoDto dto = new ConfigurationVideoDto();
						dto.setProviderId(providerId);
						dto.setVideoMasterId(videoMasterId);
						dto.setConfigKey(configKey);
						dto.setConfigValue(configValue);

						Date current = new Date();
						dto.setCreatedDate(current);
						dto.setUpdatedDate(current);

						msg = dataService.saveProviderVideoConfigKey(dto);

						// List<ConfigurationVideoDto> pvKeysList =
						// dataService.findAllProvidervideoConfigs();

						// ObjectMapper objectMapper = new ObjectMapper();
						// String jsonProviderVideoKeyList =
						// objectMapper.writeValueAsString(pvKeysList);
						// apiResponse.setProviderVideoKeys(jsonProviderVideoKeyList);

						String url = playerUrl + "/" + Constants.player.initCacheConfig;
						logger.debug(url);

						String resp = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).retrieve().bodyToMono(String.class).block();
						logger.debug(resp);

					} else {
						ConfigurationDto dto = new ConfigurationDto();
						dto.setProviderId(providerId);
						dto.setConfigKey(configKey);
						dto.setConfigValue(configValue);

						Date current = new Date();
						dto.setCreatedDate(current);
						dto.setUpdatedDate(current);
						msg = dataService.saveProviderConfigKey(dto);

						// List<ConfigurationDto> pKeysList = dataService.findAllProviderConfigs();

						// ObjectMapper objectMapper = new ObjectMapper();
						// String jsonProviderKeyList = objectMapper.writeValueAsString(pKeysList);

						// apiResponse.setProviderKeys(jsonProviderKeyList);

						String url = playerUrl + "/" + Constants.player.initCacheConfig;

						logger.debug(url);

						String resp = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).retrieve().bodyToMono(String.class).block();
						logger.debug(resp);

					}
				} else {
					apiResponse.setStatus("Failed");
					apiResponse.setMessage("Invalid Request");
					return ResponseEntity.badRequest().body(apiResponse);
				}
			}

			apiResponse.setStatus("Success");
			apiResponse.setMessage(msg);

		} catch (Exception e) {

			logger.error(e);

			apiResponse.setStatus("Failed");
			apiResponse.setMessage("Failed to save Configuration.");
			return ResponseEntity.badRequest().body(apiResponse);

		}

		if (apiResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(apiResponse);
		} else {
			return ResponseEntity.ok().body(apiResponse);
		}
	}

	@PostMapping("/impersonate")
	@ResponseBody
	public ResponseEntity<?> saveUser(@RequestBody CommonPayloadRequest payloadRequest, HttpServletRequest request, HttpServletResponse response) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		try {

			// Validate the incoming request
			if (!webUtil.isValidRequest(request, response)) {
				processResponse.setMessage("Invalid Request");
				processResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(processResponse);
			}

			UsersRequest usersRequest = this.decryptedPayloadProcess(payloadRequest);

			UserDto userDto = dataService.findUserById(usersRequest.getUserID().trim());

			if (userDto == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (userDto.getActive().equalsIgnoreCase("false")) {
				validater.setFailedMessage(processResponse, "Cannot impersonate as user is inactive", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			return ResponseEntity.ok().body(userDto);

		} catch (Exception ex) {
			logger.error(ex);
			validater.setFailedMessage(processResponse, "Failed to process", startTime);
		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/providerUsers")
	@ResponseBody
	public ResponseEntity<?> providerUsersProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);

			List<UserDto> dtoList = dataService.findProviderUsers(usersRequest.getProviderId());

			return ResponseEntity.ok(dtoList);

//			if (dtoList != null && !dtoList.isEmpty()) {
//				return ResponseEntity.ok(dtoList);
//			} else {
//				apiResponse.setMessage("No data available.");
//				apiResponse.setStatus("Failed");
//				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
//			}

		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getServerDateAndTime")
	@ResponseBody
	public ResponseEntity<?> getServerDateAndTimeProcess(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {

			String serverDateAndTime = validater.getServerDateTime();

			if (serverDateAndTime != null && !serverDateAndTime.isEmpty()) {
				return ResponseEntity.ok(serverDateAndTime);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/userProviders")
	@ResponseBody
	public ResponseEntity<?> userProvidersProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest userRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(userRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<ProviderDto> providerList = dataService.findUserProviders(userDto);

			if (providerList != null && !providerList.isEmpty()) {

				return ResponseEntity.ok(providerList);

			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
	}

	@CrossOrigin
	@PostMapping("/homeProvidervideos")
	@ResponseBody
	public ResponseEntity<?> homeProvidervideosProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) throws Exception {
		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);
			String ProviderId = usersRequest.getSelectedIds();

			UserDto userDto = dataService.findUserById(usersRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<VideoMasterDto> videoMasterList = dataService.findUserVideos(ProviderId, userDto);

			if (videoMasterList != null && !videoMasterList.isEmpty()) {
				return ResponseEntity.ok(videoMasterList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getLogData")
	@ResponseBody
	public ResponseEntity<?> getLogProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");
		processResponse.setResponseData("");

		if (!webUtil.isValidRequest(request, response)) {
			processResponse.setMessage("Invalid Request");
			processResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(processResponse);
		}

		try {

			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);

			if (usersRequest.getVideoMasterId() == null || usersRequest.getVideoMasterId().trim().length() == 0) {

				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (validater.isHtml(usersRequest.getVideoMasterId().trim())) {

				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			File fileHotFolder = new File(hotFolder);

			File fileVideoFiles = new File(fileHotFolder.getParent() + "/" + Constants.videoFilesFolder);

			File finalVideoFiles = new File(fileVideoFiles.getPath(), usersRequest.getVideoMasterId().trim());

			File chunkFiles = new File(finalVideoFiles.getPath() + "/" + Constants.chunkFilesFolder);

			File outputLog = new File(chunkFiles.getPath(), "output.log");

			if (outputLog.exists()) {
				String content = Files.readString(Paths.get(outputLog.getPath()));
				processResponse.setResponseData(content);
			}

		} catch (Exception ex) {
			logger.error(ex);
			validater.setFailedMessage(processResponse, "Failed to process", startTime);
		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@CrossOrigin
	@PostMapping("/getauthFailures")
	@ResponseBody
	public ResponseEntity<?> getauthFailuresProcess(@RequestBody CommonPayloadRequest payload, HttpServletRequest request, HttpServletResponse response) {

		PlayerApiResponse apiResponse = new PlayerApiResponse();
		apiResponse.setStatus("Success");

		// Validate the incoming request
		if (!webUtil.isValidRequest(request, response)) {
			apiResponse.setMessage("Invalid Request");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		try {
			UsersRequest usersRequest = this.decryptedPayloadProcess(payload);

			UserDto userDto = dataService.findUserById(usersRequest.getUserID());

			if (userDto == null) {
				apiResponse.setMessage("Invalid Request");
				apiResponse.setStatus("Failed");
				return ResponseEntity.badRequest().body(apiResponse);
			}

			List<PlayerRequestDto> playerRequestDtoList = dataService.getAuthFailures(userDto);

			if (playerRequestDtoList != null && !playerRequestDtoList.isEmpty()) {
				return ResponseEntity.ok(playerRequestDtoList);
			} else {
				apiResponse.setMessage("No data available.");
				apiResponse.setStatus("Failed");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
			}
		} catch (CustomException e) {
			logger.error("Error processing payload: {}", e.getMessage());
			apiResponse.setMessage(e.getMessage());
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error: {}", e.getMessage());
			apiResponse.setMessage("An unexpected error occurred.");
			apiResponse.setStatus("Failed");
			return ResponseEntity.badRequest().body(apiResponse);
		}
	}

	public UsersRequest decryptedPayloadProcess(CommonPayloadRequest payloadRequest) throws Exception {
		String encryptedPayload = payloadRequest.getData();

		PlayerApiResponse validResponse = validater.validateData(encryptedPayload);
		if (validResponse.getStatus().equalsIgnoreCase("Failed")) {
			throw new CustomException(validResponse.getMessage());
		}

		String decryptedPayload = jwtHelper.decryptData(encryptedPayload);

		PlayerApiResponse decryptedPayloadResponse = validater.validateData(decryptedPayload);
		if (decryptedPayloadResponse.getStatus().equalsIgnoreCase("Failed")) {
			throw new CustomException(decryptedPayloadResponse.getMessage());
		}

		try {
			return new ObjectMapper().readValue(decryptedPayload, UsersRequest.class);
		} catch (Exception e) {
			throw new CustomException("Error parsing decrypted payload to UsersRequest", e);
		}
	}

}
