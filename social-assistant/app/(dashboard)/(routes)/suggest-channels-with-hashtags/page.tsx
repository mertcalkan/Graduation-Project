"use client"
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
    } else if (event.key === "Backspace" && inputValue === "" && tags.length > 0) {
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
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [channelCount, setChannelCount] = useState("");
  const [minSubscribers, setMinSubscribers] = useState("");
  const [maxSubscribers, setMaxSubscribers] = useState("");
  const [minVideos, setMinVideos] = useState("");
  const [maxVideos, setMaxVideos] = useState("");
  const [showCustomSubscriberRange, setShowCustomSubscriberRange] = useState(false);
  const [showCustomVideoCountRange, setShowCustomVideoCountRange] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const API_KEY = "YOUR_API_KEY"; // Replace with your API key
    try {
      if (tags.length === 0) {
        setError("Please enter a tag.");
      } else {
        const hashtagReq = tags.join("+");
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=channel&q=${encodeURIComponent(
            hashtagReq
          )}`
        );
        const data = await response.json();
        setSearchResults(
          data.items.map((item) => ({
            id: item.id.channelId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
          }))
        );
        setError(null); // Clear error when search succeeds
      }
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
        title="Suggest Channels With Hashtags"
        description="You can have a look YouTube channels based on your hashtag(s) criteria."
        icon={MessageCircleQuestion}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="app px-8 ">
        <div className="flex items-center">
        <div className="bg-white rounded-g p-4">
 
  







      
        </div>
         
        </div>
        <h1 className="mt-4 text-l font-semibold mr-4">Filter Options</h1>   
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div>
      <label htmlFor="channelCount" className="block">
        Number of Channels to Display
      </label>
      <input
        type="text"
        id="channelCount"
        value={channelCount}
        onChange={(e) => {
          let value = e.target.value;
          // Sadece rakamları kabul et
          value = value.replace(/\D/g, "");
          // En fazla 2 haneli olacak şekilde sınırlandır
          value = value.slice(0, 2);
          // Sıfır yazılamayacak
          if (value.startsWith("0")) {
            value = value.substring(1);
          }
          // - sembolünü engelle
          if (value.includes("-")) {
            value = value.replace("-", "");
          }
          // 50'den fazla kanal girişi yapılamayacak
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
        value={showCustomSubscriberRange ? "custom" : minSubscribers + "-" + maxSubscribers}
        onChange={(e) => {
          const [min, max] = e.target.value.split("-");
          if (e.target.value === "custom") {
            setShowCustomSubscriberRange(true);
          } else {
            setShowCustomSubscriberRange(false);
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
    </div>

    <div>
      <label htmlFor="videoCountRange" className="block">
        Video Count Range:
      </label>
      <select
        id="videoCountRange"
        value={showCustomVideoCountRange ? "custom" : minVideos + "-" + maxVideos}
        onChange={(e) => {
          const [min, max] = e.target.value.split("-");
          if (e.target.value === "custom") {
            setShowCustomVideoCountRange(true);
          } else {
            setShowCustomVideoCountRange(false);
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
    </div>
  </div>
        <h1 className="mt-4 text-xl font-semibold mr-4">Search the channel based on your taste!</h1>
        <TagsInput tags={tags} setTags={setTags} handleSearch={handleSearch} />

        
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <Progress />
        </div>
      )}
      {error && (
        <div className="mt-2 text-red-500 text-center">{error}</div>
      )}
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
            Generate Ideas
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestChannelsWithHashtags;
