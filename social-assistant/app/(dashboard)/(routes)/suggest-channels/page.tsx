"use client"
import React, { useState, useEffect } from "react";
import { Heading } from "@/components/heading";
import { Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TagsInput = ({ tags, setTags, setLoading, searchChannels, selectedOption}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState("channel");
  const [subscriberRange, setSubscriberRange] = useState("0-1000");
  const [minSubscribers, setMinSubscribers] = useState("");
  const [maxSubscribers, setMaxSubscribers] = useState("");
  const [minVideos, setMinVideos] = useState("");
  const [maxVideos, setMaxVideos] = useState("");
  const [similarChannels, setSimilarChannels] = useState([]);
  const [similarVideos, setSimilarVideos] = useState([]);
 
  // selectedOption değiştiğinde tags state'ini temizle
  useEffect(() => {
    if (selectedOption === "hashtag" || selectedOption === "channelName" || selectedOption === "channelUrl" || selectedOption === "videoUrl") {
      setTags([]);
    }
  }, [selectedOption, setTags]);
 
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    // Her input değiştiğinde hatayı temizle
    setError(null);
  };
  const isYouTubeChannelUrl = (url) => {
    // YouTube kanalı URL'si regex'i
    const channelRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/(channel|c)\/[a-zA-Z0-9_-]+/;
    return channelRegex.test(url);
  };
  const getVideoIdFromUrl = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match && match[1];
  };
  const isYouTubeVideoUrl = (url) => {
    // YouTube video URL'si regex'i
    const videoRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(&\S*)?/;
    return videoRegex.test(url);
  };
  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
      // Etiket eklendiğinde hatayı temizle
      setError(null);
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleBackspaceKeyDown = (event) => {
    if (event.key === "Backspace" && inputValue === "" && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  const handleSearch = async () => {
    const API_KEY = "AIzaSyBMepq0T0uNF6NVuWMI1skYVTs8HTTGEd0"; // API anahtarınızı buraya ekleyin
    console.log(3)
    try {
      if (selectedOption === "hashtag") {
        if (tags.length === 0) {
          setError("Please enter a tag.");
        }
        else{
          const hashtagReq = tags.join('+');
          const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=channel&q=${encodeURIComponent(hashtagReq)}`);
          const data = await response.json();
          setSearchResults(data.items.map(item => ({
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url // Örnek olarak thumbnail alınabilir, sizin ihtiyacınıza göre düzenleyin
          })));
        }
       
      } else if (selectedOption === "channelUrl") {
        // Kanal URL'sinden kanal ID'sini al
        if (isYouTubeChannelUrl(inputValue)) {
          const channelId = getChannelIdFromUrl(inputValue);
          if (channelId) {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&channelId=${channelId}&type=video&maxResults=10&key=${API_KEY}`);
            const data = await response.json();
            const popularVideos = data.items.map(item => ({
              title: item.snippet.title,
              description: item.snippet.description,
              tags: item.snippet.tags,
              categoryId: item.snippet.categoryId
            }));
            const similarChannelsData = await fetchSimilarChannels(popularVideos, API_KEY);
            setSimilarChannels(similarChannelsData);
          }
        } else {
          setError("Please enter a valid channel URL.");
          return;
        }
      } else if (selectedOption === "videoUrl") {
        // Video URL'si seçiliyse
        if (!isYouTubeVideoUrl(inputValue)) {
          setError("Please enter a valid video URL.");
          return;
        }
        const videoId = getVideoIdFromUrl(inputValue);
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`);
        const data = await response.json();
        const videoTags = data.items[0].snippet.tags;
        const similarVideosData = await fetchSimilarVideos(videoTags, videoId, API_KEY);
        setSimilarVideos(similarVideosData);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setError("An error occurred during search.");
    }
  };
  
  // Kanal URL'sinden kanal ID'sini almak için ayrı bir fonksiyon ekle
  const getChannelIdFromUrl = (url) => {
    const match = url.match(/(channel|user)\/([a-zA-Z0-9_-]+)/);
    return match && match[2];
  };
  
  // Benzer kanalları bulmak için ayrı bir fonksiyon ekle
  const fetchSimilarChannels = async (videos, API_KEY) => {
    const similarChannelsData = [];
    for (const video of videos) {
      for (const tag of video.tags) {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${tag}&type=channel&key=${API_KEY}`);
        const data = await response.json();
        for (const item of data.items) {
          const channelId = item.snippet.channelId;
          if (!similarChannelsData.some(channel => channel.id === channelId)) {
            similarChannelsData.push({ title: item.snippet.channelTitle, id: channelId });
          }
        }
      }
    }
    return similarChannelsData;
  };
  
  // Benzer videoları bulmak için ayrı bir fonksiyon ekle
  const fetchSimilarVideos = async (tags, excludeVideoId, API_KEY) => {
    const similarVideosData = [];
    for (const tag of tags) {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${tag}&type=video&key=${API_KEY}`);
      const data = await response.json();
      for (const item of data.items) {
        if (item.id.videoId !== excludeVideoId) {
          similarVideosData.push({ title: item.snippet.title, videoId: item.id.videoId });
        }
      }
    }
    return similarVideosData;
  };
  
  

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row items-center border border-gray-300 rounded-lg px-4 py-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (selectedOption === "hashtag") {
              if (event.key === "Enter" && inputValue.trim() !== "") {
                setTags([...tags, inputValue.trim()]);
                setInputValue("");
                // Etiket eklendiğinde hatayı temizle
                setError(null);
              } else if (event.key === "Backspace" && inputValue === "" && tags.length > 0) {
                const newTags = [...tags];
                newTags.pop();
                setTags(newTags);
              }
            }
          }}
          placeholder={
            selectedOption === "hashtag"
              ? "Add tags..."
              : `Enter ${
                  selectedOption === "channelName"
                    ? "channel name"
                    : selectedOption === "channelUrl"
                    ? "channel URL"
                    : "video URL"
                }...`
          }
          className="w-full md:w-2/3 focus:outline-none rounded-lg mb-2 md:mb-0 md:mr-2"
        />

        <button
          onClick={handleSearch}
          className="md:ml-auto mt-2 md:mt-0 md:ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Search
        </button>
      </div>
      {error && <div className="mt-2 text-red-500">{error}</div>}
      <div className="mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
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
      {searchResults.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full h-auto mb-2 rounded-lg"
              />
              <h3 className="text-lg font-semibold">{result.title}</h3>
              <p className="text-gray-600">{result.description}</p>
            </div>
          ))}
        </div>
      )}
      {similarChannels.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Similar Channels:</h2>
          <ul className="list-disc pl-8">
            {similarChannels.map((channel, index) => (
              <li key={index}>{channel.title}</li>
            ))}
          </ul>
        </div>
      )}
      {similarVideos.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Similar Videos:</h2>
          <ul className="list-disc pl-8">
            {similarVideos.map((video, index) => (
              <li key={index}>{video.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SuggestIdeasPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchType, setSearchType] = useState("channel");
  const [subscriberRange, setSubscriberRange] = useState("0-1000");
  const [videoCountRange, setVideoCountRange] = useState("0-1000");
  const [minSubscribers, setMinSubscribers] = useState("");
  const [maxSubscribers, setMaxSubscribers] = useState("");
  const [minVideos, setMinVideos] = useState("");
  const [maxVideos, setMaxVideos] = useState("");
  let [selectedOption, setSelectedOption] = useState(""); // Varsayılan seçenek: hashtag

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const handleSearchVariant = async () => {
    const API_KEY = "AIzaSyBMepq0T0uNF6NVuWMI1skYVTs8HTTGEd0"; // API anahtarınızı buraya ekleyin
    console.log(3)
    try {
      if (selectedOption === "hashtag") {
        if (tags.length === 0) {
          setError("Please enter a tag.");
        }
        else{
          const hashtagReq = tags.join('+');
          const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=channel&q=${encodeURIComponent(hashtagReq)}`);
          const data = await response.json();
          setSearchResults(data.items.map(item => ({
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url // Örnek olarak thumbnail alınabilir, sizin ihtiyacınıza göre düzenleyin
          })));
        }
       
      } else if (selectedOption === "channelUrl") {
        // Kanal URL'sinden kanal ID'sini al
        if (isYouTubeChannelUrl(inputValue)) {
          const channelId = getChannelIdFromUrl(inputValue);
          if (channelId) {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&channelId=${channelId}&type=video&maxResults=10&key=${API_KEY}`);
            const data = await response.json();
            const popularVideos = data.items.map(item => ({
              title: item.snippet.title,
              description: item.snippet.description,
              tags: item.snippet.tags,
              categoryId: item.snippet.categoryId
            }));
            const similarChannelsData = await fetchSimilarChannels(popularVideos, API_KEY);
            setSimilarChannels(similarChannelsData);
          }
        } else {
          setError("Please enter a valid channel URL.");
          return;
        }
      } else if (selectedOption === "videoUrl") {
        // Video URL'si seçiliyse
        if (!isYouTubeVideoUrl(inputValue)) {
          setError("Please enter a valid video URL.");
          return;
        }
        const videoId = getVideoIdFromUrl(inputValue);
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`);
        const data = await response.json();
        const videoTags = data.items[0].snippet.tags;
        const similarVideosData = await fetchSimilarVideos(videoTags, videoId, API_KEY);
        setSimilarVideos(similarVideosData);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setError("An error occurred during search.");
    }
  };
  const searchChannels = async (
    tags,
    searchType,
    subscriberRange,
    minSubscribers,
    maxSubscribers,
    minVideos,
    maxVideos
  ) => {
    setLoading(true);
    // Buraya API isteği yapılacak
  };

  const handleApplyFilters = () => {
    if (
      minSubscribers !== "" &&
      maxSubscribers !== "" &&
      parseInt(minSubscribers) >= parseInt(maxSubscribers)
    ) {
      setError("Minimum subscribers should be less than maximum subscribers.");
      return;
    }
    if (
      minVideos !== "" &&
      maxVideos !== "" &&
      parseInt(minVideos) >= parseInt(maxVideos)
    ) {
      setError("Minimum video count should be less than maximum video count.");
      return;
    }
    // Burada filtreleri uygula fonksiyonunu çağır
    // Bu fonksiyonun içinde de uygun doğrulama işlemlerini gerçekleştir
    // API isteği yap ve sonuçları güncelle
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
   
  };

  return (
    <div>
      <Heading
        title="Suggest Channel"
        description="You can have a look YouTube channels based on your criterias like hashtags, keywords, similar YouTubers etc."
        icon={Filter}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
      <div className="app px-8 py-8">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold mr-4">
            Search the channel based on your taste!
          </h1>
          <button
            onClick={toggleFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
          >
            <Filter size={20} />
          </button>
        </div>
        <div className="flex items-center mt-4">
          <label htmlFor="searchOption" className="mr-2">
            Search Option:
          </label>
          <select
            id="searchOption"
            value={selectedOption}
            onChange={handleOptionChange}
            className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2"
          >
            <option value="hashtag">Hashtag</option>
            <option value="channelName">Channel Name</option>
            <option value="channelUrl">Channel URL</option>
            <option value="videoUrl">Video URL</option>
          </select>
        </div>
        {selectedOption === "hashtag" ? (
 <TagsInput
 tags={tags}
 setTags={setTags}
 setLoading={setLoading}
 searchChannels={searchChannels}
 selectedOption={selectedOption}

/>
) : (
  <div className="mt-4">
    <div className="flex flex-col md:flex-row items-center border border-gray-300 rounded-lg px-4 py-2">
      <input
        type="text"
        placeholder={
          selectedOption === "channelName"
            ? "Enter channel name..."
            : selectedOption === "channelUrl"
            ? "Enter channel URL..."
            : "Enter video URL..."
        }
        className="w-full md:w-2/3 focus:outline-none rounded-lg mb-2 md:mb-0 md:mr-2"
      />

      <button onClick={handleSearchVariant}
        
        className="md:ml-auto mt-2 md:mt-0 md:ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        Search
      </button>
    </div>
  </div>
)}

      </div>
      {showFilters && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-full md:w-1/2">
            <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
            <div className="flex flex-col space-y-4">
              
              <label htmlFor="subscriberRange">Subscriber Range:</label>
              <select
                id="subscriberRange"
                value={subscriberRange}
                onChange={(e) => setSubscriberRange(e.target.value)}
                className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2"
              >
                <option value="0-1000">0 - 1000</option>
                <option value="1000-10000">1000 - 10,000</option>
                <option value="10000-100000">10,000 - 100,000</option>
                <option value="100000-1000000">100,000 - 1,000,000</option>
                <option value="1000000-10000000">1,000,000 - 10,000,000</option>
                <option value="custom">Custom Range</option>
              </select>
              {subscriberRange === "custom" && (
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder="Min Subscribers"
                    value={minSubscribers}
                    onChange={(e) => setMinSubscribers(e.target.value)}
                    className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Max Subscribers"
                    value={maxSubscribers}
                    onChange={(e) => setMaxSubscribers(e.target.value)}
                    className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                  />
                </div>
              )}
              <label htmlFor="videoCountRange">Video Count Range:</label>
              <select
                id="videoCountRange"
                value={videoCountRange}
                onChange={(e) => setVideoCountRange(e.target.value)}
                className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2"
              >
                <option value="0-1000">0 - 1000</option>
                <option value="1000-10000">1000 - 10,000</option>
                <option value="10000-100000">10,000 - 100,000</option>
                <option value="100000-1000000">100,000 - 1,000,000</option>
                <option value="1000000-10000000">1,000,000 - 10,000,000</option>
                <option value="custom">Custom Range</option>
              </select>
              {videoCountRange === "custom" && (
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder="Min Videos"
                    value={minVideos}
                    onChange={(e) => setMinVideos(e.target.value)}
                    className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Max Videos"
                    value={maxVideos}
                    onChange={(e) => setMaxVideos(e.target.value)}
                    className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleApplyFilters}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <Progress />
        </div>
      )}
    </div>
  );
};

export default SuggestIdeasPage;
