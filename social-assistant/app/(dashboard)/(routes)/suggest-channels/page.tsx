"use client"
import React, { useState, useEffect } from "react";
import { Heading } from "@/components/heading";
import { Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TagsInput = ({ tags, setTags, setLoading, searchChannels, selectedOption }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState("channel");
  const [subscriberRange, setSubscriberRange] = useState("0-1000");
  const [minSubscribers, setMinSubscribers] = useState("");
  const [maxSubscribers, setMaxSubscribers] = useState("");
  const [minVideos, setMinVideos] = useState("");
  const [maxVideos, setMaxVideos] = useState("");

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
    if (tags.length === 0) {
      setError("Please enter a tag.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchChannels(
        tags,
        searchType,
        subscriberRange,
        minSubscribers,
        maxSubscribers,
        minVideos,
        maxVideos
      );
      setSearchResults(results);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
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
              handleInputKeyDown(event);
              handleBackspaceKeyDown(event);
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
  const [selectedOption, setSelectedOption] = useState("hashtag"); // Varsayılan seçenek: hashtag

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
            selectedOption={selectedOption} // Burada selectedOption değerini props olarak iletiyoruz
          />
        ) : (
          <div className="mt-4">
            <div className="flex flex-col md:flex-row items-center border border-gray-300 rounded-lg px-4 py-2">
              <input
                type="text"
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
              <label htmlFor="searchType">Search Type:</label>
              <select
                id="searchType"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2"
              >
                <option value="channel">Only Channel Name</option>
                <option value="shorts">Shorts Video</option>
                <option value="long">Long Video</option>
              </select>
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
                    placeholder="Min Video Count"
                    value={minVideos}
                    onChange={(e) => setMinVideos(e.target.value)}
                    className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Max Video Count"
                    value={maxVideos}
                    onChange={(e) => setMaxVideos(e.target.value)}
                    className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2 w-1/2"
                  />
                </div>
              )}
              <button
                onClick={handleApplyFilters}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Apply Filters
              </button>
              <button
                onClick={toggleFilters}
                className="absolute top-0 right-0 mt-4 mr-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                &#10006;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestIdeasPage;
