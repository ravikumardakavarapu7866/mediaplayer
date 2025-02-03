import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../Common/styles.css';

import { getPlayerUrl, initialize } from '../../../src/components/Common/fetchConfig';

let PLAYER_BASE_URL = '';

const setupApiHelper = async () => {
  await initialize(); // the base URL is fetched
  PLAYER_BASE_URL = getPlayerUrl(); // Set the base URL
  //console.log("PLAYER_BASE_URL:", PLAYER_BASE_URL);
};
setupApiHelper();

function PlayerContainer() {

  const { state } = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const navigate = useNavigate();


  const UserToken = state ? state.data.userToken : null;
  const showWatermark = state ? state.data.showWatermark : null;
  const sessionTimeout = state ? state.data.sessionTimeout : null;
  const sessionIncrement = state ? state.data.sessionIncrement : null;
  const playFromBegin = state ? state.data.playFromBegin : null;


  //console.log("userToken.." + UserToken);
  //console.log("showWatermark.." + showWatermark);
  //console.log("sessionTimeout.." + sessionTimeout);
  //console.log("sessionIncrement.." + sessionIncrement);


  const requestBody = {
    "showWatermark": showWatermark,
    "sessionTimeOutValue": Math.min(sessionTimeout, 3000),
    "sessionIncrement": sessionIncrement ? 1 : 0,
    "playFromBegin":playFromBegin
  };

  useEffect(() => {
    let timer;
    if (sessionTimeout > 0 && sessionIncrement == 0) {
      timer = setTimeout(() => {
        sessionStorage.setItem("selectedView", "allVideos");
        navigate("/dashboard", { state: { selectedView: "allVideos" } });
      }, sessionTimeout * 60 * 1000);
    }
    return () => clearTimeout(timer);
  }, [sessionTimeout]);


  useEffect(() => {
    const fetchPlayers = async () => {

      try {
        const response = await axios.post(`${PLAYER_BASE_URL}/run`, requestBody, {

          headers: {
            'Authorization': `Bearer ${UserToken}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.status === 200) {
          //console.log("Response Data..." + response.data);
          setHtmlContent(response.data);
        } else {
          if (response.status === 404) {
            setErrorMessage("Invalid request");
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPlayers();
  }, []);

  const iframeRef = useRef(null);

  // useEffect(() => {
  //   if (htmlContent) {
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(htmlContent, 'text/html');
  //     const targetDiv = doc.getElementById('close-button');
  //     console.log('Target div content:', targetDiv);

  //     if (targetDiv) {
  //       console.log("Enter the loop..");
  //       targetDiv.addEventListener('click', () => {
  //         console.log('Close button clicked!');

  //       });
  //     }

  //   }


  // }, [htmlContent, navigate]);


  // useEffect(() => {
  //   if (iframeRef.current) {
  //     const iframeDocument = iframeRef.current.contentDocument;
  //     console.log("iframeDocument.." + iframeDocument);
  //     if (iframeDocument) {
  //       console.log("Enter..");
  //       const videoPlayer = iframeDocument.getElementById('videoPlayerId');
  //       console.log("videoPlayer.." + videoPlayer);
  //       if (videoPlayer) {
  //         videoPlayer.pause();
  //       }
  //     }
  //   }
  // }, []);

  useEffect(() => {
    // Adjust the iframe size when the component mounts
    // or when the window is resized
    adjustIframeSize();
    window.addEventListener('resize', adjustIframeSize);
    return () => {
      window.removeEventListener('resize', adjustIframeSize);
    };
  }, []);

  const adjustIframeSize = () => {
    if (iframeRef.current) {
      const containerWidth = iframeRef.current.offsetWidth;
      const containerHeight = (containerWidth * 9) / 16; // 16:9 aspect ratio
      iframeRef.current.style.height = `${containerHeight}px`;
    }
  };

  //const userRole = state ? state.data.userRole : null;

  return (
    <div className="video-player-container">
      <div className="iframe-container">
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          title="Video Player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>

  )
}

export default PlayerContainer
