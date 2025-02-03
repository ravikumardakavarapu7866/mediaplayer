package com.app.util;

import java.lang.reflect.InvocationTargetException;
import java.text.DecimalFormat;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.util.HtmlUtils;

import com.app.data.dto.ConfigurationDto;
import com.app.data.dto.UserDto;
import com.app.data.dto.VideoDetailUserDto;
import com.app.data.dto.VideoMasterDto;
import com.app.data.dto.VideoPlayEventDetailDto;
import com.app.data.util.Constants;
import com.app.data.util.SelectParam;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class WebUtility {

	private static final Logger logger = LogManager.getLogger(WebUtility.class);

//	private static String failed = "processFailed";
//	private static String temp = "temp";

	public static List<ConfigurationDto> getConfigSelectKeys() {
		List<ConfigurationDto> items = new ArrayList<ConfigurationDto>();

		ConfigurationDto dto = new ConfigurationDto();
		dto.setConfigType("boolean");
		dto.setConfigKey("FullScreen");
		dto.setDescription("Show Full Screen Button");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("InitialDelayTime");
		dto.setDescription("Initial Delay Time Before Player Is Shown");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("InitialFragmentsToActivemq");
		dto.setDescription("Initial Fragments To Process Before Player Is Shown");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("boolean");
		dto.setConfigKey("Mini-Player");
		dto.setDescription("Show Mini Player Button");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("text");
		dto.setConfigKey("NextButtonShowText");
		dto.setDescription("Next Episode Button Text");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("NextButtonShowTime");
		dto.setDescription("Show Next Episode Button N seconds Before End Time");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("boolean");
		dto.setConfigKey("PlayBackSpeed");
		dto.setDescription("Show Play Back Speed Button");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("PlayerDelayTime");
		dto.setDescription("Player Delay Time Before Fragment Is Processed While Video Fragment Is Playing");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("PlayFragmentsToActivemq");
		dto.setDescription("Number Of Fragmensts To Process While Fragment Is Playing");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("text");
		dto.setConfigKey("PreviousButtonShowText");
		dto.setDescription("Previous Episode Button Text");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("PreviousButtonShowTime");
		dto.setDescription("Show Previous Episode Button After N Seconds Of Play Time");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("boolean");
		dto.setConfigKey("Resolution");
		dto.setDescription("Show Resolution Change Button");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("boolean");
		dto.setConfigKey("ShowLanguages");
		dto.setDescription("Show Languages Button");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("boolean");
		dto.setConfigKey("ShowTheaterMode");
		dto.setDescription("Show Theater Mode Button");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("boolean");
		dto.setConfigKey("ShowVideoDescription");
		dto.setDescription("Show Video Description On Video");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("VideoDescriptionLength");
		dto.setDescription("The Length Of Video Description To Show On Video");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("VideoForwardSeconds");
		dto.setDescription("The Number Of Seconds To Forward Video");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("VideoPreviewImageSeconds");
		dto.setConfigKey("The Preview Image For Every N Number Of Seconds");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("number");
		dto.setConfigKey("VideoRewindSeconds");
		dto.setDescription("The Number Of Seconds To Rewind Video");
		items.add(dto);

		dto = new ConfigurationDto();
		dto.setConfigType("chooseColor");
		dto.setConfigKey("WatermarkColor");
		dto.setDescription("The Watermark Color");
		items.add(dto);

		return items;
	}

	public static Integer getVideoImageSeconds(String videoImageSeconds) {
		Integer seconds = 10;

		try {
			seconds = Integer.parseInt(videoImageSeconds);
		} catch (NumberFormatException nfe) {
			seconds = 10;
		}

		return seconds;
	}

	public static String getAspectRatio(Integer width, Integer height) {

		if (width == 854 && height == 480) {
			return "16:9";
		}

		Integer greatestFactor = GCF(width, height);

		Integer widthAspect = width / greatestFactor;
		Integer heightAspect = height / greatestFactor;

		return widthAspect + ":" + heightAspect;

	}

	public static Integer GCF(Integer width, Integer height) {
		if (height == 0) {
			return width;
		} else {
			return (GCF(height, width % height));
		}
	}

	public static void getMenuItems(Model model, String baseurl, UserDto userDto, HttpServletRequest req) {

		StringBuffer sbMenu = new StringBuffer();
		
		HttpSession httpSession = req.getSession();
	
		if(httpSession.getAttribute("userImpersonate") != null && httpSession.getAttribute("userImpersonate").toString().equalsIgnoreCase("true") ) {
			sbMenu.append("<span class=\"home-link\" style=\"cursor: pointer;padding-right:20px;\" >");
			sbMenu.append("<a  onclick=\"javascript:submitFormAction('"+ baseurl + "/end')\"> End Impersonate");
			sbMenu.append("</a>");
			sbMenu.append("</span>");
		}

		if (Constants.adminRoles.contains(userDto.getRole())) {

			sbMenu.append("<span class=\"dropdown-toggle user-Logintxt\" onClick=\"javascript:{}\" role=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"> Admin </span> <span>");

			sbMenu.append("<ul class=\"dropdown-menu\" onclick=\"javascript:submitMenu(event,'" + baseurl + "')\">");

			sbMenu.append("<li><span class=\"dropdown-item drop-list-Aspect\" onclick=\"javascript:{}\">Aspect Ratios</span></li>");

			if (Constants.superAdmin.equalsIgnoreCase(userDto.getRole())) {
				sbMenu.append("<li><span class=\"dropdown-item drop-list-AuthorizationFailures\" onclick=\"javascript:{}\">Authorization Failures</span></li>");
			}
			sbMenu.append("<li><span class=\"dropdown-item drop-list-Configuration\" onclick=\"javascript:{}\">Configuration</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-Consumer\" onclick=\"javascript:{}\">Consumer Process</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-Delete\" onclick=\"javascript:{}\">Delete Videos</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-PlayerRequests\" onclick=\"javascript:{}\">Player Requests</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-Providers\" onclick=\"javascript:{}\">Providers</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-Thumbnail\" onclick=\"javascript:{}\">Thumbnail Upload</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-Upload\" onclick=\"javascript:{}\">Upload</span></li>");

			sbMenu.append("<li><span class=\"dropdown-item drop-list-UserImpersonate\" onclick=\"javascript:{}\">User Impersonate</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-UserManagement\" onclick=\"javascript:{}\">User Management</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-UserTokens\" onclick=\"javascript:{}\">User Tokens</span></li>");

			// sbMenu.append("<li><span class=\"dropdown-item drop-list-VideoAnalysis\"
			// onclick=\"javascript:{}\">Video Analysis</span></li>");

			sbMenu.append("<li><span class=\"dropdown-item drop-list-Videosplayevents\" onclick=\"javascript:{}\">Videos Play Events</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-Videosplayback\" onclick=\"javascript:{}\">Videos Playback Information</span></li>");
			sbMenu.append("<li><span class=\"dropdown-item drop-list-VideosUpload\" onclick=\"javascript:{}\">Videos Upload Status</span></li>");

			sbMenu.append("</ul>");

			sbMenu.append("</span>");
		}

		model.addAttribute("menuItems", sbMenu.toString());

	}

//	public static String getConfigProviderVideos(List<VideoMasterDto> videoMasterList, Integer videoLength) {
//
//		String events = getSelectEvents(null);
//
//		StringBuffer sb = new StringBuffer();
//		sb.append("<select id=\"selectVideo\" class=\"providerConfig\" " + events + ">");
//
//		sb.append("<option selected value=\"\">Select Video</option>");
//
//		if (videoMasterList != null && videoMasterList.isEmpty() == false) {
//
//			String label = "";
//
//			for (VideoMasterDto dto : videoMasterList) {
//
//				if (dto.getSeasonNumber() != null && dto.getSeasonNumber().length() > 0) {
//					label = dto.getVideoName() + ", S " + dto.getSeasonNumber() + " E " + dto.getEpisodeNumber() + " " + dto.getEpisodeName() + " " + dto.getLanguage();
//				} else {
//					label = dto.getVideoName() + " " + dto.getLanguage();
//				}
//
//				String truncatedLabel = null;
//				if (label != null && label.length() > videoLength) {
//					truncatedLabel = label.substring(0, videoLength) + "...";
//					sb.append("<option title=\"" + label + "\" value=\"" + dto.getId() + "\">" + truncatedLabel + "</option>");
//				} else {
//					truncatedLabel = label;
//					sb.append("<option value=\"" + dto.getId() + "\">" + truncatedLabel + "</option>");
//				}
//
//			}
//
//		}
//
//		sb.append("</select>");
//
//		return sb.toString();
//	}

//	public static String getThumbnailProviderVideos(List<VideoMasterDto> videoMasterList) {
//
//		String events = getSelectEvents(null);
//
//		StringBuffer sb = new StringBuffer();
//		sb.append("<select id=\"selectVideo\" class=\"thumbnailProviderVideo\" " + events + ">");
//
//		sb.append("<option selected value=\"\">Select Video</option>");
//
//		if (videoMasterList != null && videoMasterList.isEmpty() == false) {
//
//			String label = "";
//
//			for (VideoMasterDto dto : videoMasterList) {
//
//				if (dto.getSeasonNumber() != null && dto.getSeasonNumber().length() > 0) {
//					label = dto.getVideoName() + ", S " + dto.getSeasonNumber() + " E " + dto.getEpisodeNumber() + " " + dto.getEpisodeName() + " " + dto.getLanguage();
//				} else {
//					label = dto.getVideoName() + " " + dto.getLanguage();
//				}
//
//				String truncatedLabel = null;
//				if (label != null && label.length() > 200) {
//					truncatedLabel = label.substring(0, 200) + "...";
//				} else {
//					truncatedLabel = label;
//				}
//
//				sb.append("<option title=\"" + label + "\" value=\"" + dto.getId() + "\">" + truncatedLabel + "</option>");
//
//			}
//
//		}
//
//		sb.append("</select>");
//
//		return sb.toString();
//	}

//	private static String getVideoKey(String ffmpegPath, File fileInput, String key) {
//
//		String output = "";
//
//		try {
//
//			// D:/ffmpeg/bin/ffprobe.exe
//			// -i D:/test/720-sample_1280x720_surfing_with_audio.mp4
//			// -v quiet -show_entries stream=codec_type -of
//			// default=noprint_wrappers=1:nokey=1
//			File f = new File(ffmpegPath);
//
//			File fileProbe = new File(f.getParent(), "ffprobe.exe");
//
//			List<String> commandList = new ArrayList<String>();
//
//			commandList = new ArrayList<String>();
//
//			commandList.add(fileProbe.getAbsolutePath().replace("\\", "/"));
//
//			commandList.add("-i");
//
//			commandList.add(fileInput.getAbsolutePath().replace("\\", "/"));
//
//			commandList.add("-v");
//			commandList.add("quiet");
//
//			commandList.add("-show_entries");
//			commandList.add("stream=" + key);
//
//			commandList.add("-of");
//			commandList.add("default=noprint_wrappers=1:nokey=1");
//
//			logger.debug(commandList);
//
//			ProcessBuilder pb = new ProcessBuilder(commandList);
//			Process p = pb.start();
//
//			output = new String(p.getInputStream().readAllBytes());
//
//			// logger.debug("duration=" + duration);
//
//		} catch (Exception e) {
//			// e.printStackTrace();
//			logger.error(e);
//			output = "";
//		}
//
//		return output;
//	}

	public static String getSelectEvents(String onChange) {

		if (onChange != null && onChange.length() > 0) {
			String events = " onmousedown=\"if(this.options.length>12){this.size=12;}\" onchange=\"" + onChange + "\" ";

			return events;
		} else {
			String events = " onmousedown=\"if(this.options.length>12){this.size=12;}\" onchange=\"this.size=0;\"  ";

			return events;
		}

	}

	public static boolean isValidRequest(HttpServletRequest req, HttpServletResponse res) {
		boolean valid = true;
		// validate the RefererUrl
		var blockRegx = "[a-zA-Z0-9/.:]+";
		String refererUrl = req.getHeader("Referer");
		if (refererUrl != null && !refererUrl.matches(blockRegx)) {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			valid = false;
		}

		return valid;
	}

	public static boolean isValidEmail(String userEmail) {
		String regex = "^[A-Za-z0-9](([_\\.\\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\\.\\-\\_]?[a-zA-Z0-9]+)*)\\.([A-Za-z]{2,})$";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(userEmail);
		return matcher.matches();
	}

	public static boolean isHtml(String input) {
		boolean isHtml = false;
		if (input != null) {
			// need to allow ampersand as input
			input = input.replaceAll("&", "");
			if (!input.equals(HtmlUtils.htmlEscape(input))) {
				isHtml = true;
			}
		}
		return isHtml;
	}

	public static boolean isValidCurrentPage(String input) {
		boolean valid = true;
		if (input != null) {
			var blockwatermark = "(^[1-9][0-9]*$)";
			if (input != null && !input.matches(blockwatermark)) {
				valid = false;
			}
		}
		return valid;
	}

//	private static void cropImage(BufferedImage originalImage, File target, int targetWidth, int targetHeight) throws IOException {
//		BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
//		Graphics2D graphics2D = resizedImage.createGraphics();
//		graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
//		graphics2D.dispose();
//
//		String s = target.getName().toString();
//		String fileExtension = s.substring(s.lastIndexOf(".") + 1);
//
//// we want image in png format
//		ImageIO.write(resizedImage, fileExtension, target);
//
//	}

//	private static void resizeImage(BufferedImage originalImage, File target, int width, int height) throws IOException {
//
//// read an image to BufferedImage for processing
//		// BufferedImage originalImage = ImageIO.read(input);
//
//// create a new BufferedImage for drawing
//		BufferedImage newResizedImage = new BufferedImage(width, height, originalImage.getColorModel().getNumComponents());
//		Graphics2D g = newResizedImage.createGraphics();
//
////g.setBackground(Color.WHITE);
////g.setPaint(Color.WHITE);
//
//// background transparent
//		g.setComposite(AlphaComposite.Src);
//		g.fillRect(0, 0, width, height);
//
//		/*
//		 * try addRenderingHints() // VALUE_RENDER_DEFAULT = good tradeoff of
//		 * performance vs quality // VALUE_RENDER_SPEED = prefer speed //
//		 * VALUE_RENDER_QUALITY = prefer quality
//		 * g.setRenderingHint(RenderingHints.KEY_RENDERING,
//		 * RenderingHints.VALUE_RENDER_QUALITY);
//		 * 
//		 * // controls how image pixels are filtered or resampled
//		 * g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
//		 * RenderingHints.VALUE_INTERPOLATION_BILINEAR);
//		 * 
//		 * // antialiasing, on g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
//		 * RenderingHints.VALUE_ANTIALIAS_ON);
//		 */
//
//		Map<RenderingHints.Key, Object> hints = new HashMap<>();
//		hints.put(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
//		hints.put(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
//		hints.put(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
//		g.addRenderingHints(hints);
//
//// puts the original image into the newResizedImage
//		g.drawImage(originalImage, 0, 0, width, height, null);
//		g.dispose();
//
//// get file extension
//		String s = target.getName().toString();
//		String fileExtension = s.substring(s.lastIndexOf(".") + 1);
//
//// we want image in png format
//		ImageIO.write(newResizedImage, fileExtension, target);
//
//	}

	public static HashMap<String, Object> getHomeVideos(List<VideoMasterDto> videoMasterList, String playerUrl, String baseUrl) {

		HashMap<String, Object> returnMap = new HashMap<String, Object>();

		// StringBuffer sb = new StringBuffer();
		StringBuffer sbMovies = new StringBuffer();
		StringBuffer sbSeasons = new StringBuffer();

		// String events = WebUtility.getSelectEvents(null);
		// String events = WebUtility.getSelectEvents("homeVideoChange(this)");

		HashMap<String, List<VideoMasterDto>> seasonCheck = new HashMap<String, List<VideoMasterDto>>();
		List<VideoMasterDto> seasonEpisodes = new ArrayList<VideoMasterDto>();
		String seasonKey = "";

		if (videoMasterList != null && videoMasterList.isEmpty() == false) {
			boolean hasMovies = false;
			for (VideoMasterDto dto : videoMasterList) {
				if (dto.getType().equalsIgnoreCase(Constants.movie)) {
					sbMovies.append("<h2 class=\"mt-2\">Movies</h2>");
					hasMovies = true;
					break;
				}

			}

			sbMovies.append("<div class=\"owl-carousel carousel-movies\">");

			// sb.append("<select id=\"selectVideo\" style=\"width:95%\" " + events + ">");

			String label = "";

			String thumbnailPath = "";

			String truncatedDescription = "";

			int series = 1;

			String selectId = "selectVideo";

			for (int i = 0; i < videoMasterList.size(); i++) {
				VideoMasterDto dto = videoMasterList.get(i);

				if (dto.getSeasonNumber() != null && dto.getSeasonNumber().length() > 0) {
					StringBuffer sbLabel = new StringBuffer();
					if (dto.getVideoName().length() > 25) {
						sbLabel.append(dto.getVideoName().substring(0, 25));
					} else {
						sbLabel.append(dto.getVideoName());
					}
					sbLabel.append(", S " + dto.getSeasonNumber() + " E ");
					if (dto.getEpisodeName().length() > 25) {
						sbLabel.append(dto.getEpisodeName().substring(0, 25));
					} else {
						sbLabel.append(dto.getEpisodeName());
					}
					label = sbLabel.toString();

				} else {
					label = dto.getVideoName() + " " + dto.getLanguage();
				}

//				String truncatedLabel = null;
//				if (label != null && label.length() > 35) {
//					truncatedLabel = label.substring(0, 35) + "...";
//				} else {
//					truncatedLabel = label;
//				}

				// sb.append("<option onclick=\"dropClick()\" title=\"" + label + "\"
				// data-auth=\"" + dto.getAuthKey() + "\" value=\"" + dto.getId() + "\">" +
				// truncatedLabel + "</option>");

				if (dto.getType().equalsIgnoreCase(Constants.movie)) {

					thumbnailPath = playerUrl + "/" + dto.getId() + "/thumb.jpg";
					if (dto.getVideoName().length() > 25) {
						label = dto.getVideoName().substring(0, 25) + "..." + " " + dto.getLanguage();
					} else {
						label = dto.getVideoName() + " " + dto.getLanguage();
					}

					if (dto.getVideoDescription() != null && dto.getVideoDescription().length() > 30) {
						truncatedDescription = dto.getVideoDescription().substring(0, 30) + "...";
					} else {
						truncatedDescription = dto.getVideoDescription();
					}

					sbMovies.append("<div class=\"item\"> ");
					sbMovies.append("	<div class=\"img-wrapper\"> ");
					sbMovies.append("		<img class=\"thumbMovies\" src='" + thumbnailPath + "' alt='' />  ");
					sbMovies.append("		<div class=\"content slide-left d-block\">  ");
					sbMovies.append("			<div class=\"video-pp\">  ");

					if (dto.getVideoDescription() != null && dto.getVideoDescription().length() > 30) {
						sbMovies.append("	<p onmouseenter=\"enterMouse(this,'" + selectId + "')\" data-tip=\"" + dto.getVideoDescription() + "\"  type=\"VideoDescription\" onmouseout=\"leaveMouse(this,'" + selectId + "')\"\" class=\"pt-3 \">" + truncatedDescription + "</span>  ");
					} else {
						sbMovies.append(" <p class=\"pt-3 \">" + truncatedDescription + "</p> ");
					}
					sbMovies.append("				<div class=\"video_playbtn\">  ");
					sbMovies.append("					<button type=\"button\" class=\"btn btn12\" onclick=\"javascript:submitPlayAction('" + baseUrl + "/play', '" + dto.getProviderId() + "', '" + dto.getId() + "', '" + dto.getUserToken() + "',false)\" >");
					sbMovies.append(" 						<i class=\"material-icons\"> play_arrow </i>  ");
					sbMovies.append("					</button>  ");
					sbMovies.append("				</div> ");
					sbMovies.append(" 			</div>  ");
					sbMovies.append(" 		</div>  ");

					sbMovies.append("         <div class=\"img-text\" >  ");

					if (dto.getVideoName().length() > 25) {
						sbMovies.append("	<span onmouseenter=\"enterMouse(this,'" + selectId + "')\" data-tip=\"" + dto.getVideoName() + "\" onmouseout=\"leaveMouse(this,'" + selectId + "')\"\" class=\"\">" + label + "</span>  ");
					} else {
						sbMovies.append(" <span class=\"\">" + label + "</span> ");
					}

					sbMovies.append("    </div>  ");
					sbMovies.append("	</div>  ");

					if (dto.getViewed()) {
						sbMovies.append("	<div style=\"margin-left:15px;margin-top:5px;\">  ");
						sbMovies.append("		<button type=\"button\" class=\"play-btn-begin\" onclick=\"javascript:submitPlayAction('" + baseUrl + "/play', '" + dto.getProviderId() + "', '" + dto.getId() + "', '" + dto.getUserToken() + "',true)\" >");
						sbMovies.append(" 			Play From Begin  ");
						sbMovies.append("		</button>  ");
						sbMovies.append("	</div> ");
					}

					sbMovies.append("</div>  ");
				} else if (dto.getType().equalsIgnoreCase(Constants.seasons)) {

					if (dto.getVideoName().length() > 25) {
						seasonKey = dto.getProviderName() + "_" + dto.getVideoName().substring(0, 25) + "..." + "_" + dto.getSeasonNumber();
					} else {
						seasonKey = dto.getProviderName() + "_" + dto.getVideoName() + "_" + dto.getSeasonNumber();
					}

					// seasonKey = dto.getProviderName() + "_" + dto.getSeasonNumber();

					if (seasonCheck.containsKey(seasonKey)) {
						seasonEpisodes = seasonCheck.get(seasonKey);
					} else {
						seasonEpisodes = new ArrayList<VideoMasterDto>();
					}

					seasonEpisodes.add(dto);

					seasonCheck.put(seasonKey, seasonEpisodes);

				}

			}

			// sb.append("</select>");

			if (seasonCheck.isEmpty() == false) {

				if (hasMovies) {
					sbSeasons.append("<h2 class=\"mt-4\">Web Series</h2>");
				} else {
					sbSeasons.append("<h2 class=\"mt-2\">Web Series</h2>");
				}

				ArrayList<String> sortedKeys = new ArrayList<String>(seasonCheck.keySet());

				Collections.sort(sortedKeys, new Comparator<String>() {
					public int compare(String o1, String o2) {

						String o1StringPart = o1.replaceAll("\\d", "");
						String o2StringPart = o2.replaceAll("\\d", "");

						if (o1StringPart.equalsIgnoreCase(o2StringPart)) {
							return extractInt(o2) - extractInt(o1);
						}
						return o1.compareTo(o2);
					}

					int extractInt(String s) {
						String num = s.replaceAll("\\D", "");
						// return 0 if no digits found
						return num.isEmpty() ? 0 : Integer.parseInt(num);
					}
				});

				for (String key : sortedKeys) {
					List<VideoMasterDto> items = seasonCheck.get(key);

					// ArrayList<VideoMasterDto> sortedItems = new ArrayList<VideoMasterDto>());

					Collections.sort(items, new Comparator<VideoMasterDto>() {
						@Override
						public int compare(VideoMasterDto o1, VideoMasterDto o2) {
							// return o2.getEpisodeNumber().compareTo(o1.getEpisodeNumber());
							int c;
							c = o2.getEpisodeNumber().compareTo(o1.getEpisodeNumber());
							if (c == 0) {
								c = o2.getCreatedDate().compareTo(o1.getCreatedDate());
							}
							return c;
						}
					});

					if (items.get(0).getVideoName().length() > 25) {
						sbSeasons.append("	<h5 onmouseenter=\"enterMouse(this,'" + selectId + "')\" data-tip=\"" + items.get(0).getVideoName() + "\" onmouseout=\"leaveMouse(this,'" + selectId + "')\"\" class=\"pt-3\">" + items.get(0).getVideoName().substring(0, 25) + "..." + "Season" + items.get(0).getSeasonNumber() + "</h5>  ");

					} else {
						sbSeasons.append("<h5 class=\"sesName-text mt-3 mb-3\" > " + items.get(0).getVideoName() + " Season " + items.get(0).getSeasonNumber() + "</h5>  ");
					}

					sbSeasons.append("<div class=\"owl-carousel carousel-" + series + "\">");

					for (VideoMasterDto dtoTemp : items) {
						if (dtoTemp.getEpisodeName().length() > 25) {
							label = "E " + dtoTemp.getEpisodeNumber() + " " + dtoTemp.getEpisodeName().substring(0, 25) + "..." + " " + dtoTemp.getLanguage();
						} else {
							label = "E " + dtoTemp.getEpisodeNumber() + " " + dtoTemp.getEpisodeName() + " " + dtoTemp.getLanguage();
						}

						if (dtoTemp.getVideoDescription() != null && dtoTemp.getVideoDescription().length() > 30) {
							truncatedDescription = dtoTemp.getVideoDescription().substring(0, 30) + "...";
						} else {
							truncatedDescription = dtoTemp.getVideoDescription();
						}

						thumbnailPath = playerUrl + "/" + dtoTemp.getId() + "/thumb.jpg";

						sbSeasons.append("<div class=\"item\"> ");
						sbSeasons.append("	<div class=\"img-wrapper\"> ");
						sbSeasons.append("		<img class=\"thumbSeries\" src='" + thumbnailPath + "' alt='' />  ");
						sbSeasons.append("		<div class=\"content slide-left d-block\">  ");
						sbSeasons.append("			<div class=\"video-pp\">  ");

						if (dtoTemp.getVideoDescription() != null && dtoTemp.getVideoDescription().length() > 30) {
							sbSeasons.append("	<p onmouseenter=\"enterMouse(this,'" + selectId + "')\" data-tip=\"" + dtoTemp.getVideoDescription() + "\"  type=\"VideoDescription\" onmouseout=\"leaveMouse(this,'" + selectId + "')\"\" class=\"pt-3\">" + truncatedDescription + "</p>  ");

						} else {
							sbSeasons.append(" <p class=\"pt-3 \">" + truncatedDescription + "</p> ");
						}

						sbSeasons.append("				<div class=\"video_playbtn\">  ");
						sbSeasons.append("					<button type=\"button\" class=\"btn btn12\" onclick=\"javascript:submitPlayAction('" + baseUrl + "/play', '" + dtoTemp.getProviderId() + "', '" + dtoTemp.getId() + "', '" + dtoTemp.getUserToken() + "', false)\" >");
						sbSeasons.append(" 						<i class=\"material-icons\"> play_arrow </i>  ");
						sbSeasons.append("					</button>  ");
						sbSeasons.append("				</div> ");
						sbSeasons.append(" 			</div>  ");
						sbSeasons.append(" 		</div>  ");

						if (dtoTemp.getEpisodeName().length() > 25) {
							sbSeasons.append("	<span onmouseenter=\"enterMouse(this,'" + selectId + "')\" data-tip=\"" + dtoTemp.getEpisodeName() + "\" onmouseout=\"leaveMouse(this,'" + selectId + "')\"\" class=\"img-text\">" + label + "</span>  ");
						} else {
							sbSeasons.append(" <span class=\"img-text\">" + label + "</span> ");
						}
						sbSeasons.append("	</div>  ");

						if (dtoTemp.getViewed()) {
							sbSeasons.append("	<div style=\"margin-left:15px;margin-top:5px;\">  ");
							sbSeasons.append("		<button type=\"button\" class=\"play-btn-begin\" onclick=\"javascript:submitPlayAction('" + baseUrl + "/play', '" + dtoTemp.getProviderId() + "', '" + dtoTemp.getId() + "', '" + dtoTemp.getUserToken() + "',true)\" >");
							sbSeasons.append(" 			Play From Begin  ");
							sbSeasons.append("		</button>  ");
							sbSeasons.append("	</div> ");
						}

						sbSeasons.append("</div>  ");
					}

					sbSeasons.append("</div>");

					sbSeasons.append("<script>");
					sbSeasons.append("$('.carousel-" + series + "').owlCarousel({ ");
					sbSeasons.append("autoWidth:true, ");//
					sbSeasons.append("	margin : 10,");
					sbSeasons.append("	nav : true,");
					sbSeasons.append("	dots : false,");
					sbSeasons.append("	navText : [ '<i class=\"material-icons nav-buttons\">arrow_back</i>', '<i class=\"material-icons nav-buttons\">arrow_forward</i>' ],");
					sbSeasons.append("});");
					sbSeasons.append("</script>");
					series++;
				}

			}

			sbMovies.append("</div>");

			sbMovies.append("<script>");
			sbMovies.append("$('.carousel-movies').owlCarousel({ ");
			sbMovies.append("autoWidth:true, ");
			/* sbMovies.append(" mouseDrag: false,"); */
			sbMovies.append("	margin : 10,");
			sbMovies.append("	nav : true,");
			sbMovies.append("	dots : false,");
			sbMovies.append("	navText : [ '<i class=\"material-icons nav-buttons\">arrow_back</i>', '<i class=\"material-icons nav-buttons\">arrow_forward</i>' ],");
			sbMovies.append("});");
			sbMovies.append("</script>");
		}

		returnMap.put("videoMovies", sbMovies.toString());

		returnMap.put("videoSeries", sbSeasons.toString());

		return returnMap;

	}

//	private static void updateImageError(String message, VideoMasterDto videoMasterDto, VideoService videoService) {
//		logger.error(message);
//
//		if (videoMasterDto != null) {
//
//			try {
//				videoMasterDto.setStatus("Failed");
//				videoMasterDto.setStatusMessage("Failed to upload image");
//				videoMasterDto.setActive(false);
//
//				videoService.saveVideoMaster(videoMasterDto);
//			} catch (Exception e) {
//				logger.error(e);
//			}
//		}
//
//	}

	public static String getVideoProgressRecords(List<VideoDetailUserDto> videoDetailUserList) {

		StringBuffer sb = new StringBuffer();

		if (videoDetailUserList != null && videoDetailUserList.isEmpty() == false) {

			sb.append("<table>");
			sb.append("<tr class=\"gridHeader\">");

			sb.append("<td><b>User Email:</b>");
			sb.append("<span style=\"padding-left: 10px;\">" + videoDetailUserList.get(0).getUserEmail() + "</span>");
			sb.append("<span style=\"padding-left: 50px;\"><b>Video Name:</b></span>");
			sb.append("<span style=\"padding-left: 10px;padding-right:10px;\">" + videoDetailUserList.get(0).getVideoName() + "</span>");
			sb.append("</td>");

			sb.append("</tr>");

			sb.append("<tr>");

			sb.append("<td>&nbsp;");
			sb.append("</td>");

			sb.append("</tr>");
			sb.append("</table>");

			sb.append("<table class=\"gridTable\" style=\"width:100%\">");

			sb.append("<tr class=\"gridHeader\">");

			sb.append("<td>Operating System</td>");
			sb.append("<td>Browser</td>");
			sb.append("<td>User IP</td>");
			sb.append("<td>User Location</td>");
			sb.append("<td>Date</td>");

			sb.append("</tr>");

			Integer counter = 0;
			for (VideoDetailUserDto dto : videoDetailUserList) {

				if ((counter % 2) == 0) {
					sb.append("<tr CLASS=\"gridRowEven\">");
				} else {
					sb.append("<tr CLASS=\"gridRowOdd\">");
				}

				String formatField = formatField(dto.getCreatedDate(), "dd-MMM-yyyy HH:mm:ss");

				sb.append("<td>" + dto.getClientOs() + "</td>");
				sb.append("<td>" + dto.getClientBrowser() + "</td>");
				sb.append("<td>" + dto.getClientIp() + "</td>");
				sb.append("<td>" + dto.getClientLoc() + "</td>");
				sb.append("<td>" + formatField + "</td>");

				sb.append("</tr>");

				counter++;
			}

			sb.append("</table>");

		} else {

			sb.append("<table>");
			sb.append("</table>");

		}

		String videoUserHtml = sb.toString();
		return videoUserHtml;

	}

	private static String formatField(Object objVal, String format) throws ClassCastException {
		String strRet = null;
		Format objFmt = null;

		try {
			if (objVal instanceof java.sql.Date || objVal instanceof java.util.Date || objVal instanceof java.sql.Timestamp) {
				objFmt = new SimpleDateFormat(format);
				strRet = objFmt.format(objVal);
			} else if (objVal instanceof Number) {
				objFmt = new DecimalFormat(format);
				strRet = objFmt.format(objVal);
			} else {
				strRet = objVal.toString();
			}

		} catch (NullPointerException NPExIgnore) {
		} catch (IllegalArgumentException IArgExIgnore) {
		} finally {
			if (objFmt != null) {
				objFmt = null;

			}
		}
		if (strRet == null) {
			strRet = "&nbsp;";
		}
		return strRet;
	}

	public static String getPlayEventDetailsHtml(List<VideoPlayEventDetailDto> playEventDetailList) {
		StringBuffer sb = new StringBuffer();

		if (playEventDetailList != null && playEventDetailList.size() > 0) {

			sb.append("<table class=\"gridTable\" style=\"width:100%\">");

			sb.append("<tr class=\"gridHeader\">");

			sb.append("<td>User Email</td>");
			sb.append("<td>Video Name</td>");
			sb.append("<td>Event Type</td>");
			sb.append("<td>Start</td>");
			sb.append("<td>End</td>");
			sb.append("<td>Comments</td>");
			sb.append("<td>Created Date</td>");

			sb.append("</tr>");

			Integer counter = 0;
			for (VideoPlayEventDetailDto dto : playEventDetailList) {

				if ((counter % 2) == 0) {
					sb.append("<tr CLASS=\"gridRowEven\">");
				} else {
					sb.append("<tr CLASS=\"gridRowOdd\">");
				}
				String formatField = formatField(dto.getCreatedDate(), "yyyy-MM-dd HH:mm");

				sb.append("<td>" + dto.getUserEmail() + "</td>");
				sb.append("<td>" + dto.getVideoName() + "</td>");
				sb.append("<td>" + dto.getEventType() + "</td>");
				sb.append("<td>" + dto.getStart() + "</td>");
				sb.append("<td>" + dto.getEnd() + "</td>");
				sb.append("<td>" + dto.getComments() + "</td>");
				sb.append("<td>" + formatField + "</td>");

				sb.append("</tr>");

				counter++;
			}

			if (playEventDetailList.size() < 30) {
				// int intCntr = playEventDetailList.size();
				int pintFrom = playEventDetailList.size();
				for (int intCntr = pintFrom; intCntr < 30; intCntr++) {
					if ((intCntr % 2) == 0) {
						sb.append("<tr CLASS=\"gridRowEven\">");
					} else {
						sb.append("<tr CLASS=\"gridRowOdd\">");
					}

					for (int col = 0; col < 7; col++) {
						sb.append("<td>");

						sb.append("&nbsp;" + "</td>");
					}

					sb.append("</tr>");
				}
			}

			sb.append("</table>");

		} else {
			sb.append("<table class=\"gridTable\" style=\"width:100%; border=0px !important\">");
			sb.append("<tr CLASS=\"gridRowEven gridBacgroundColor\">");
			sb.append("<td>No records to display!</td>");
			sb.append("</tr>");

			sb.append("</table>");

		}

		String userVideoEventsHtml = sb.toString();
		return userVideoEventsHtml;
	}

	public static String getSelectHtml(SelectParam selectParam) {

		int intCntr = 0;

		StringBuffer sbSelect = new StringBuffer();

		try {

			String divParentId = selectParam.getId() + "divParent";
			String dropdownDivId = selectParam.getId() + "dropdownDiv";

			sbSelect.append("<div id=\"" + divParentId + "\" class=\"divParent\" >");

			String selectId = selectParam.getId();

			String selectIdAdditionalId = selectParam.getId() + "Additional";

			String dropdownSelectDivId = selectParam.getId() + "SelectDiv";

			String dropdownSelectRowId = selectParam.getId() + "SelectRow";

			String tooltipDivId = selectParam.getId() + "tooltipDiv";

			sbSelect.append("<input type='hidden' id='" + selectId + "' />");
			sbSelect.append("<input type='hidden' id='" + selectIdAdditionalId + "' />");
			sbSelect.append("<input type='hidden' id='" + dropdownSelectRowId + "' />");

			sbSelect.append("<div id=\"" + dropdownSelectDivId + "\" class=\"dropdownSelect\" onclick=\"showSelect('" + selectId + "')\">" + selectParam.getPlaceHolder() + "</div>");

			sbSelect.append("<div tabindex=\"-1\" id=\"" + dropdownDivId + "\" class=\"dropdownDiv\" style=\"display: none;height:" + selectParam.getHeight() + "px\" >");
			if (selectParam.getDataSource().size() > 0) {
				String label = "";
				String value = "";
				String additional = "";

				StringBuffer item = new StringBuffer();

				for (intCntr = 0; intCntr < selectParam.getDataSource().size(); intCntr++) {
					Object currentItem = selectParam.getDataSource().get(intCntr);
					label = getColumnValue(currentItem, selectParam.getTextField());
					value = getColumnValue(currentItem, selectParam.getValueField());
					additional = getColumnValue(currentItem, selectParam.getAdditionalField());

					String truncatedText = "";
					if (label != null && selectParam.getMaxLength() > 0) {
						if (label.length() > selectParam.getMaxLength()) {
							truncatedText = label.substring(0, selectParam.getMaxLength()) + "...";
						}
					}

					item = new StringBuffer();
					item.append("<div style=\"white-space: nowrap;padding-left:5px;\" ");

					if (selectParam.getOnchangeFunction() != null && selectParam.getOnchangeFunction().length() > 0) {
						item.append(" onclick=\"" + selectParam.getOnchangeFunction() + ";setSelected(this,'" + selectId + "')\"");
					} else {
						item.append(" onclick=\"setSelected(this,'" + selectId + "')\"");
					}

					item.append(" onmouseenter=\"hoverDiv(this,'" + selectId + "'," + selectParam.getMaxLength() + ")\"");
					item.append(" onmouseout=\"hoverDivOut(this,'" + selectId + "')\"");
					item.append(" data-value=\"" + value + "\"  ");
					item.append(" data-additional=\"" + additional + "\"  ");

					if (truncatedText != null && truncatedText.length() > 0) {
						item.append(" data-text=\"" + truncatedText + "\"  ");
						item.append(" data-tip=\"" + label + "\" >");
						item.append(truncatedText);
					} else {
						item.append(" data-text=\"" + label + "\"  ");
						item.append(" > ");
						item.append(label);
					}

					item.append("</div>");

					sbSelect.append(item.toString());
				}

			}

			sbSelect.append("</div>");

			sbSelect.append("<div tabindex=\"-1\" id=\"" + tooltipDivId + "\" class=\"tooltipDiv\" style=\"display: none\"></div> ");

			sbSelect.append("</div>");

		} catch (Exception ex) {
			logger.error(ex);
		}

		return sbSelect.toString();
	}

	private static String getColumnValue(Object currentItem, String col) {
		Object objRet = null;

		if (col != null) {
			try {
				objRet = PropertyUtils.getProperty(currentItem, col);
			} catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
				logger.error(e);
			}

		}
		if (objRet == null) {
			objRet = "";
		}
		return objRet.toString();
	}

//	public static String getGridUserVideosHtml(List<VideoMasterDto> videoMasterList) {
//		StringBuffer sb = new StringBuffer();
//
//		if (videoMasterList != null && videoMasterList.isEmpty() == false) {
//
//			String divScrollId = "uvProviderVideosdivScroll";
//
//			sb.append("<div id=\"" + divScrollId + "\" style=\"border: 1px solid #1e2024;overflow-x:auto;white-space: nowrap;height:500px;\">");
//
//			sb.append("<table id=\"dgVideos\" class=\"gridTable\" style=\"width:100%\">");
//			
//			sb.append("<thead style=\"position: sticky; top: 0; z-index: 1;\">");
//
//			sb.append("<tr class=\"gridHeader\">");
//
//			sb.append("<td>Select</td>");
//			sb.append("<td>Video Name</td>");
////			sb.append("<td>Provider Name</td>");
//
//			sb.append("</tr>");
//
//			
//			sb.append("</thead>");
//			Integer counter = 0;
//			String videoName = "";
//			String providerName ="";
//			
//			sb.append("<tbody>");
//			String checked = "";
//			for (VideoMasterDto dto : videoMasterList) {
//
//				if ((counter % 2) == 0) {
//					sb.append("<tr CLASS=\"gridRowEven\">");
//				} else {
//					sb.append("<tr CLASS=\"gridRowOdd\">");
//				}
//				
//				sb.append("<td CLASS=\"gridColumn\">");
//				sb.append("<input type=\"checkbox\"" + checked + "  value=\"" + dto.getId() + "\">");
//
//				sb.append("</td>");
//				
//				videoName = dto.getVideoName();
//
//				String truncatedText = "";
//				if (videoName != null) {
//					if (videoName.length() > 70) {
//
//						truncatedText = videoName.substring(0, 70) + "...";
//					}
//				}
//
//				sb.append("<td CLASS=\"gridColumn\">");
//				if (truncatedText != null && truncatedText.length() > 0) {
//					sb.append("<span data-tooltip=\"" + videoName + "\" data-tooltip-position=\"top\" > " + truncatedText + "</span>");
//				} else {
//					sb.append(videoName);
//				}
//
//				sb.append("</td>");
//				
////				providerName = dto.getProviderName();
////
////				truncatedText = "";
////				if (videoName != null) {
////					if (providerName.length() > 35) {
////
////						truncatedText = providerName.substring(0, 35) + "...";
////					}
////				}
////
////				sb.append("<td CLASS=\"gridColumn\">");
////				if (truncatedText != null && truncatedText.length() > 0) {
////					sb.append("<span data-tooltip=\"" + videoName + "\" data-tooltip-position=\"left\" > " + truncatedText + "</span>");
////				} else {
////					sb.append(providerName);
////				}
////
////				sb.append("</td>");
//
//
//				sb.append("</tr>");
//
//				counter++;
//			}
//			
//			
//			if(17 < counter) {
//				if ((counter % 2) == 0) {
//					sb.append("<tr CLASS=\"gridRowEven\">");
//				} else {
//					sb.append("<tr CLASS=\"gridRowOdd\">");
//				}
//				
//				sb.append("<td> </td>");
//				sb.append("<td> </td>");
//				sb.append("</tr>");
//			}
//			
//
//			sb.append("</tbody>");
//			sb.append("</table>");
//			sb.append("</div>");
//
//		} else {
//
//			sb.append("<table>");
//			sb.append("</table>");
//
//		}
//
//		String videoUserHtml = sb.toString();
//		return videoUserHtml;
//	}

}
