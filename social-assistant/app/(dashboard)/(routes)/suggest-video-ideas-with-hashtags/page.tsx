"use client";
import React, { useState } from "react";
import { Heading } from "@/components/heading";
import { Filter, MessageCircleQuestion } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TagsInput = ({ tags, setTags, handleSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    } else if (
      event.key === "Backspace" &&
      inputValue === "" &&
      tags.length > 0
    ) {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div className="mt-4">
      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={"Add tags..."}
          className="w-full focus:outline-none rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Search
        </button>
      </div>
      <div className="mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 ml-2 mb-2"
          >
            {tag}
            <button
              onClick={() => handleTagDelete(tag)}
              className="ml-2 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

const SuggestVideosWithHashtag = () => {
  const [tags, setTags] = useState([]);
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
  const handleSearch = async () => {
    setLoading(true);

    const API_KEY = "AIzaSyBMepq0T0uNF6NVuWMI1skYVTs8HTTGEd0"; // API anahtarınızı burada tanımlayın

    try {
      if (tags.length === 0) {
        setError("Please enter a tag.");
      } else {
        let maxResults = 10;

        if (
          !videoCount &&
          (!minVideoLikes || !maxVideoLikes) &&
          (!minVideoViews || !maxVideoViews)
        ) {
          maxResults = 50;
        } else if (videoCount) {
          maxResults = parseInt(videoCount);
        }
        const videoResults = await Promise.all(
          tags.map(async (tag) => {
            const response = await fetch(
              `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=${maxResults}&type=video&q=${encodeURIComponent(
                tag
              )}`
            );
            const data = await response.json();
            return data.items || [];
          })
        );
        
        const fetchVideoDetails = async (videoIds) => {
          const ids = videoIds.join(",");
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=statistics&id=${ids}`
          );
          const data = await response.json();
          return data.items || [];
        };
        
        // Flatten video results
        const videos = videoResults.flatMap((items) =>
          items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            publishedAt: item.snippet.publishedAt,
          }))
        );
        
        const videoIds = videos.map((video) => video.id);
        
        const videoDetails = await fetchVideoDetails(videoIds);
        
        const videosWithDetails = videos.map((video) => {
          const details = videoDetails.find((detail) => detail.id === video.id);
          return {
            ...video,
            viewCount: details?.statistics?.viewCount || "N/A",
            likeCount: details?.statistics?.likeCount || "N/A",
          };
        });
        
        const filteredVideos = videosWithDetails.filter((video) => {
          let likeCount = video.likeCount !== "N/A" ? parseInt(video.likeCount.replace(/\D/g, "")) : 0;
          let viewCount = video.viewCount !== "N/A" ? parseInt(video.viewCount.replace(/\D/g, "")) : 0;
        
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
            (!videoCount || videosWithDetails.length <= parseInt(videoCount))
          );
        });
        setSearchResults(filteredVideos);
        setError(null);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setError("An error occurred during search.");
    }

    setLoading(false);
  };


  return (
    <div>
      <Heading
        title="Suggest Videos With Hashtags"
        description="You can have a look at YouTube videos and generate ideas based on your hashtag(s) criteria."
        icon={MessageCircleQuestion}
        iconColor="text-pink-500"
        bgColor="bg-pink-500/10"
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
        <TagsInput tags={tags} setTags={setTags} handleSearch={handleSearch} />

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
                    {"See more"}
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

export default SuggestVideosWithHashtag;
