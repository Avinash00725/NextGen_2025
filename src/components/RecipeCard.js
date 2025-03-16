import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import images from src/assets/
import TacoImage from '../assets/taco.png';
import PastaImage from '../assets/pasta.png';
import CakeImage from '../assets/cake.png';
import BiryaniImage from '../assets/biryani.jpg';
import IcecreamImage from '../assets/icecream.jpg';
import PulavImage from '../assets/pulav.png';

const RecipeCard = ({ id, title, image, imageUrl, likes, prepTime, ingredients, procedure, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageMap = {
    'taco.png': TacoImage,
    'pasta.png': PastaImage,
    'cake.png': CakeImage,
    'biryani.jpg': BiryaniImage,
    'icecream.jpg': IcecreamImage,
    'pulav.png': PulavImage,
  };

  const imageSource = imageUrl || imageMap[image] || 'https://via.placeholder.com/300x200?text=Recipe+Image';

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
        onClick={() => setIsModalOpen(true)}
        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md w-full h-[300px] flex flex-col cursor-pointer relative"
      >
        <img
          src={imageSource}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Recipe+Image';
          }}
        />
        <div className="p-3 bg-gray-800 text-white flex-1 flex flex-col justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-300">Prep Time: {prepTime}</p>
          <p className="text-sm text-gray-300">Likes: {likes}</p>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id); // Now id is defined
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            title="Delete Recipe"
          >
            ✕
          </button>
        )}
      </motion.div>

      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <img src={imageSource} alt={title} className="w-full h-48 object-cover rounded mb-4" />
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Prep Time:</strong> {prepTime}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Likes:</strong> {likes}</p>
            {ingredients && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Ingredients</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{ingredients}</p>
              </div>
            )}
            {procedure && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Procedure</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{procedure}</p>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default RecipeCard;