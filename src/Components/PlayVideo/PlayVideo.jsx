import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {
  const { videoId } = useParams();

  // State to store the main video data, channel data, and comments
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  // 1) Fetch main video details
  const fetchVideoData = async () => {
    try {
      const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      const res = await fetch(videoDetailsUrl);
      const data = await res.json();
      console.log('Video Details response:', data);

      // Safely get the first item, or null
      const firstItem = data?.items?.[0] || null;
      setApiData(firstItem);
    } catch (error) {
      console.error('Error fetching video data:', error);
      setApiData(null);
    }
  };

  // 2) Fetch channel data and comments (only if apiData is ready)
  const fetchOtherData = async () => {
    if (!apiData || !apiData.snippet?.channelId) {
      // If main video data isn't loaded or channelId is missing,
      // we skip fetching channel and comments
      return;
    }

    try {
      // A) Channel data
      const channelDataUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const channelRes = await fetch(channelDataUrl);
      const channelJson = await channelRes.json();
      console.log('Channel response:', channelJson);

      const channelItem = channelJson?.items?.[0] || null;
      setChannelData(channelItem);

      // B) Comments
      const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
      const commentRes = await fetch(commentUrl);
      const commentJson = await commentRes.json();
      console.log('Comments response:', commentJson);

      // If .items is missing, use an empty array
      setCommentData(commentJson?.items || []);
    } catch (error) {
      console.error('Error fetching channel/comments:', error);
      setChannelData(null);
      setCommentData([]);
    }
  };

  // Fetch video data on mount or when videoId changes
  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  // After apiData is updated, fetch channel and comments
  useEffect(() => {
    fetchOtherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData]);

  // 3) Render
  // Optional chaining throughout the JSX to avoid crashes if something is missing
  return (
    <div className="play-video">
      {/* Main Video Player */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      {/* Video Title */}
      <h3>{apiData?.snippet?.title || 'Title here'}</h3>

      <div className="play-video-info">
        {/* View count & publish date */}
        <p>
          {apiData
            ? value_converter(apiData.statistics?.viewCount || 0)
            : '16K'}{' '}
          &bull;{' '}
          {apiData
            ? moment(apiData.snippet?.publishedAt).fromNow()
            : 'Yesterday'}
        </p>

        {/* Like / Dislike / Share / Save */}
        <div>
          <span>
            <img src={like} alt="like" />
            {apiData
              ? value_converter(apiData.statistics?.likeCount || 0)
              : 0}
          </span>
          <span>
            <img src={dislike} alt="dislike" />
          </span>
          <span>
            <img src={share} alt="share" />
            Share
          </span>
          <span>
            <img src={save} alt="save" />
            Save
          </span>
        </div>
      </div>

      <hr />

      {/* Channel Publisher Info */}
      <div className="publisher">
        <img
          src={
            channelData?.snippet?.thumbnails?.default?.url || ''
          }
          alt="Channel"
        />
        <div>
          <p>{apiData?.snippet?.channelTitle || ''}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics?.subscriberCount || 0)
              : 0}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      {/* Video Description & Comments */}
      <div className="vid-description">
        <p>
          {apiData?.snippet?.description
            ? apiData.snippet.description.slice(0, 250)
            : 'Description here'}
        </p>
        <hr />
        <h4>
          {apiData
            ? value_converter(apiData.statistics?.commentCount || 0)
            : 0}{' '}
          Comments
        </h4>

        {/* Map over commentData. It's an array, but each item might lack certain fields */}
        {commentData.map((item, index) => {
          // Defensive checks
          const topLevel = item?.snippet?.topLevelComment?.snippet;
          if (!topLevel) {
            return null; // skip if data is missing
          }

          const authorName = topLevel.authorDisplayName || 'Unknown User';
          const authorProfile =
            topLevel.authorProfileImageUrl || '';
          const likeCount = topLevel.likeCount || 0;
          const textDisplay = topLevel.textDisplay || '';

          return (
            <div key={index} className="comment">
              <img
                src={authorProfile}
                alt="user_profile"
              />
              <div>
                <h3>
                  {authorName}
                  <span>1 day ago</span>
                </h3>
                <p>{textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="like" />
                  <span>{value_converter(likeCount)}</span>
                  <img src={dislike} alt="dislike" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
