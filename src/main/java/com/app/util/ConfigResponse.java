package com.app.util;

public class ConfigResponse {
	
	private String providerKeys;
	
	private String providerVideoKeys;
	
	private String status;

	private String message;	

	public String getProviderKeys() {
		return providerKeys;
	}

	public void setProviderKeys(String providerKeys) {
		this.providerKeys = providerKeys;
	}

	public String getProviderVideoKeys() {
		return providerVideoKeys;
	}

	public void setProviderVideoKeys(String providerVideoKeys) {
		this.providerVideoKeys = providerVideoKeys;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override 
	public String toString() {
		return "ConfigResponse [providerKeys=" + providerKeys + ", providerVideoKeys=" + providerVideoKeys + ", status=" + status + ", message=" + message + "]";
	}

}
