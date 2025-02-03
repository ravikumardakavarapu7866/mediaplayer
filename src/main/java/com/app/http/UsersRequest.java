package com.app.http;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class UsersRequest {

	private String email;

	private String password;
	
	private String userID;
	
	private String selectedIds;
	
	private String providerName;
	
	private String selectedRowID;
	
	private String videoMasterId;
	
	private String sourceId;
    private String type;
    private String releaseDate;
    private String endDate;
    private String videoName;
    private String videoDescription;
    private String language;
    private String videoUrl;
    private String thumbnailUrl;
    private String seasonNumber;
    private String episodeNumber;
    private String episodeName;
    private MultipartFile[] videoFile; 
    private MultipartFile[] imageFile;
    
	private String validFromDate;
	private String validEndDate;
	private String sendToEmail;
	
	
	private String id;
	private String aspectRatio;
	private Integer width;
	private Integer height;
	private String videoBitrate;
	private String audioBitrate;
	
	private String active;
	private List<String> userIds = new ArrayList<String>();
	


	private String roleName;
	private String userEmail;
	private String userPassword;
	private String providerId;
	
	private String configKey;
	private String configValue;
	private String selectVideo;


	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	public String getSelectedIds() {
		return selectedIds;
	}

	public void setSelectedIds(String selectedIds) {
		this.selectedIds = selectedIds;
	}

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public String getSelectedRowID() {
		return selectedRowID;
	}

	public void setSelectedRowID(String selectedRowID) {
		this.selectedRowID = selectedRowID;
	}

	public String getVideoMasterId() {
		return videoMasterId;
	}

	public void setVideoMasterId(String videoMasterId) {
		this.videoMasterId = videoMasterId;
	}

	public String getSourceId() {
		return sourceId;
	}

	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getReleaseDate() {
		return releaseDate;
	}

	public void setReleaseDate(String releaseDate) {
		this.releaseDate = releaseDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getVideoName() {
		return videoName;
	}

	public void setVideoName(String videoName) {
		this.videoName = videoName;
	}

	public String getVideoDescription() {
		return videoDescription;
	}

	public void setVideoDescription(String videoDescription) {
		this.videoDescription = videoDescription;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getVideoUrl() {
		return videoUrl;
	}

	public void setVideoUrl(String videoUrl) {
		this.videoUrl = videoUrl;
	}

	public String getThumbnailUrl() {
		return thumbnailUrl;
	}

	public void setThumbnailUrl(String thumbnailUrl) {
		this.thumbnailUrl = thumbnailUrl;
	}

	public String getSeasonNumber() {
		return seasonNumber;
	}

	public void setSeasonNumber(String seasonNumber) {
		this.seasonNumber = seasonNumber;
	}

	public String getEpisodeNumber() {
		return episodeNumber;
	}

	public void setEpisodeNumber(String episodeNumber) {
		this.episodeNumber = episodeNumber;
	}

	public String getEpisodeName() {
		return episodeName;
	}

	public void setEpisodeName(String episodeName) {
		this.episodeName = episodeName;
	}

	public MultipartFile[] getVideoFile() {
		return videoFile;
	}

	public void setVideoFile(MultipartFile[] videoFile) {
		this.videoFile = videoFile;
	}

	public MultipartFile[] getImageFile() {
		return imageFile;
	}

	public void setImageFile(MultipartFile[] imageFile) {
		this.imageFile = imageFile;
	}

	public String getValidFromDate() {
		return validFromDate;
	}

	public void setValidFromDate(String validFromDate) {
		this.validFromDate = validFromDate;
	}

	public String getValidEndDate() {
		return validEndDate;
	}

	public void setValidEndDate(String validEndDate) {
		this.validEndDate = validEndDate;
	}

	public String getSendToEmail() {
		return sendToEmail;
	}

	public void setSendToEmail(String sendToEmail) {
		this.sendToEmail = sendToEmail;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getAspectRatio() {
		return aspectRatio;
	}

	public void setAspectRatio(String aspectRatio) {
		this.aspectRatio = aspectRatio;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public String getVideoBitrate() {
		return videoBitrate;
	}

	public void setVideoBitrate(String videoBitrate) {
		this.videoBitrate = videoBitrate;
	}

	public String getAudioBitrate() {
		return audioBitrate;
	}

	public void setAudioBitrate(String audioBitrate) {
		this.audioBitrate = audioBitrate;
	}
	
	public String getActive() {
		return active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	public List<String> getUserIds() {
		return userIds;
	}

	public void setUserIds(List<String> userIds) {
		this.userIds = userIds;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getUserPassword() {
		return userPassword;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}

	public String getProviderId() {
		return providerId;
	}

	public void setProviderId(String providerId) {
		this.providerId = providerId;
	}

	public String getConfigKey() {
		return configKey;
	}

	public void setConfigKey(String configKey) {
		this.configKey = configKey;
	}

	public String getConfigValue() {
		return configValue;
	}

	public void setConfigValue(String configValue) {
		this.configValue = configValue;
	}

	public String getSelectVideo() {
		return selectVideo;
	}

	public void setSelectVideo(String selectVideo) {
		this.selectVideo = selectVideo;
	}

   	
}
