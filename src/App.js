import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import UserDashboard from './pages/UserDashboard';
import CreateRecipe from './pages/CreateRecipe';
import Community from './pages/Community'; // New page
import { Toaster } from 'react-hot-toast';

export const UserDashboardContext = createContext();

function App() {
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      user: 'ChefJohn',
      content: 'Check out my new recipe for Spicy Tacos!',
      image: 'taco.png',
      video: null,
      upvotes: 15,
      downvotes: 2,
      comments: ['Great recipe!', 'Needs more spice!'],
    },
    {
      id: 2,
      user: 'BakeMaster',
      content: 'Sharing a video of my Chocolate Cake process.',
      image: null,
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      upvotes: 25,
      downvotes: 1,
      comments: ['Amazing video!', 'Can you share the recipe?'],
    },
  ]);

  const handleUpvote = (postId) => {
    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
  };

  const handleDownvote = (postId) => {
    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
      )
    );
  };

  const handleAddComment = (postId, comment) => {
    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
      )
    );
  };

  const handleAddCommunityPost = (newPostData) => {
    const newPost = {
      id: Date.now(),
      user: 'CurrentUser', // Replace with logged-in user later
      ...newPostData,
      upvotes: 0,
      downvotes: 0,
      comments: [],
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  return (
    <UserDashboardContext.Provider value={{ communityPosts, handleUpvote, handleDownvote, handleAddComment, handleAddCommunityPost }}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/community" element={<Community />} /> {/* New route */}
        </Routes>
      </Router>
    </UserDashboardContext.Provider>
  );
}

export default App;