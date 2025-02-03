import {
  getApiUrl,
  initialize,
} from "../../../src/components/Common/fetchConfig";

let REACT_APP_BASE_URL = "";

const setupApiHelper = async () => {
  await initialize(); // the base URL is fetched
  REACT_APP_BASE_URL = getApiUrl(); // Set the base URL
};

setupApiHelper();

const LOGIN_API = "userLogin";

const USERTOKEN_API = "userToken";

const USERTOKENVIDEOS_API = "userTokenVideos";

const ASPECTRATIOS_API = "aspectRatios";

const CONSUMERPROCESS_API = "consumerProcess";

const DELETEVIDEOS_API = "deleteVideos";

const DELETE_API = "delete";

const VIDEOPLAYEVENTS_API = "videoPlayevents";

const VIDEOPLAYDETAILS_API = "videoPlayDetails";

const PROVIDERS_API = "providers";

const SAVEPROVIDERS_API = "saveProviders";

const VIDEODETAILPROGRESS_API = "videoDetailProgress";

const VIDEODETAILUSER_API = "videoDetailUser";

const ALLPLAYERREQUESTS_API = "allPlayerRequests";

const USERS_API = "users";

const USERDETAILS_API = "userDetails";

const ALLUSERDETAILS_API = "allUserDetails";

const VIDEOUPLOADSTATUS_API = "videoUploadStatus";

const SAVEPROVIDERTOKENS_API = "saveProviderTokens";

const DELETEPROVIDER_API = "deleteProvider";

const UPLOADVIDEO_API = "uploadVideo";

const ACTIVEPROVIDRS_API = "activeProvider";

const THUMBNAILPROVIDERVIDEOS_API = "thumbnailProviderVideos";

const SAVETHUMBNAILIMAGE_API = "saveThumbnailImage";

const UPDATEVIDEODETAILS_API = "updateVideoDetails";

const ASPECTRATIOKEYS_API = "aspectRatioKeys";

const ASPECTRATIOSAVE_API = "aspectRatioSave";

const USERSTATUSUPDATE_API = "userStatusUpdate";

const SAVEUSERDETAILS_API = "saveUserDetails";

const THUMBNAILPROVIDER_API = "thumbnailProvider";

const GETUSERROLES_API = "getUserRoles";

const GETUSERTOKENVIDEOS_API = "getUserTokenVideos";

const GETPROVIDERVIDEOS_API = "getProvidervideos";

const SAVEUSERTOKEN_API = "saveUserToken";

const GETGLOBALCONFIGKEYS_API = "getGlobalConfigKeys";

const GETPROVIDERKEYS_API = "getProviderKeys";

const GETPROVIDERVIDEOKEYS_API = "getProviderVideoKeys";

const GETCONFIGKEYS_API = "getConfigKeys";

const SAVECONFIGURATIONS_API = "saveConfigurations";

const PROVIDERUSERS_API = "providerUsers";

const IMPERSONATE_API = "impersonate";

const GETSERVERDATEANDTIME_API = "getServerDateAndTime";

const USERPROVIDERS_API = "userProviders";

const HOMEPROVIDERVIDEOS_API = "homeProvidervideos";

const GETLOGDATA_API = "getLogData";

const GETAUTHFAILURES_API = "getauthFailures"

export {
  REACT_APP_BASE_URL,
  LOGIN_API,
  USERTOKEN_API,
  USERTOKENVIDEOS_API,
  ASPECTRATIOS_API,
  CONSUMERPROCESS_API,
  DELETEVIDEOS_API,
  DELETE_API,
  VIDEOPLAYEVENTS_API,
  VIDEOPLAYDETAILS_API,
  PROVIDERS_API,
  VIDEODETAILPROGRESS_API,
  VIDEODETAILUSER_API,
  ALLPLAYERREQUESTS_API,
  USERDETAILS_API,
  USERS_API,
  ALLUSERDETAILS_API,
  VIDEOUPLOADSTATUS_API,
  SAVEPROVIDERS_API,
  SAVEPROVIDERTOKENS_API,
  DELETEPROVIDER_API,
  UPLOADVIDEO_API,
  ACTIVEPROVIDRS_API,
  THUMBNAILPROVIDERVIDEOS_API,
  SAVETHUMBNAILIMAGE_API,
  UPDATEVIDEODETAILS_API,
  ASPECTRATIOKEYS_API,
  ASPECTRATIOSAVE_API,
  USERSTATUSUPDATE_API,
  SAVEUSERDETAILS_API,
  THUMBNAILPROVIDER_API,
  GETUSERROLES_API,
  GETUSERTOKENVIDEOS_API,
  GETPROVIDERVIDEOS_API,
  SAVEUSERTOKEN_API,
  GETGLOBALCONFIGKEYS_API,
  GETPROVIDERKEYS_API,
  GETPROVIDERVIDEOKEYS_API,
  GETCONFIGKEYS_API,
  SAVECONFIGURATIONS_API,
  PROVIDERUSERS_API,
  IMPERSONATE_API,
  GETSERVERDATEANDTIME_API,
  USERPROVIDERS_API,
  HOMEPROVIDERVIDEOS_API,
  GETLOGDATA_API,
  GETAUTHFAILURES_API,
};
