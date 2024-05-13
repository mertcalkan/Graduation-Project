
"use client"
import React, { useState } from "react";
import { Heading } from "@/components/heading";
import { Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {FilterChannelSearch}  from "@/components/filterDialog";
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
      setError("");
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
          placeholder={"Enter the video URL"}
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
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = async () => {
    setLoading(true);
    const API_KEY = "AIzaSyBMepq0T0uNF6NVuWMI1skYVTs8HTTGEd0"; // Replace with your API key
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
        
        <TagsInput tags={tags} setTags={setTags} handleSearch={handleSearch} />
      </div>
      
      {showFilters && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
         && <FilterChannelSearch handleApplyFilters={handleApplyFilters} toggleFilters={toggleFilters} />
        </div>
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <Progress />
        </div>
      )}
      {error && (
        <div className="mt-2 text-red-500 text-center">
          {error}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {searchResults.map((result, index) => (
          <div  key={index} className="border p-4 ml-8 mr-8 ">
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
