import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import images from src/assets/
import TacoImage from '../assets/taco.png';
import PastaImage from '../assets/pasta.png';
import CakeImage from '../assets/cake.png';
import BiryaniImage from '../assets/biryani.jpg';
import IcecreamImage from '../assets/icecream.jpg';
import PulavImage from '../assets/pulav.png';

const CommunityPostCard = ({ post, onUpvote, onDownvote, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const imageMap = {
    'taco.png': TacoImage,
    'pasta.png': PastaImage,
    'cake.png': CakeImage,
    'biryani.jpg': BiryaniImage,
    'icecream.jpg': IcecreamImage,
    'pulav.png': PulavImage,
  };

  const imageSource = post.image ? imageMap[post.image] || post.image : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
    >
      <div className="flex items-center mb-2">
        <span className="font-semibold text-gray-900 dark:text-white">{post.user}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{post.content}</p>
      {imageSource && (
        <img
          src={imageSource}
          alt={post.content}
          className="w-full h-48 object-cover rounded mb-2"
          onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found')}
        />
      )}
      {post.video && (
        <div className="w-full mb-2">
          <iframe
            src={post.video}
            title={post.content}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-48"
          ></iframe>
        </div>
      )}
      <div className="flex space-x-4 mb-2">
        <button
          onClick={() => onUpvote(post.id)}
          className="text-green-500 hover:text-green-700"
        >
          ↑ {post.upvotes}
        </button>
        <button
          onClick={() => onDownvote(post.id)}
          className="text-red-500 hover:text-red-700"
        >
          ↓ {post.downvotes}
        </button>
      </div>
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-blue-500 hover:text-blue-700 mb-2"
      >
        {showComments ? 'Hide Comments' : `Comments (${post.comments.length})`}
      </button>
      {showComments && (
        <div className="mt-2">
          {post.comments.map((comment, index) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {comment}
            </p>
          ))}
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Add a comment..."
            />
            <button
              onClick={() => {
                if (commentText.trim()) {
                  onAddComment(post.id, commentText);
                  setCommentText('');
                }
              }}
              className="px-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommunityPostCard;