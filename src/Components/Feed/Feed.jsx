import React, { useEffect, useState } from 'react';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const Feed = ({ category, searchItem }) => {
  // We'll store the final array of videos (with snippet + statistics) here
  const [data, setData] = useState([]);

  //----------------------------------------------------------------------
  // 1) FETCH MOST POPULAR (with statistics) FOR A GIVEN CATEGORY
  //----------------------------------------------------------------------
  const fetchMostPopular = async () => {
    try {
      const videoListUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
      const response = await fetch(videoListUrl);
      const result = await response.json();
      console.log('Most popular API response', result);
      if (result.items) {
        setData(result.items);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching most popular videos:', error);
      setData([]);
    }
  };

  const fetchSearchedVideos = async (query) => {
    try {
      // A) search endpoint
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(
        query
      )}&key=${API_KEY}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      console.log('Search API response', searchData);

      // extract video IDs from search results
      const videoIds = (searchData.items || [])
        .filter((item) => item.id?.kind === 'youtube#video')
        .map((item) => item.id.videoId);

      if (!videoIds.length) {
        setData([]); // no videos found
        return;
      }

      // B) videos endpoint for snippet + statistics
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(
        ','
      )}&key=${API_KEY}`;
      const videosRes = await fetch(videosUrl);
      const videosData = await videosRes.json();
      console.log('Videos (with stats) API response', videosData);

      if (videosData.items) {
        setData(videosData.items);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching searched videos:', error);
      setData([]);
    }
  };

  //----------------------------------------------------------------------
  // 3) USEEFFECT: DECIDE WHICH FETCH TO DO
  //----------------------------------------------------------------------
  useEffect(() => {
    if (searchItem.trim()) {
      // If user typed something => do two-step search
      fetchSearchedVideos(searchItem.trim());
    } else {
      // If no search term => show most popular
      fetchMostPopular();
    }
  }, [category, searchItem]);

  //----------------------------------------------------------------------
  // 4) RENDER
  //----------------------------------------------------------------------
  return (
    <div className="feed">
      {data && data.length > 0 ? (
        data.map((item, index) => {
          // OPTIONAL CHAINING
          const snippet = item.snippet || {};
          const stats = item.statistics || {};
          const viewCount = stats.viewCount || '0';
          const publishedTime = snippet.publishedAt || '';
          const thumbnailUrl = snippet.thumbnails?.medium?.url || '';
          const videoTitle = snippet.title || 'No Title';
          const channelTitle = snippet.channelTitle || 'No Channel';
          // Some items might store ID differently (string vs object)
          const videoId = typeof item.id === 'string' ? item.id : item.id?.videoId || '';

          return (
            <Link
              to={`video/${item.snippet.categoryId}/${videoId}`}
              key={index}
              className="card"
            >
              <img
                src={thumbnailUrl}
                alt={videoTitle}
              />
              <h2>{videoTitle}</h2>
              <h3>{channelTitle}</h3>
              <p>
                {value_converter(viewCount)} &bull; {moment(publishedTime).fromNow()}
              </p>
            </Link>
          );
        })
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default Feed;
