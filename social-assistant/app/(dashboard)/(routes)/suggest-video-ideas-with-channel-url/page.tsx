"use client";
import React, { useState } from "react";
import { Heading } from "@/components/heading";
import { MessageCircleQuestion } from "lucide-react";
import { Progress } from "@/components/ui/progress";


const isValidChannelUrl = (url) => {
  // YouTube channel URL regex pattern
  const regex =
    /^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|user\/)?@?([a-zA-Z0-9_-]+)$/;
  return regex.test(url);
};


const ChannelUrlInput = ({ inputValue, setInputValue, handleSearch }) => {
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (!isValidChannelUrl (value) && value !== "") {
      setError("Please enter a valid YouTube channel URL.");
    } else {
      setError("");
    }
  };

  const handleSearchClick = () => {
    handleSearch(inputValue);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={"Enter YouTube channel URL..."}
          className="w-full focus:outline-none rounded-lg"
        />
        <button
          onClick={handleSearchClick}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Search
        </button>
      </div>
      {error && <div className="mt-2 text-red-500">{error}</div>}
    </div>
  );
};

const SuggestVideosWithChannelUrl = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [videoCount, setVideoCount] = useState("");
  const [minVideoLikes, setMinVideoLikes] = useState("");
  const [maxVideoLikes, setMaxVideoLikes] = useState("");
  const [minVideoViews, setMinVideoViews] = useState("");
  const [maxVideoViews, setMaxVideoViews] = useState("");
  const [showCustomVideoLikesRange, setShowCustomVideoLikesRange] =
    useState(false);
  const [showCustomVideoViewRange, setShowCustomVideoViewRange] =
    useState(false);

  const handlePopupOpen = (data) => {
    setPopupData(data);
  };

  const handlePopupClose = () => {
    setPopupData(null);
  };

  const handleSearch = async (channelUrl) => {
    setLoading(true);
    const API_KEY = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY_2
  
    try {
      let channelId;
  
      if (channelUrl.includes('/channel/')) {
        channelId = channelUrl.split('/channel/')[1];
      } else if (channelUrl.includes('@')) {
        const handleName = channelUrl.split('@')[1];
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${handleName}&type=channel&key=${API_KEY}`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          channelId = data.items[0].snippet.channelId;
        } else {
          throw new Error("Invalid channel URL");
        }
      } else {
        throw new Error("Invalid channel URL format");
      }
  
      const fetchChannelPopularVideo = async (channelId) => {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&type=video&order=viewCount&key=${API_KEY}`
        );
  
        if (!response.ok) {
          throw new Error(`YouTube API Error: ${response.statusText}`);
        }
  
        return response.json();
      };
  
      const fetchVideoDetails = async (videoId) => {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
        );
  
        if (!response.ok) {
          throw new Error(`YouTube API Error: ${response.statusText}`);
        }
  
        return response.json();
      };
  
      const fetchRelatedVideos = async (keywords, categoryId, videoCount) => {
        let maxResults = 10;

        if (!videoCount && (!minVideoLikes || !maxVideoLikes) && (!minVideoViews || !maxVideoViews)) {
          maxResults = 50;
        } else if (videoCount) {
          maxResults = parseInt(videoCount);
        }
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&key=${API_KEY}&q=${keywords}&videoCategoryId=${categoryId}`
        );
  
        if (!response.ok) {
          throw new Error(`YouTube API Error: ${response.statusText}`);
        }
  
        return response.json();
      };
  
      const channelPopularVideoData = await fetchChannelPopularVideo(channelId);
  
      if (!channelPopularVideoData.items || channelPopularVideoData.items.length === 0) {
        throw new Error("No popular videos found for the channel");
      }
  
      const mostPopularVideoId = channelPopularVideoData.items[0].id.videoId || channelPopularVideoData.items[0].id.videoId;
      const videoDetailsData = await fetchVideoDetails(mostPopularVideoId);
  
      if (!videoDetailsData.items || videoDetailsData.items.length === 0) {
        throw new Error("Video details not found");
      }
  
      const videoDetails = videoDetailsData.items[0];
      const videoInfo = {
        id: mostPopularVideoId,
        title: videoDetails.snippet.title,
        description: videoDetails.snippet.description,
        thumbnail: videoDetails.snippet.thumbnails.default.url,
        url: `https://www.youtube.com/watch?v=${mostPopularVideoId}`,
        viewCount: videoDetails.statistics?.viewCount || "N/A",
        likeCount: videoDetails.statistics?.likeCount || "N/A",
        publishedAt: videoDetails.snippet.publishedAt,
      };
  
  
      const keywords = videoDetails.snippet.title.split(" ").join("+");
      const categoryId = videoDetails.snippet.categoryId;
  
      const relatedVideosData = await fetchRelatedVideos(keywords, categoryId);
  
      if (!relatedVideosData.items || relatedVideosData.items.length === 0) {
        throw new Error("No related videos found");
      }
  
      const relatedVideos = await Promise.all(
        relatedVideosData.items.map(async (item) => {
          const id = item.id.videoId || item.id;
          const videoData = await fetchVideoDetails(id);
          const video = videoData.items[0];
          return {
            id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.default.url,
            url: `https://www.youtube.com/watch?v=${id}`,
            viewCount: video.statistics?.viewCount || "N/A",
            likeCount: video.statistics?.likeCount || "N/A",
            publishedAt: video.snippet.publishedAt,
          };
        })
      );
      const filteredVideos = relatedVideos.filter((video) => {
        let likeCount = parseInt(video.likeCount.replace(/\D/g, "")) || 0;
        let viewCount = parseInt(video.viewCount.replace(/\D/g, "")) || 0;
    
        let minLikes = parseInt(minVideoLikes) || 0;
        let maxLikes = parseInt(maxVideoLikes) || Infinity;
        let minViews = parseInt(minVideoViews) || 0;
        let maxViews = parseInt(maxVideoViews) || Infinity;
        if (maxViews < minViews) {
          setMaxVideoViews(minViews);
          setMinVideoViews(maxViews);
          let tempMinViews = minViews;
          minViews = maxViews;
          maxViews = tempMinViews;
        }
        if (maxLikes < minLikes) {
          setMaxVideoLikes(minLikes);
          setMinVideoLikes(maxLikes);
          let tempMinLikes = minLikes;
          minLikes = maxLikes;
          maxLikes = tempMinLikes;
        }
        return (
          likeCount >= minLikes &&
          likeCount <= maxLikes &&
          viewCount >= minViews &&
          viewCount <= maxViews &&
          (!videoCount || relatedVideos.length <= parseInt(videoCount))
        );
      });
      setSearchResults(filteredVideos);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to retrieve the most popular video");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div>
      <Heading
        title="Suggest Videos With Channel URL"
        description="You can have a look at YouTube videos and generate ideas based on your Channel URL criteria."
        icon={MessageCircleQuestion}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
      />
      <div className="app px-8">
        <h1 className="mt-4 text-l font-semibold mr-4">Filter Options</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="videoCount" className="block">
              Numbers of Videos
            </label>
            <input
              type="text"
              id="videoCount"
              value={videoCount}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/\D/g, "");
                value = value.slice(0, 2);
                if (value.startsWith("0")) {
                  value = value.substring(1);
                }
                if (value.includes("-")) {
                  value = value.replace("-", "");
                }
                if (parseInt(value) > 50) {
                  value = "50";
                }
                setVideoCount(value);
              }}
              className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="videoLikesRange" className="block">
             Video Likes
            </label>
            <select
              id="videoLikesRange"
              value={
                showCustomVideoLikesRange
                  ? "custom"
                  : minVideoLikes + "-" + maxVideoLikes
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "custom") {
                  setMinVideoLikes("");
                  setMaxVideoLikes("");
                  setShowCustomVideoLikesRange(true);
                } else {
                  setShowCustomVideoLikesRange(false);
                  const [min, max] = value.split("-");
                  setMinVideoLikes(min);
                  setMaxVideoLikes(max);
                }
              }}
              className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-full"
            >
              <option value="0-1000">0 - 1000</option>
              <option value="1000-10000">1000 - 10,000</option>
              <option value="10000-100000">10,000 - 100,000</option>
              <option value="100000-1000000">100,000 - 1,000,000</option>
              <option value="1000000-10000000">1,000,000 - 10,000,000</option>
              <option value="custom">Custom Range</option>
            </select>
            {showCustomVideoLikesRange && (
              <div className="flex space-x-4 mt-2">
                <input
                  type="text"
                  placeholder="Min Likes"
                  value={minVideoLikes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setMinVideoLikes(value);
                    }
                  }}
                  maxLength="11"
                  className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                />
                <input
                  type="text"
                  placeholder="Max Likes"
                  value={maxVideoLikes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setMaxVideoLikes(value);
                    }
                  }}
                  maxLength="11"
                  className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="videoCountRange" className="block">
              Video View Range
            </label>
            <select
              id="videoCountRange"
              value={
                showCustomVideoViewRange
                  ? "custom"
                  : minVideoViews + "-" + maxVideoViews
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "custom") {
                  setMinVideoViews("");
                  setMaxVideoViews("");
                  setShowCustomVideoViewRange(true);
                } else {
                  setShowCustomVideoViewRange(false);
                  const [min, max] = value.split("-");
                  setMinVideoViews(min);
                  setMaxVideoViews(max);
                }
              }}
              className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-full"
            >
              <option value="0-1000">0 - 1000</option>
              <option value="1000-10000">1000 - 10,000</option>
              <option value="10000-100000">10,000 - 100,000</option>
              <option value="100000-1000000">100,000 - 1,000,000</option>
              <option value="1000000-10000000">1,000,000 - 10,000,000</option>
              <option value="custom">Custom Range</option>
            </select>
            {showCustomVideoLikesRange && (
              <div className="flex space-x-4 mt-2">
                <input
                  type="text"
                  placeholder="Min Views"
                  value={minVideoViews}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setMinVideoViews(value);
                    }
                  }}
                  maxLength="11"
                  className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                />
                <input
                  type="text"
                  placeholder="Max Views"
                  value={maxVideoViews}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setMaxVideoViews(value);
                    }
                  }}
                  maxLength="11"
                  className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                />
              </div>
            )}
          </div>
        </div>

        <h1 className="mt-8 text-xl font-semibold mr-4">
          Search the channel based on your taste!
        </h1>
        <ChannelUrlInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSearch={handleSearch}
        />

        {loading && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <Progress />
          </div>
        )}

        {error && <div className="mt-2 text-red-500 text-center">{error}</div>}

        <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="border p-4 ml-8 mr-8 cursor-pointer"
              onClick={() => handlePopupOpen(result)}
            >
              <img src={result.thumbnail} alt="Thumbnail" className="mt-2" />
              <h3 className="text-lg font-semibold">{result.title}</h3>
              <p className="text-gray-600">
                {result.description.length > 150
                  ? `${result.description.slice(0, 150)}...`
                  : result.description}
                {result.description.length > 150 && (
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handlePopupOpen(result)}
                  >
                    {"See More"}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

       

        {popupData && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-3/4 max-w-sm max-h-screen overflow-y-auto">
              <h2 className="text-lg font-bold mb-8">Video Information</h2>
              <img src={popupData.thumbnail} alt="Thumbnail" className="mt-2" />
              <h2 className="text-lg font-semibold">{popupData.title}</h2>
              <p className="text-gray-600 mb-4">{popupData.description}</p>
              <p className="text-gray-600">
                URL:{" "}
                <a
                  href={popupData.url}
                  target="_blank"
                  className="text-blue-500"
                >
                  {popupData.url}
                </a>
                <br />
                View Count:{" "}
                {popupData.viewCount !== "N/A"
                  ? new Intl.NumberFormat("en-US").format(popupData.viewCount)
                  : "N/A"}
                <br />
                Like Count:{" "}
                {popupData.likeCount !== "N/A"
                  ? new Intl.NumberFormat("en-US").format(popupData.likeCount)
                  : "N/A"}
                <br />
                Upload Date:{" "}
                {popupData.publishedAt
                  ? new Date(popupData.publishedAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={handlePopupClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestVideosWithChannelUrl;
