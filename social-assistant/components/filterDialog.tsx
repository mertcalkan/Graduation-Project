import React, { useState } from "react";

const FilterChannelSearch = ({
  handleApplyFilters,
  toggleFilters,
  minSubscribers,
  maxSubscribers,
  minVideos,
  maxVideos,
}) => {
  const [searchType, setSearchType] = useState("channel");
  const [subscriberRange, setSubscriberRange] = useState("0-1000");
  const [videoCountRange, setVideoCountRange] = useState("0-1000");
  const [channelCount, setChannelCount] = useState("");

  const handleApplyFiltersClick = () => {
    handleApplyFilters({
      searchType,
      subscriberRange,
      minSubscribers,
      maxSubscribers,
      videoCountRange,
      minVideos,
      maxVideos,
      channelCount,
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full md:w-1/2">
        <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
        <div className="flex flex-col space-y-4">
          <label htmlFor="channelCount">
            Number of Channels to Display: (Max 50 Results){" "}
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
            className="border border-gray-300 rounded-lg focus:outline-none px-4 py-2"
          />

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
          {/* 'Apply Filters' butonuna tıklanınca applyFilters fonksiyonunu çağır */}
          <button
            onClick={handleApplyFiltersClick}
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
  );
};

export default FilterChannelSearch;
