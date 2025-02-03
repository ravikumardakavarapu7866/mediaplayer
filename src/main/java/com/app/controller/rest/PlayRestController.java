package com.app.controller.rest;

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

import org.apache.hc.core5.http.HttpHeaders;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import com.app.comp.Validater;
import com.app.comp.WebUtil;
import com.app.data.dto.AspectRatioKeyDto;
import com.app.data.dto.ConfigurationDto;
import com.app.data.dto.ConfigurationVideoDto;
import com.app.data.dto.ProviderDto;
import com.app.data.dto.ProviderTokenDto;
import com.app.data.dto.UserDto;
import com.app.data.dto.VideoDetailUserDto;
import com.app.data.dto.VideoMasterDto;
import com.app.data.dto.VideoPlayEventDetailDto;
import com.app.data.http.PlayerApiResponse;
import com.app.data.http.ProviderTokenRequest;
import com.app.data.http.SaveAspectRequestAdmin;
import com.app.data.http.SaveUserRequestAdmin;
import com.app.data.http.UpdateUserRequest;
import com.app.data.http.UpdateVideoRequest;
import com.app.data.http.UpdateVideoRequestAdmin;
import com.app.data.http.UploadRequest;
import com.app.data.http.UploadThumbnailRequest;
import com.app.data.http.UserTokenRequest;
import com.app.data.http.UserTokenRequestAdmin;
import com.app.data.http.VideoAnalysisResponse;
import com.app.data.service.DataService;
import com.app.data.util.Constants;
import com.app.data.util.SelectParam;
import com.app.util.ConfigParam;
import com.app.util.ConfigResponse;
import com.app.util.PlayParam;
import com.app.util.PlayResponse;
import com.app.util.WebUtility;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import io.netty.resolver.DefaultAddressResolverGroup;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import reactor.netty.http.client.HttpClient;

@RestController
public class PlayRestController {

	private static final Logger logger = LogManager.getLogger(PlayRestController.class);

	@Autowired
	private DataService dataService;

	@Value("${videoSchedular.hotFolder}")
	private String hotFolder;

	@Value("${ffmpegPath}")
	private String ffmpegPath;

	@Value("${playerUrl}")
	private String playerUrl;

	@Value("${playerapiUrl}")
	private String playerapiUrl;

	@Autowired
	private Validater validater;

	@Autowired
	private WebUtil webUtil;

	private WebClient _webClient;

	private WebClient getWebClient() throws IOException, KeyStoreException, NoSuchAlgorithmException, CertificateException {

		if (this._webClient == null) {

			TrustManagerFactory trustManagerFactory = InsecureTrustManagerFactory.INSTANCE;

			SslContext sslContext = SslContextBuilder.forClient().trustManager(trustManagerFactory).build();

			HttpClient hc = HttpClient.create().secure(t -> t.sslContext(sslContext).handshakeTimeout(Duration.ofSeconds(120))).resolver(DefaultAddressResolverGroup.INSTANCE);
			/*
			 * .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
			 * .responseTimeout(Duration.ofMillis(5000)) .doOnConnected(conn ->
			 * conn.addHandlerLast(new ReadTimeoutHandler(5000, TimeUnit.MILLISECONDS))
			 * .addHandlerLast(new WriteTimeoutHandler(5000, TimeUnit.MILLISECONDS)
			 */
			ReactorClientHttpConnector rchc = new ReactorClientHttpConnector(hc);

			this._webClient = WebClient.builder().clientConnector(rchc)
					// .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
					// .defaultHeader(HttpHeaders.ACCEPT, "${MediaType.APPLICATION_JSON}")
					// .defaultHeader(HttpHeaders.ACCEPT_CHARSET, StandardCharsets.UTF_8.toString())
					// .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
					// .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
					// .defaultHeader(httpHeaders -> httpHeaders.addAll(request.getHeaders())) //
					// Adds

					.build();

		}

		return this._webClient;

	}

