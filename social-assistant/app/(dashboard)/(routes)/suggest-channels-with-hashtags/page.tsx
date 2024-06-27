"use client";
import React, { useState } from "react";
import { Heading } from "@/components/heading";
import { Filter, MessageCircleQuestion } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import OpenAI from 'openai';

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

const SuggestChannelsWithHashtags = () => {
  const openai = new OpenAI({apiKey:"sk-proj-2v30iYHu0dcTUBB9XCWWT3BlbkFJtskDkosP9UyAH1wLfWeF", dangerouslyAllowBrowser:true});
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [channelCount, setChannelCount] = useState("");
  let [minSubscribers, setMinSubscribers] = useState("");
  let [maxSubscribers, setMaxSubscribers] = useState("");
  let [minVideos, setMinVideos] = useState("");
  let [maxVideos, setMaxVideos] = useState("");
  const [showCustomSubscriberRange, setShowCustomSubscriberRange] =
    useState(false);
  const [showCustomVideoCountRange, setShowCustomVideoCountRange] =
    useState(false);

  const handlePopupOpen = (data) => {
    setPopupData(data);
  };

  const handlePopupClose = () => {
    setPopupData(null);
  };
  const handleSearch = async () => {
    setLoading(true);

    const API_KEY = "AIzaSyASFJquvesoqC9Yx06F0-Q1MswQfNJo8ZQ";  // API anahtarınızı buraya ekleyin
    console.log(API_KEY)
    try {
      if (tags.length === 0) {
        setError("Please enter a tag.");
      } else {
        const hashtagReq = tags.join("+"); // Etiketlerden hashtag isteği oluştur

        // Etiketlere göre popüler videoları bul
        const popularVideos = await Promise.all(
          tags.map(async (tag) => {
            let maxResults = 10;
            if (
              !channelCount &&
              (!minSubscribers || !maxSubscribers) &&
              (!minVideos || !maxVideos)
            ) {
              maxResults = 50;
            } else if (channelCount) {
              console.log(2)
              maxResults = parseInt(channelCount);
            }

            let response = await fetch(
              `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=${maxResults}&type=video&q=${encodeURIComponent(
                tag
              )}`
            );

            const data = await response.json();
            return data.items;
          })
        );

        // Popüler videolardan kanal ID'lerini çıkar
        const channels = popularVideos.flatMap((items) =>
          items.map((item) => item.snippet.channelId)
        );

        // Tekil kanal ID'lerini al
        const uniqueChannels = [...new Set(channels)];

        // Kanal detaylarını al
        const channelDetails = await Promise.all(
          uniqueChannels.map(async (channelId) => {
            const response = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&part=snippet,statistics&id=${channelId}`
            );
            const data = await response.json();
            return data.items[0];
          })
        );
      
        const relatedChannels = 
          channelDetails.map(item => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.default?.url,
            subscribers: item.statistics?.subscriberCount || 0,
            viewCount: item.statistics?.viewCount || 0,
            videoCount: item.statistics?.videoCount || 0,
            country: item.snippet.country,
             url: `https://www.youtube.com/channel/${item.id}`
          }))
        

        const filteredChannels = relatedChannels.filter((channel) => {
          let subscriberCount =
            parseInt(channel.subscribers.replace(/\D/g, "")) || 0;
          let videoCount = parseInt(channel.videoCount.replace(/\D/g, "")) || 0;

          let minSubs = parseInt(minSubscribers) || 0;
          let maxSubs = parseInt(maxSubscribers) || Infinity;
          let minVidCnt = parseInt(minVideos) || 0;
          let maxVidCnt = parseInt(maxVideos) || Infinity;
          if (maxVidCnt < minVidCnt) {
            setMaxVideos(minVidCnt);
            setMinVideos(maxVidCnt);
            let tempMinVideos = minVidCnt;
            minVidCnt = maxVidCnt;
            maxVidCnt = tempMinVideos;
          }
          if (maxSubs < minSubs) {
            setMaxSubscribers(minSubs);
            setMinSubscribers(maxSubs);
            let tempMinSubscribers = minSubs;
            minSubs = maxSubs;
            maxSubs = tempMinSubscribers;
          }
          return (
            subscriberCount >= minSubs &&
            subscriberCount <= maxSubs &&
            videoCount >= minVidCnt &&
            videoCount <= maxVidCnt &&
            (!channelCount || relatedChannels.length <= parseInt(channelCount))
          );
        });
        // Kanal detaylarından arama sonuçlarını hazırla
        setSearchResults(filteredChannels);
        setError(null); // Arama başarılıysa hatayı temizle
      }
    } catch (error) {
      console.error("Error during search:", error);
      setError("An error occurred during search.");
    }

    setLoading(false);
  };

  const generateIdeas = async () => {
    if (!searchResults || searchResults.length === 0) {
      setError("No search results to generate ideas from.");
      return;
    }
  
    setLoading(true);
  
    try {
      const prompt = `Create new YouTube channel ideas based on the following channels:\n\n${searchResults
        .map(
          (channel) =>
            `Title: ${channel.title}, Description: ${channel.description}, Subscribers: ${channel.subscribers}, Video Count: ${channel.videoCount}, Country: ${channel.country}, Channel Url: ${channel.url}`
        )
        .join("\n\n")}\n\nPlease provide unique and creative channel ideas with titles and descriptions.`;
  
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openai.apiKey}`, // Replace with your actual API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: prompt }],
          max_tokens: 500,
          n: 1,
          stop: null,
          temperature: 0.7,
        }),
      });
  
      const responseData = await response.json();
  
      const newChannelIdeas = responseData.choices.map((choice, index) => ({
        id: index + 1,
        idea: choice.message.content.trim(),
      }));
  
      const jsonIdeas = JSON.stringify(newChannelIdeas, null, 2);
  
      setPopupData(jsonIdeas);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error generating channel ideas:", error);
      setError("An error occurred while generating channel ideas.");
      setLoading(false);
    }
  };
  
  
  
  

  return (
    <div>
      <Heading
        title="Suggest Channels With Hashtags"
        description="You can have a look YouTube channels based on your hashtag(s) criteria."
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
                // Set the final value
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
                  placeholder="Min Subs"
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
                  placeholder="Max Subs"
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
        <TagsInput tags={tags} setTags={setTags} handleSearch={handleSearch} />
      </div>

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
            className="border p-4 ml-8 mr-8 "
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

      {/* Popup component for detailed channel information */}
      {popupData && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-3/4 max-w-sm max-h-screen overflow-y-auto">
            <h2 className="text-lg font-semibold mb-8">Channel Information</h2>
            <img src={popupData.thumbnail} alt="Thumbnail" className="mt-2" />

            <h2 className="text-lg font-semibold">{popupData.title}</h2>
            <p className="text-gray-600 mb-4">{popupData.description}</p>
            <p className="text-gray-600">
              Subscribers:{" "}
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(popupData.subscribers)}
              <br />
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
              <br />
              URL:{" "}
              <a
                  href={popupData.url}
                  target="_blank"
                  className="text-blue-500"
                >
                  {popupData.url}
                </a>
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
  );
};

export default SuggestChannelsWithHashtags;
