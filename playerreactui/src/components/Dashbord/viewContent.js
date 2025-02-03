import React from "react";
import AspectRatio from "../../AdminTablesData/aspectRatio";
import ConsumerProcess from "../../AdminTablesData/consumerProcess";
import AllVideos from "./allVideosContent";
import Users from "../../AdminTablesData/userDetails";
import DeleteVideos from "../../AdminTablesData/deleteVideos";
import VideoPlayEvents from "../../AdminTablesData/videoPlayevents";
import Providers from "../../AdminTablesData/providers";
import VideosPlayBackInformation from "../../AdminTablesData/videoPlayBackInformation";
import PlayerReuests from "../../AdminTablesData/playerRequests";
import Userdetails from "../../AdminTablesData/userDetails";
import VideoUploadStatus from "../../AdminTablesData/videoUploadstatus";
import UserActivateAndDeactivate from "../../AdminTablesData/userActivateAndDeactivate";
import Upload from "../../AdminTablesData/VideoUploadForm";
import ThumbnailUpload from "../../AdminTablesData/thumbnailUpload";
import Configuration from '../../AdminTablesData/configuration';
import GenerateUserToken from "../../AdminTablesData/generateUserToken";
import UserImpersonate from "../../AdminTablesData/userImpersonate";
import AuthorizationFailures from '../../AdminTablesData/authorizationFailures';

const ViewContent = ({ view }) => {
  switch (view) {
    case "aspectRatio":
      return <AspectRatio />;

    case "authorizationFailures":
      return <AuthorizationFailures />;

    case "configuration":
      return <Configuration />

    case "consumerProcess":
      return <ConsumerProcess />;

    case "allVideos":
      return <AllVideos />;

    case "users":
      return <Users />;

    case "deleteVideos":
      return <DeleteVideos />;

    case "videosPlayEvents":
      return <VideoPlayEvents />;

    case "providers":
      return <Providers />;

    case "videosPlayBackInformation":
      return <VideosPlayBackInformation />;

    case "playerReuests":
      return <PlayerReuests />;

    case "userDetails":
      return <Userdetails />;

    case "videoUploadStatus":
      return <VideoUploadStatus />;

    case "userActivateAndDeactivate":
      return <UserActivateAndDeactivate />;

    case "upload":
      return <Upload />;

    case "thumbnailUpload":
      return <ThumbnailUpload />;

    case "generateUserToken":
      return <GenerateUserToken />;

    case "userImpersonate":
      return <UserImpersonate />;

    default:
      return <AllVideos />;
  }
};

export default ViewContent;
