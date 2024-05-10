"use client"
import React, { useState } from 'react';
import { Heading } from "@/components/heading";
import { MessageCircleQuestion } from "lucide-react";

const TagsInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleBackspaceKeyDown = (event) => {
    if (event.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            handleInputKeyDown(event);
            handleBackspaceKeyDown(event);
          }}
          placeholder="Add tags..."
          className="w-full focus:outline-none rounded-l-lg"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 cursor-pointer ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-5 5-5-5"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 5-5 7 7-5 5z"/>
        </svg>
      </div>
      <div className="mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {tag}
            <button onClick={() => handleTagDelete(tag)} className="ml-2 text-gray-600 hover:text-gray-800">&times;</button>
          </span>
        ))}
      </div>
    </div>
  );
};

const SuggestIdeasPage = () => {
  const [tags, setTags] = useState([]);

  return (
    <div>
      <Heading
        title="Suggest Ideas"
        description="You can take advice video and channel ideas."
        icon={MessageCircleQuestion}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="app px-8 py-8">
        <h1 className="text-xl font-semibold mb-4">Enter your ideas:</h1>
        <TagsInput tags={tags} setTags={setTags} />
      </div>
    </div>
  );
};

export default SuggestIdeasPage;