	@CrossOrigin
	@PostMapping("/fileupload")
	@ResponseBody
	public ResponseEntity<?> fileupload(@RequestParam(value = "file", required = false) MultipartFile file, @RequestParam(value = "image", required = false) MultipartFile image, @RequestParam("providerName") String providerName, @RequestParam("videoName") String videoName, @RequestParam("videoDescription") String videoDescription,
			@RequestParam("language") String language, @RequestParam("type") String type, @RequestParam("releaseDate") String releaseDate, @RequestParam("endDate") String endDate, @RequestParam(value = "thumbnailUrl", required = false) String thumbnailUrl, @RequestParam("seasonNumber") String seasonNumber, @RequestParam("episodeNumber") String episodeNumber,
			@RequestParam("episodeName") String episodeName, @RequestParam("videoType") String videoType, @RequestParam(value = "videoUrl", required = false) String videoUrl, @RequestParam("imageType") String imageType, @RequestParam("sourceId") String sourceId) {
		logger.debug("started admin upload");
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		try {

			UploadRequest uploadRequest = new UploadRequest();

			uploadRequest.setVideoName(videoName);
			uploadRequest.setVideoDescription(videoDescription);
			// processParam.setProviderName(providerName);
			uploadRequest.setLanguage(language);
			uploadRequest.setType(type);
			uploadRequest.setReleaseDate(releaseDate);
			uploadRequest.setEndDate(endDate);
			// processParam.setThumbnailUrl(thumbnailUrl);
			// uploadRequest.setProviderAuthKey(providerAuthKey);
			uploadRequest.setSourceId(sourceId);
			// processParam.setVideoType(videoType);
			// processParam.setImageType(imageType);

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
//				try {
//					uploadRequest.setVideoFileBytes(file.getBytes());
//				} catch (IOException e) {
//					return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, e.getMessage(), startTime));
//
//				}
				uploadRequest.setVideoFileName(file.getOriginalFilename());
				// processParam.setLocalUpload(true);
			} else {
				uploadRequest.setVideoUrl(videoUrl);
				// processParam.setLocalUpload(false);
			}

			if (image != null) {
//				try {
//					uploadRequest.setImageFileBytes(image.getBytes());
//				} catch (IOException e) {
//					return ResponseEntity.badRequest().body(validater.setFailedMessage(processResponse, e.getMessage(), startTime));
//
//				}
				uploadRequest.setImageFileName(image.getOriginalFilename());

			} else {
				uploadRequest.setThumbnailUrl(thumbnailUrl);
			}

//			processParam.setHotFolder(hotFolder);
//			processParam.setProcessTypes(Constants.processTypes);
//			processParam.setFfmpegPath(ffmpegPath);

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

//					MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
//					
//
//					HttpEntity<UploadRequest> requestEntity = new HttpEntity<>(uploadRequest, headers);
//
//					ResponseEntity<UploadResponse> responseEntity = restTemplate.post(url, HttpMethod.POST, requestEntity, UploadResponse.class);
//					UploadResponse body = responseEntity.getBody();
//
//					processResponse.setMessage(body.getMessage());
//					if (body.getStatus().equalsIgnoreCase("Failed")) {
//						processResponse.setStatus("Failed");
//					}

					String payload = new ObjectMapper().writeValueAsString(uploadRequest);

					// PlayerApiResponse responseBody =
					// this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE,
					// MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT,
					// MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION,
					// providerTokenDto.getToken()).bodyValue(uploadRequest).retrieve().bodyToMono(PlayerApiResponse.class).block();

					MultipartBodyBuilder builder = new MultipartBodyBuilder();
					builder.part("payload", payload);
					// builder.part("videoFile", null);
					// builder.part("imageFile", null);
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
//		} catch (HttpClientErrorException e) {
//			logger.error(e);
//
//			processResponse.setStatus("Failed");
//			processResponse.setMessage("Failed to upload ");
//
//			String body = e.getResponseBodyAsString();
//			if (body != null && body.contains("Failed")) {
//				UploadResponse ur = e.getResponseBodyAs(UploadResponse.class);
//				processResponse.setMessage(ur.getMessage());
//			}

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

	@PostMapping("/saveThumbnailVideoImage")
	@ResponseBody
	public ResponseEntity<?> saveThumbnailVideoImage(@RequestParam(value = "image", required = false) MultipartFile image, @RequestParam(value = "thumbnailUrl", required = false) String thumbnailUrl, @RequestParam(value = "sourceId", required = true) String sourceId, @RequestParam(value = "providerId", required = true) String providerId) throws Exception {

		long startTime = System.currentTimeMillis();

		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		try {
			UploadThumbnailRequest uploadThumbnailRequest = new UploadThumbnailRequest();
			uploadThumbnailRequest.setSourceId(sourceId);

			if (image != null) {
				// uploadThumbnailRequest.setImageFileBytes(image.getBytes());
				uploadThumbnailRequest.setImageFileName(image.getOriginalFilename());

			} else if (thumbnailUrl != null) {
				uploadThumbnailRequest.setThumbnailUrl(thumbnailUrl);

			} else {
				validater.setFailedMessage(processResponse, "image is required.", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerId);

			if (providerTokenDto == null) {
				validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			} else {

//				MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
//				
//
//				HttpEntity<UploadThumbnailRequest> requestEntity = new HttpEntity<>(uploadThumbnailRequest, headers);
//
//				ResponseEntity<UploadThumbnailResponse> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, UploadThumbnailResponse.class);
//				UploadThumbnailResponse body = responseEntity.getBody();

				String url = playerapiUrl + "/" + Constants.playerapi.uploadthumbnailadmin;

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

				// String payload = new
				// ObjectMapper().writeValueAsString(uploadThumbnailRequest);

				// PlayerApiResponse responseBody =
				// this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE,
				// MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT,
				// MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION,
				// providerTokenDto.getToken()).bodyValue(uploadThumbnailRequest).retrieve().bodyToMono(PlayerApiResponse.class)
				// .block();

				if (responseBody != null) {
					processResponse.setMessage(responseBody.getMessage());
					if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
						processResponse.setStatus("Failed");
						return ResponseEntity.badRequest().body(processResponse);
					}
				}

			}

//		} catch (HttpClientErrorException e) {
//			logger.error(e);
//
//			processResponse.setStatus("Failed");
//			processResponse.setMessage("Failed to upload thumbnail");
//
//			String body = e.getResponseBodyAsString();
//			if (body != null && body.contains("Failed")) {
//				UploadThumbnailResponse ur = e.getResponseBodyAs(UploadThumbnailResponse.class);
//				processResponse.setMessage(ur.getMessage());
//			}

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
			processResponse.setMessage("Failed to upload thumbnail");

		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@PostMapping("/getHomeProviderVideos")
	@ResponseBody
	public ResponseEntity<?> getHomeProviderVideos(@RequestBody PlayParam playParam, HttpServletRequest req, HttpServletResponse res) throws JsonProcessingException {
		PlayResponse playResponse = new PlayResponse();
//		long startTime = System.currentTimeMillis();
		String baseurl = webUtil.getBasePath(req);

		// UserDto userDto = dataService.findUserByEmail(playParam.getUserEmail());

		Object userDto = req.getSession().getAttribute("userDto");

		if (userDto == null) {
			playResponse.setStatus("Failed");
			playResponse.setMessage("Invalid Request");
			return ResponseEntity.badRequest().body(playResponse);

		}

		List<VideoMasterDto> videoMasterList = new ArrayList<VideoMasterDto>();
		if (userDto != null) {

			videoMasterList = dataService.findUserVideos(playParam.getProviderId(), ((UserDto) userDto));

			HashMap<String, Object> returnMap = WebUtility.getHomeVideos(videoMasterList, playerUrl, baseurl);
			SelectParam selectParam = new SelectParam();

			selectParam.setDataSource(videoMasterList);
			selectParam.setOnchangeFunction("homeVideoChange(this)");
			selectParam.setValueField("id");
			selectParam.setTextField("label");
			selectParam.setId("selectVideo");
			selectParam.setMaxLength(25);
			selectParam.setPlaceHolder("Select Video");
			selectParam.setAdditionalField("userToken");
			selectParam.setHeight(400);

			String html = WebUtility.getSelectHtml(selectParam);

			playResponse.setVideoSelecItems(html);
			playResponse.setVideoMovies(returnMap.get("videoMovies").toString());
			playResponse.setVideoSeries(returnMap.get("videoSeries").toString());
		}

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			return ResponseEntity.badRequest().body(null);
		} else {
			return ResponseEntity.ok().body(playResponse);
		}
	}

	@PostMapping("/getConfigProviderVideos")
	@ResponseBody
	public ResponseEntity<?> getConfigProviderVideos(@RequestBody PlayParam playParam, HttpServletRequest req, HttpServletResponse res) throws JsonProcessingException {
		PlayResponse playResponse = new PlayResponse();

		List<VideoMasterDto> videoMasterList = dataService.findAllActiveMaster(playParam.getProviderId());

		SelectParam selectParam = new SelectParam();

		selectParam.setDataSource(videoMasterList);
		selectParam.setValueField("id");
		selectParam.setTextField("label");
		selectParam.setId("selectVideo");
		selectParam.setMaxLength(35);
		selectParam.setPlaceHolder("Select Video");
		selectParam.setHeight(400);

		String html = WebUtility.getSelectHtml(selectParam);

		playResponse.setProviderVideoHtml(html);

		List<ConfigurationDto> pKeysList = dataService.findAllProviderConfigs();
		List<ConfigurationVideoDto> pvKeysList = dataService.findAllProvidervideoConfigs();

		ObjectMapper objectMapper = new ObjectMapper();
		String jsonProviderKeyList = objectMapper.writeValueAsString(pKeysList);
		String jsonProviderVideoKeyList = objectMapper.writeValueAsString(pvKeysList);

		playResponse.setProviderKeys(jsonProviderKeyList);
		playResponse.setProviderVideoKeys(jsonProviderVideoKeyList);

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			res.setHeader("Message", "Invalid Request");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		} else {
			return ResponseEntity.ok().body(playResponse);
		}
	}

	@PostMapping("/getThumbnailProviderVideos")
	@ResponseBody
	public ResponseEntity<?> getThumbnailProviderVideos(@RequestBody PlayParam playParam, HttpServletRequest req, HttpServletResponse res) {
		PlayResponse playResponse = new PlayResponse();

		List<VideoMasterDto> videoMasterList = dataService.findAllActiveMaster(playParam.getProviderId());

		SelectParam selectParam = new SelectParam();

		selectParam.setDataSource(videoMasterList);
		selectParam.setValueField("id");
		selectParam.setTextField("label");
		selectParam.setId("selectVideo");
		selectParam.setMaxLength(35);
		selectParam.setPlaceHolder("Select Video");
		selectParam.setHeight(350);
		selectParam.setAdditionalField("sourceId");

		String html = WebUtility.getSelectHtml(selectParam);

		playResponse.setProviderVideoHtml(html);

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			return ResponseEntity.badRequest().body(null);
		} else {
			return ResponseEntity.ok().body(playResponse);
		}
	}

