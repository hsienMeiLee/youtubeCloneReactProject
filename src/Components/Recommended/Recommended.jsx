import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { API_KEY, value_converter } from '../../data';
import { Link } from 'react-router-dom';

const Recommended = ({ categoryId }) => {
  // 1) Initialize to an empty array so .map() won't crash
  const [apiData, setApiData] = useState([]);

  // 2) Fetch recommended videos for the given categoryId
  const fetchData = async () => {
    try {
      const relatedVideoUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
      const response = await fetch(relatedVideoUrl);
      const data = await response.json();

      console.log('Recommended API response:', data); // Debug log

      // data.items might be undefined if there's an error or no items
      if (data && Array.isArray(data.items)) {
        setApiData(data.items);
      } else {
        console.warn('No valid .items array found in response:', data);
        setApiData([]); // fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching recommended videos:', error);
      setApiData([]); // fallback to empty array
    }
  };

  // 3) Re-fetch whenever categoryId changes (or on first mount)
  useEffect(() => {
    fetchData();
  }, [categoryId]);

  // 4) Render the list safely
  return (
    <div className="recommended">
      {apiData.map((item, index) => {
        // item might be missing snippet/statistics in edge cases, so be defensive
        const snippet = item.snippet || {};
        const stats = item.statistics || {};
        
        // Some items might not have snippet.categoryId
        // or might store id differently
        const catId = snippet.categoryId || 'NOCAT';
        const videoId = typeof item.id === 'string' ? item.id : 'NOID';

        const thumbnailUrl = snippet.thumbnails?.medium?.url || '';
        const title = snippet.title || 'No Title';
        const channelTitle = snippet.channelTitle || 'No Channel';
        const viewCount = stats.viewCount || '0';

        return (
          <Link
            to={`/video/${catId}/${videoId}`}
            key={index}
            className="side-video-list"
          >
            <img src={thumbnailUrl} alt="thumbnail" />
            <div className="vid-info">
              <h4>{title}</h4>
              <p>{channelTitle}</p>
              <p>{value_converter(viewCount)} Views</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Recommended;
