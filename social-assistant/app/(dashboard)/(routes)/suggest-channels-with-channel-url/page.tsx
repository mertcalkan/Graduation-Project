"use client";
import React, { useState } from "react";
import { Heading } from "@/components/heading";
import { MessageCircleQuestion } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const isValidChannelUrl = (url) => {
  // YouTube channel URL regex pattern
  const regex = /^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|user\/)?@?([a-zA-Z0-9_-]+)$/;
  return regex.test(url);
};

const ChannelUrlInput = ({ inputValue, setInputValue, handleSearch }) => {
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (!isValidChannelUrl(value) && value !== "") {
      setError("Please enter a valid YouTube channel URL.");
    } else {
      setError("");
    }
  };

  const handleSearchClick = () => {
    console.log(inputValue)
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

const SuggestChannelsWithChannelUrl = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [channelCount, setChannelCount] = useState("");
  const [minSubscribers, setMinSubscribers] = useState("");
  const [maxSubscribers, setMaxSubscribers] = useState("");
  const [minVideos, setMinVideos] = useState("");
  const [maxVideos, setMaxVideos] = useState("");
  const [showCustomSubscriberRange, setShowCustomSubscriberRange] = useState(false);
  const [showCustomVideoCountRange, setShowCustomVideoCountRange] = useState(false);

  const handlePopupOpen = (data) => {
    setPopupData(data);
  };

  const handlePopupClose = () => {
    setPopupData(null);
  };

  const handleSearch = async (channelUrl) => {
    setLoading(true);
    const API_KEY = "AIzaSyASFJquvesoqC9Yx06F0-Q1MswQfNJo8ZQ";
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&part=snippet,statistics&id=${channelUrl}`
      );
      const data = await response.json();
      console.log(data)
      setSearchResults([{
        id: data.items[0].id,
        title: data.items[0].snippet.title,
        description: data.items[0].snippet.description,
        thumbnail: data.items[0].snippet.thumbnails.default.url,
        subscribers: data.items[0].statistics.subscriberCount,
        viewCount: data.items[0].statistics.viewCount,
        videoCount: data.items[0].statistics.videoCount,
        country: data.items[0].snippet.country,
      }]);
      setError(null);
    } catch (error) {
      console.error("Error during search:", error);
      setError("An error occurred during search.");
    }
    setLoading(false);
  };

  const generateIdeas = () => {
    console.log("Generating ideas for all results");
  };

  return (
    <div>
      <Heading
        title="Suggest Channels With Channel URL"
        description="You can have a look at YouTube channels based on your channel URL criteria."
        icon={MessageCircleQuestion}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="app px-8">
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
                const value = e.target.value;
                if (value === "custom") {
                  setMinSubscribers("");
                  setMaxSubscribers("");
                  setShowCustomSubscriberRange(true);
                } else {
                  setShowCustomSubscriberRange(false);
                  const [min, max] = value.split("-");
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
                const value = e.target.value;
                if (value === "custom") {
                  setMinVideos("");
                  setMaxVideos("");
                  setShowCustomVideoCountRange(true);
                } else {
                  setShowCustomVideoCountRange(false);
                  const [min, max] = value.split("-");
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
                    {" Daha Fazlasını Gör"}
                  </span>
                )}
              </p>
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

        {popupData && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-3/4 max-w-sm max-h-screen overflow-y-auto">
              <h2 className="text-lg font-bold mb-8">Channel Information</h2>
              <img src={popupData.thumbnail} alt="Thumbnail" className="mt-2" />
              <h2 className="text-lg font-semibold">{popupData.title}</h2>
              <p className="text-gray-600 mb-4">{popupData.description}</p>
              <p className="text-gray-600">
                Subscribers:{" "}
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(popupData.subscribers)}
                <br/>
                Views:{" "}
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(popupData.viewCount)}
                <br />
                Video Count:{" "}
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(popupData.videoCount)}
                <br />
                Country: {popupData.country}
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

export default SuggestChannelsWithChannelUrl;