	@PostMapping("/videouser")
	@ResponseBody
	public ResponseEntity<?> videoUser(@RequestBody PlayParam playParam, HttpServletRequest req, HttpServletResponse res) {

		PlayResponse playResponse = new PlayResponse();

		String videoDetailProgressId = playParam.getVideoDetailProgressId();

		List<VideoDetailUserDto> videoDetailUserList = dataService.findVideoDetailUser(videoDetailProgressId);

		String videoUserHtml = WebUtility.getVideoProgressRecords(videoDetailUserList);

		playResponse.setVideoUserHtml(videoUserHtml);
		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			return ResponseEntity.badRequest().body(null);
		} else {
			return ResponseEntity.ok().body(playResponse);
		}
	}

	@PostMapping("/saveProvider")
	@ResponseBody
	public ResponseEntity<?> saveProvider(@RequestParam(value = "providerName") String providerName) throws Exception {

		PlayResponse processResponse = new PlayResponse();

		if (providerName != null && providerName.trim().length() > 0) {
			boolean process = true;
			if (WebUtility.isHtml(providerName)) {
				processResponse.setStatus("Failed");
				processResponse.setMessage("Invalid Request.");
				process = false;
			}

			String modifiedProviderName = providerName.trim();

			if (modifiedProviderName.length() > 100) {

				processResponse.setStatus("Failed");
				processResponse.setMessage("provider name cannot be more than 100 characters");
				process = false;
			}

			if (process) {

				Date current = new Date();
				ProviderDto providerDto = new ProviderDto();
				providerDto.setProviderName(modifiedProviderName);
				providerDto.setCreatedDate(current);
				providerDto.setUpdatedDate(current);

				ProviderDto providerExisting = dataService.findProvider(modifiedProviderName);

				if (providerExisting != null) {
					processResponse.setStatus("Failed");
					processResponse.setMessage("Provider Name exists.");
				} else {

					dataService.addProvider(providerDto);
					processResponse.setStatus("Success");
					processResponse.setMessage("Successfully saved " + modifiedProviderName);
				}
			}

		} else {
			processResponse.setStatus("Failed");
			processResponse.setMessage("Provider Name is required.");

		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

	}

	@PostMapping("/saveProviderToken")
	@ResponseBody
	public ResponseEntity<?> saveProviderToken(@RequestBody ProviderTokenRequest ptr, HttpServletRequest req, HttpServletResponse res) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");
		try {

			boolean validation = WebUtility.isValidRequest(req, res);
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

//		} catch (HttpClientErrorException e) {
//			logger.error(e);
//
//			playResponse.setStatus("Failed");
//			playResponse.setMessage("Failed to generate provider token ");
//
//			String body = e.getResponseBodyAsString();
//			if (body != null && body.contains("Failed")) {
//				ProviderTokenResponse ur = e.getResponseBodyAs(ProviderTokenResponse.class);
//				playResponse.setMessage(ur.getMessage());
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

	@PostMapping("/saveAspectRatio")
	@ResponseBody
	public ResponseEntity<?> saveAspectRatio(@RequestBody SaveAspectRequestAdmin sar, HttpServletRequest req, HttpServletResponse res) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");
		try {

			boolean validation = WebUtility.isValidRequest(req, res);
			if (!validation) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (sar == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			ProviderDto providerDto = dataService.findProvider(sar.getProviderName());

			if (providerDto == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerDto.getId());

			if (providerTokenDto == null) {
				validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			} else {

//				SaveAspectRequest saveAspectRequest = new SaveAspectRequest();
//				saveAspectRequest.setId(sar.getId());
//				saveAspectRequest.setAspectRatio(sar.getAspectRatio());
//				saveAspectRequest.setWidth(sar.getWidth());
//				saveAspectRequest.setHeight(sar.getHeight());
//				saveAspectRequest.setVideoBitrate(Integer.parseInt(sar.getVideoBitrate()));
//				saveAspectRequest.setAudioBitrate(Integer.parseInt(sar.getAudioBitrate()));

				String url = playerapiUrl + "/" + Constants.playerapi.saveaspectratio;

				// String payload = new
				// ObjectMapper().writeValueAsString(uploadThumbnailRequest);

				PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).bodyValue(sar).retrieve().bodyToMono(PlayerApiResponse.class).block();

				if (responseBody != null) {
					processResponse.setMessage(responseBody.getMessage());
					if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
						processResponse.setStatus("Failed");
						return ResponseEntity.badRequest().body(processResponse);
					}
				}

			}

//		} catch (HttpClientErrorException e) {
//			logger.error(e);
//
//			playResponse.setStatus("Failed");
//			playResponse.setMessage("Failed to generate provider token ");
//
//			String body = e.getResponseBodyAsString();
//			if (body != null && body.contains("Failed")) {
//				ProviderTokenResponse ur = e.getResponseBodyAs(ProviderTokenResponse.class);
//				playResponse.setMessage(ur.getMessage());
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

	@PostMapping("/playeventdetails")
	@ResponseBody
	public ResponseEntity<?> playEventDetails(@RequestBody PlayParam playParam, HttpServletRequest req, HttpServletResponse res) {

		PlayResponse playResponse = new PlayResponse();

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			return ResponseEntity.badRequest().body(null);
		}

		String playEventId = playParam.getPlayEventId().trim();

		String playEventDetailsHtml = "";

		if (playEventId != null) {

			List<VideoPlayEventDetailDto> playEventDetailList = dataService.findPlayEventDetail(playEventId);

			playEventDetailsHtml = WebUtility.getPlayEventDetailsHtml(playEventDetailList);

		}
		playResponse.setPlayEventDetailsHtml(playEventDetailsHtml);

		return ResponseEntity.ok().body(playResponse);

	}

	@PostMapping("/updateVideo")
	@ResponseBody
	public ResponseEntity<?> updateVideo(@RequestBody UpdateVideoRequestAdmin updateVideoRequestAdmin, HttpServletRequest req) throws Exception {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");
		try {

			String videoMasterId = updateVideoRequestAdmin.getVideoMasterId();

			String releaseDate = updateVideoRequestAdmin.getReleaseDate();
			String endDate = updateVideoRequestAdmin.getEndDate();

			if (videoMasterId != null && !videoMasterId.isEmpty() && WebUtility.isHtml(videoMasterId)) {
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

					// StringBuffer requestUrl = req.getRequestURL();

					PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
							// .header(HttpHeaders.REFERER, requestUrl.toString())
							.header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).bodyValue(payload).retrieve().bodyToMono(PlayerApiResponse.class).block();

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

	@PostMapping("/saveusertoken")
	@ResponseBody
	public ResponseEntity<?> saveUserToken(@RequestBody UserTokenRequestAdmin userTokenRequestAdmin, HttpServletRequest req, HttpServletResponse res) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		try {

			boolean validation = WebUtility.isValidRequest(req, res);
			if (!validation) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			String providerId = userTokenRequestAdmin.getProviderId();
			if (providerId == null || providerId.trim().length() == 0) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}
			if (providerId != null && providerId.trim().length() > 0) {
				if (WebUtility.isHtml(providerId)) {
					validater.setFailedMessage(processResponse, "Invalid Request", startTime);
					return ResponseEntity.badRequest().body(processResponse);
				}

			}

			UserTokenRequest userTokenRequest = new UserTokenRequest();
			userTokenRequest.setUserEmail(userTokenRequestAdmin.getUserEmail());
			userTokenRequest.setSourceId(userTokenRequestAdmin.getSourceId());
			userTokenRequest.setValidFromDate(userTokenRequestAdmin.getValidFromDate());
			userTokenRequest.setValidEndDate(userTokenRequestAdmin.getValidEndDate());

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

//					MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
//					
//
//					HttpEntity<UserTokenRequest> requestEntity = new HttpEntity<>(userTokenRequest, headers);
//
//					ResponseEntity<UploadResponse> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, UploadResponse.class);
//					UploadResponse body = responseEntity.getBody();
//
//					playResponse.setMessage(body.getMessage());
//					if (body.getStatus().equalsIgnoreCase("Failed")) {
//						playResponse.setStatus("Failed");
//					}

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

		} catch (Exception e) {

			logger.error(e);

			validater.setFailedMessage(processResponse, "Failed to get user token", startTime);

		}

		if (processResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(processResponse);
		} else {
			return ResponseEntity.ok().body(processResponse);
		}

//		String videoMasterIds = playParam.getVideoMasterIds();
//		String userEmail = playParam.getUserEmail();
//		String providerId = playParam.getProviderId();
//
//		if (videoMasterIds != null && !videoMasterIds.isEmpty() && WebUtility.isHtml(videoMasterIds)) {
//			playResponse.setStatus("Failed");
//			playResponse.setMessage("Invalid Request");
//			return ResponseEntity.badRequest().body(playResponse);
//		}
//
//		if (userEmail != null && !userEmail.isEmpty() && WebUtility.isHtml(userEmail)) {
//			playResponse.setStatus("Failed");
//			playResponse.setMessage("Invalid Request");
//			return ResponseEntity.badRequest().body(playResponse);
//		}
//
//		if (Utility.isValidEmail(userEmail) == false) {
//			playResponse.setStatus("Failed");
//			playResponse.setMessage("Invalid Request");
//			return ResponseEntity.badRequest().body(playResponse);
//		}
//
//		if (providerId != null && !providerId.isEmpty() && WebUtility.isHtml(providerId)) {
//			playResponse.setStatus("Failed");
//			playResponse.setMessage("Invalid Request");
//			return ResponseEntity.badRequest().body(playResponse);
//		}
//
//		String userId = dataService.findAndSaveUser(userEmail);
//
//		String[] masterIds = videoMasterIds.split(",");
//
//		Date current = new Date();
//
//		for (String videoMasterId : masterIds) {
//			UserVideoDto dto = new UserVideoDto();
//			dto.setUserId(userId);
//			dto.setVideoMasterId(videoMasterId);
//			dto.setCreatedDate(current);
//			dto.setUpdatedDate(current);
//
//			dataService.saveUserVideo(dto);
//		}
//
//		playResponse.setMessage("Successfully assigned videos to " + userEmail);
//
//		return ResponseEntity.ok().body(playResponse);
	}

//	@PostMapping("/getGridProviderVideos")
//	@ResponseBody
//	public ResponseEntity<?> getGridProviderVideos(@RequestBody PlayParam playParam, HttpServletRequest req, HttpServletResponse res) {
//		PlayResponse playResponse = new PlayResponse();
//
//		List<VideoMasterDto> videoMasterList = dataService.findAllActiveMaster(playParam.getProviderId());
//
//		
//		String userVideosHtml = WebUtility.getGridUserVideosHtml(videoMasterList);
//
//		playResponse.setGridUserVideosHtml(userVideosHtml);
//
//		boolean validation = WebUtility.isValidRequest(req, res);
//		if (!validation) {
//			return ResponseEntity.badRequest().body(null);
//		} else {
//			return ResponseEntity.ok().body(playResponse);
//		}
//	}

	@PostMapping("/saveConfiguration")
	@ResponseBody
	public ResponseEntity<?> saveConfigurationKeys(@RequestBody ConfigParam configParam, HttpServletRequest req, HttpServletResponse res) {

		ConfigResponse configResponse = new ConfigResponse();
		try {

			boolean validation = WebUtility.isValidRequest(req, res);
			if (!validation) {
				configResponse.setStatus("Failed");
				configResponse.setMessage("Invalid Request");
			}
			String msg = "";

			String providerId = configParam.getProviderId();
			String configKey = configParam.getConfigKey();
			String configValue = configParam.getConfigValue();

			if (providerId != null) {
				providerId = providerId.trim();
			}

			if ((providerId == null || providerId.isEmpty())) {
				configResponse.setStatus("Failed");
				configResponse.setMessage("Invalid Request");
			}

			String videoMasterId = configParam.getSelectVideo();
			if (providerId != null && !providerId.isEmpty() && WebUtility.isHtml(providerId)) {

				configResponse.setStatus("Failed");
				configResponse.setMessage("Invalid Request");

			}

			if ((providerId != null && !providerId.isEmpty())) {
				List<String> id = dataService.getproviderId(providerId);

				if (id == null || id.isEmpty()) {
					configResponse.setStatus("Failed");
					configResponse.setMessage("Invalid Request");

				}

			}

			if (videoMasterId != null && !videoMasterId.isEmpty() && WebUtility.isHtml(videoMasterId)) {

				configResponse.setStatus("Failed");
				configResponse.setMessage("Invalid Request");

			}

			if (videoMasterId != null && !videoMasterId.isEmpty()) {
				List<String> masterId = dataService.getVideoMasterId(videoMasterId);

				if (masterId == null || masterId.isEmpty()) {
					configResponse.setStatus("Failed");
					configResponse.setMessage("Invalid Request");
				}

			}
			if (configValue != null && !configValue.isEmpty() && WebUtility.isHtml(configValue)) {
				configResponse.setStatus("Failed");
				configResponse.setMessage("Invalid Request");
			}

			if (providerId != null && configKey != "select a key" && configValue != "") {

				String[] watermarkValues = { "Black", "Blue", "Cyan", "Gray", "Green", "Magenta", "Orange", "Pink", "Red", "White", "Yellow" };
				boolean existWaterMarkColor = false;
				boolean booleanVal = false;
				boolean numberVal = false;
				boolean textVal = false;

				if (configKey.equals("FullScreen") || configKey.equals("Mini-Player") || configKey.equals("PlayBackSpeed") || configKey.equals("Resolution") || configKey.equals("ShowLanguages") || configKey.equals("ShowTheaterMode") || configKey.equals("ShowVideoDescription")) {
					if (configValue.equals("True") || configValue.equals("False")) {
						booleanVal = true;
					}
				} else if (configKey.equals("InitialDelayTime") || configKey.equals("InitialFragmentsToActivemq") || configKey.equals("NextButtonShowTime") || configKey.equals("PlayerDelayTime") || configKey.equals("PlayFragmentsToActivemq") || configKey.equals("PreviousButtonShowTime") || configKey.equals("VideoDescriptionLength")
						|| configKey.equals("VideoForwardSeconds") || configKey.equals("VideoPreviewImageSeconds") || configKey.equals("VideoRewindSeconds")) {
					if (configValue.matches(".*[1-9].*") && !configValue.startsWith("0")) {
						numberVal = true;
					}
				} else if (configKey.equals("NextButtonShowText") || configKey.equals("PreviousButtonShowText")) {
					if (configValue.matches(".*[a-zA-z].*")) {
						textVal = true;
					}
				} else if (configKey.equals("WatermarkColor")) {
					for (String val : watermarkValues) {
						if (configValue.equals(val)) {
							existWaterMarkColor = true;
							break;
						}
					}
				}

				if (configKey.equals("VideoPreviewImageSeconds")) {
					if (videoMasterId != null && videoMasterId.length() > 0) {
						configResponse.setStatus("Failed");
						configResponse.setMessage("Invalid Request");
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

						List<ConfigurationVideoDto> pvKeysList = dataService.findAllProvidervideoConfigs();

						ObjectMapper objectMapper = new ObjectMapper();
						String jsonProviderVideoKeyList = objectMapper.writeValueAsString(pvKeysList);
						configResponse.setProviderVideoKeys(jsonProviderVideoKeyList);

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

						List<ConfigurationDto> pKeysList = dataService.findAllProviderConfigs();

						ObjectMapper objectMapper = new ObjectMapper();
						String jsonProviderKeyList = objectMapper.writeValueAsString(pKeysList);

						configResponse.setProviderKeys(jsonProviderKeyList);

						String url = playerUrl + "/" + Constants.player.initCacheConfig;

						logger.debug(url);

						String resp = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).retrieve().bodyToMono(String.class).block();
						logger.debug(resp);

					}
				} else {
					configResponse.setStatus("Failed");
					configResponse.setMessage("Invalid Request");
				}
			}

			configResponse.setStatus("Success");
			configResponse.setMessage(msg);

//		} catch (HttpClientErrorException e) {
//			logger.error(e);
//
//			configResponse.setStatus("Failed");
//			configResponse.setMessage("Failed to save configuration");
//
//			String body = e.getResponseBodyAsString();
//			if (body != null && body.contains("Failed")) {
//				UploadResponse ur = e.getResponseBodyAs(UploadResponse.class);
//				configResponse.setMessage(ur.getMessage());
//			}

		} catch (Exception e) {

			logger.error(e);

			configResponse.setStatus("Failed");
			configResponse.setMessage("Failed to save Configuration.");

		}

		if (configResponse.getStatus().equalsIgnoreCase("Failed")) {
			return ResponseEntity.badRequest().body(configResponse);
		} else {
			return ResponseEntity.ok().body(configResponse);
		}
	}

	@PostMapping("/updateUserStatus")
	@ResponseBody
	public ResponseEntity<?> updateUserStatus(@RequestBody UpdateUserRequest uur, HttpServletRequest req, HttpServletResponse res) {

		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");

		try {
			boolean validation = WebUtility.isValidRequest(req, res);
			if (!validation) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (uur == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			String providerName = "";

			List<UserDto> userDetails = dataService.findAllUsersByIds(uur.getUserIds());
			for (UserDto userDto : userDetails) {

				if (userDto.getProviderName() != null) {
					providerName = userDto.getProviderName();
					break;
				}

			}

//			List<ProviderDto> providerList = dataService.findUserProviders(userId);
//
//			if (providerList != null) {
//				for (ProviderDto dto : providerList) {
//					providerName = dto.getProviderName();
//					break;
//				}
//			}

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

	@PostMapping("/saveVideoAnalysis")
	@ResponseBody
	public ResponseEntity<?> saveVideoAnalysis(@RequestParam(value = "providerId", required = true) String providerId, @RequestParam(value = "sourceId", required = true) String sourceId, @RequestParam(value = "videoFile", required = false) MultipartFile videoFile) throws Exception {

		long startTime = System.currentTimeMillis();

		VideoAnalysisResponse processResponse = new VideoAnalysisResponse();
		processResponse.setStatus("Success");

		try {

			if (videoFile == null) {
				validater.setFailedMessage(processResponse, "video file required", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			ProviderTokenDto providerTokenDto = dataService.findProviderToken(providerId);

			if (providerTokenDto == null) {
				validater.setFailedMessage(processResponse, "Please generate provider token in Admin->Providers", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			} else {

				MultipartBodyBuilder builder = new MultipartBodyBuilder();
				builder.part("sourceId", sourceId);
				builder.part("videoFile", videoFile.getResource());

				String url = playerapiUrl + "/" + Constants.playerapi.videoanalysis;

				PlayerApiResponse responseBody = this.getWebClient().post().uri(url).body(BodyInserters.fromMultipartData(builder.build())).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).retrieve().bodyToMono(PlayerApiResponse.class).block();

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

	@PostMapping("/getVideoAnalysisProviderVideos")
	@ResponseBody
	public ResponseEntity<?> getVideoAnalysisProviderVideos(@RequestBody PlayParam playParam, HttpServletRequest req, HttpServletResponse res) throws JsonProcessingException {
		PlayResponse playResponse = new PlayResponse();
//		long startTime = System.currentTimeMillis();
//		String baseurl = webUtil.getBasePath(req);

		// UserDto userDto = dataService.findUserByEmail(playParam.getUserEmail());

//		Object userDto = req.getSession().getAttribute("userDto");
//
//		if (userDto == null) {
//			playResponse.setStatus("Failed");
//			playResponse.setMessage("Invalid Request");
//			return ResponseEntity.badRequest().body(playResponse);
//
//		}
//		

		List<VideoMasterDto> videoMasterList = dataService.findAllActiveMaster(playParam.getProviderId());

		if (videoMasterList != null) {

			SelectParam selectParam = new SelectParam();

			selectParam.setDataSource(videoMasterList);
			// selectParam.setOnchangeFunction("videoAnalysisVideoChange(this)");
			selectParam.setValueField("id");
			selectParam.setTextField("label");
			selectParam.setId("selectVideo");
			selectParam.setMaxLength(25);
			selectParam.setPlaceHolder("Select Video");
			selectParam.setAdditionalField("sourceId");
			selectParam.setHeight(400);

			String html = WebUtility.getSelectHtml(selectParam);

			playResponse.setVideoSelecItems(html);

		}

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			return ResponseEntity.badRequest().body(null);
		} else {
			return ResponseEntity.ok().body(playResponse);
		}
	}

	@PostMapping("/getAspectRatioWidths")
	@ResponseBody
	public ResponseEntity<?> getAspectRatioWidths(@RequestParam(value = "aspectRatio", required = true) String aspectRatio, HttpServletRequest req, HttpServletResponse res) throws JsonProcessingException {
		PlayResponse playResponse = new PlayResponse();

		List<AspectRatioKeyDto> dtoList = dataService.findAspectRatioKeys(aspectRatio);

		SelectParam selectParam = new SelectParam();

		selectParam.setDataSource(dtoList);
		selectParam.setValueField("widthHeight");
		selectParam.setTextField("widthHeight");
		selectParam.setId("selectAspectRatioWidthHeight");
		selectParam.setMaxLength(35);
		selectParam.setPlaceHolder("Select WidthxHeight");
		selectParam.setHeight(400);

		String html = WebUtility.getSelectHtml(selectParam);

		playResponse.setAspectRatioWidthsHtml(html);

		boolean validation = WebUtility.isValidRequest(req, res);
		if (!validation) {
			res.setHeader("Message", "Invalid Request");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		} else {
			return ResponseEntity.ok().body(playResponse);
		}
	}

	@PostMapping("/saveUser")
	@ResponseBody
	public ResponseEntity<?> saveUser(@RequestBody SaveUserRequestAdmin sur, HttpServletRequest req, HttpServletResponse res) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");
		try {

			boolean validation = WebUtility.isValidRequest(req, res);
			if (!validation) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (sur == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			ProviderDto providerDto = dataService.findProvider(sur.getProviderName());

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

				PlayerApiResponse responseBody = this.getWebClient().post().uri(url).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE).header(HttpHeaders.AUTHORIZATION, providerTokenDto.getToken()).bodyValue(sur).retrieve().bodyToMono(PlayerApiResponse.class).block();

				if (responseBody != null) {
					processResponse.setMessage(responseBody.getMessage());
					if (responseBody.getStatus().equalsIgnoreCase("Failed")) {
						processResponse.setStatus("Failed");
						return ResponseEntity.badRequest().body(processResponse);
					}
				}

			}

//		} catch (HttpClientErrorException e) {
//			logger.error(e);
//
//			playResponse.setStatus("Failed");
//			playResponse.setMessage("Failed to generate provider token ");
//
//			String body = e.getResponseBodyAsString();
//			if (body != null && body.contains("Failed")) {
//				ProviderTokenResponse ur = e.getResponseBodyAs(ProviderTokenResponse.class);
//				playResponse.setMessage(ur.getMessage());
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

	@PostMapping("/getProviderUsers")
	@ResponseBody
	public ResponseEntity<?> getProviderUsers(@RequestBody PlayParam playParam, HttpServletRequest req, HttpServletResponse res) {
		PlayResponse playResponse = new PlayResponse();

		List<UserDto> dtoList = dataService.findProviderUsers(playParam.getProviderId());

		SelectParam selectParam = new SelectParam();

		selectParam.setDataSource(dtoList);
		selectParam.setValueField("id");
		selectParam.setTextField("userEmail");
		selectParam.setId("selectUser");
		selectParam.setMaxLength(35);
		selectParam.setPlaceHolder("Select User Email");
		selectParam.setHeight(350);

		String html = WebUtility.getSelectHtml(selectParam);

		playResponse.setProviderUserHtml(html);

		boolean validation = WebUtility.isValidRequest(req, res);

		if (!validation) {
			return ResponseEntity.badRequest().body(null);
		} else {
			return ResponseEntity.ok().body(playResponse);
		}
	}

	@PostMapping("/impersonate")
	@ResponseBody
	public ResponseEntity<?> impersonate(@RequestBody PlayParam param, HttpServletRequest req, HttpServletResponse res) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();		
		processResponse.setStatus("Success");
		
		try {

			boolean validation = WebUtility.isValidRequest(req, res);
			if (!validation) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (param == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (param.getUserId() == null || param.getUserId().trim().length() == 0) {

				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (validater.isHtml(param.getUserId().trim())) {

				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			UserDto userDto = dataService.findUserById(param.getUserId().trim());

			if (userDto == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (userDto.getActive().equalsIgnoreCase("false")) {
				validater.setFailedMessage(processResponse, "Cannot impersonate as user is inactive", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			req.getSession().setAttribute("userDto", userDto);
			req.getSession().setAttribute("userImpersonate", true);

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

	@PostMapping("/getLog")
	@ResponseBody
	public ResponseEntity<?> getLog(@RequestBody PlayParam param, HttpServletRequest req, HttpServletResponse res) {
		long startTime = System.currentTimeMillis();
		PlayerApiResponse processResponse = new PlayerApiResponse();
		processResponse.setStatus("Success");
		processResponse.setResponseData("");
		try {

			boolean validation = WebUtility.isValidRequest(req, res);
			if (!validation) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (param == null) {
				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (param.getVideoMasterId() == null || param.getVideoMasterId().trim().length() == 0) {

				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			if (validater.isHtml(param.getVideoMasterId().trim())) {

				validater.setFailedMessage(processResponse, "Invalid Request", startTime);
				return ResponseEntity.badRequest().body(processResponse);
			}

			File fileHotFolder = new File(hotFolder);

			File fileVideoFiles = new File(fileHotFolder.getParent() + "/" + Constants.videoFilesFolder);

			File finalVideoFiles = new File(fileVideoFiles.getPath(), param.getVideoMasterId().trim());

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

}
