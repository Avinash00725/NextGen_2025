import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="relative">
          <RecipeCard {...recipe} />
          <button
            onClick={() => onDelete(recipe.id)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            title="Delete Recipe"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;