"use client";
import React, { useState } from "react";
import { Heading } from "@/components/heading";
import { MessageCircleQuestion } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ChannelUrlInput = ({ channelUrl, setChannelUrl, handleSearch }) => {
  const handleInputChange = (event) => {
    setChannelUrl(event.target.value);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
        <input
          type="text"
          value={channelUrl}
          onChange={handleInputChange}
          placeholder={"Enter the Video Url"}
          className="w-full focus:outline-none rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Search
        </button>
      </div>
    </div>
  );
};

const SuggestChannelsWithVideoUrl = () => {
  const [channelUrl, setChannelUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [channelCount, setChannelCount] = useState("");
  const [minSubscribers, setMinSubscribers] = useState("");
  const [maxSubscribers, setMaxSubscribers] = useState("");
  const [minVideos, setMinVideos] = useState("");
  const [maxVideos, setMaxVideos] = useState("");
  const [showCustomSubscriberRange, setShowCustomSubscriberRange] =
    useState(false);
  const [showCustomVideoCountRange, setShowCustomVideoCountRange] =
    useState(false);

    const handleSearch = async (channelUrl) => {
      setLoading(true);
    
      try {
        // Extract channel ID from the channel URL
        const channelId = extractVideoId(channelUrl);
    
        if (!channelId) {
          throw new Error("Invalid channel URL");
        }
    
        const API_KEY = "AIzaSyASFJquvesoqC9Yx06F0-Q1MswQfNJo8ZQ"; // API anahtarınızı burada tanımlayın
    
        // Fetch channel details
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&part=snippet,statistics&id=${channelId}`
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch channel data");
        }
    
        const data = await response.json();
    
        if (!data.items || data.items.length === 0) {
          throw new Error("Channel details not found");
        }
    
        const channelDetails = data.items[0];
        const channelKeywords = channelDetails.snippet.title.split(" ").join("+");
        let maxResults = 10;

        if (!channelCount && (!minSubscribers || !maxSubscribers) && (!minVideos || !maxVideos)) {
          maxResults = 50;
        } else if (channelCount) {
          maxResults = parseInt(channelCount);
        }
        // Fetch related channels
        const relatedChannelsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=channel&maxResults=${maxResults}&q=${channelKeywords}`
        );
    
        if (!relatedChannelsResponse.ok) {
          throw new Error("Failed to fetch related channels");
        }
    
        const relatedChannelsData = await relatedChannelsResponse.json();
    
        if (!relatedChannelsData.items || relatedChannelsData.items.length === 0) {
          throw new Error("No related channels found");
        }
    
        const relatedChannels = relatedChannelsData.items.map((item) => ({
          id: item.id.channelId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.default.url,
          channelUrl: `https://www.youtube.com/channel/${item.id.channelId}`,
        }));
    
        setSearchResults(relatedChannels);
        setError(null);
      } catch (error) {
        console.error("Error during channel search:", error);
        setError("Failed to suggest similar channels");
      } finally {
        setLoading(false);
      }
    };
    
   
    
    const extractVideoId = (videoUrl) => {
      const url = new URL(videoUrl);
      const searchParams = url.searchParams;
      if (searchParams.has("v")) {
        return searchParams.get("v");
      } else {
        const pathname = url.pathname;
        const parts = pathname.split("/");
        const idIndex = parts.indexOf("watch") + 1;
        return parts[idIndex];
      }
    };
    
    
    

  const generateIdeas = () => {
    console.log("Generating ideas for all results");
  };

  return (
    <div>
      <Heading
        title="Suggest Channels With YouTube Video Url"
        description="You can have a look at YouTube channels based on your YouTube Video URL."
        icon={MessageCircleQuestion}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="app px-8 ">
        <div className="flex items-center">
          <div className="bg-white rounded-g"></div>
        </div>
        <h1 className="mt-4 text-l font-semibold mr-4">Filter Options</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="channelCount" className="block">
              Number of Channels
            </label>
            <input
              type="text"
              id="channelCount"
              value={channelCount}
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
                setChannelCount(value);
              }}
              className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="subscriberRange" className="block">
              Subscriber Range:
            </label>
            <select
              id="subscriberRange"
              value={
                showCustomSubscriberRange
                  ? "custom"
                  : minSubscribers + "-" + maxSubscribers
              }
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setShowCustomSubscriberRange(true);
                } else {
                  setShowCustomSubscriberRange(false);
                  const [min, max] = e.target.value.split("-");
                  setMinSubscribers(min);
                  setMaxSubscribers(max);
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
            {showCustomSubscriberRange && (
              <div className="flex space-x-4 mt-2">
                <input
                  type="text"
                  placeholder="Min Subscribers"
                  value={minSubscribers}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setMinSubscribers(value);
                    }
                  }}
                  maxLength="11"
                  className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                />
                <input
                  type="text"
                  placeholder="Max Subscribers"
                  value={maxSubscribers}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setMaxSubscribers(value);
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
              Video Count Range:
            </label>
            <select
              id="videoCountRange"
              value={
                showCustomVideoCountRange
                  ? "custom"
                  : minVideos + "-" + maxVideos
              }
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setShowCustomVideoCountRange(true);
                } else {
                  setShowCustomVideoCountRange(false);
                  const [min, max] = e.target.value.split("-");
                  setMinVideos(min);
                  setMaxVideos(max);
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
            {showCustomVideoCountRange && (
              <div className="flex space-x-4 mt-2">
                <input
                  type="text"
                  placeholder="Min Video Count"
                  value={minVideos}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setMinVideos(value);
                    }
                  }}
                  maxLength="11"
                  className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                />
                <input
                  type="text"
                  placeholder="Max Video Count"
                  value={maxVideos}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setMaxVideos(value);
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
          channelUrl={channelUrl}
          setChannelUrl={setChannelUrl}
          handleSearch={handleSearch}
        />
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <Progress />
        </div>
      )}
      {error && <div className="mt-2 text-red-500 text-center">{error}</div>}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {searchResults.map((result, index) => (
          <div key={index} className="border p-4 ml-8 mr-8 ">
            <img src={result.thumbnail} alt="Thumbnail" className="mt-2" />
            <h3 className="text-lg font-semibold">{result.title}</h3>
            <p className="text-gray-600">{result.description}</p>
          </div>
        ))}
      </div>
      {searchResults.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={generateIdeas}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Generate Channel Ideas
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestChannelsWithVideoUrl;
