import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import RecipeList from '../components/RecipeList';
import RecipeForm from '../components/RecipeForm';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import Avatar1 from '../assets/avatars/avatar1.png';

const socket = io('http://localhost:5000');

const UserDashboard = () => {
  const location = useLocation();
  const [user, setUser] = useState({
    name: 'Avinash M.',
    email: 'avinash@example.com',
    postedRecipes: 5,
    likedRecipes: 3,
    avatar: Avatar1,
  });
  const [recipes, setRecipes] = useState([
    { id: 1, title: 'Spicy Tacos', image: 'taco.png', likes: 120, prepTime: '20 mins' },
    { id: 2, title: 'Chicken Biryani', image: 'biryani.jpg', likes: 150, prepTime: '40 mins' },
  ]);
  const [likedRecipes, setLikedRecipes] = useState([
    { id: 3, title: 'Chocolate Cake', image: 'cake.png', likes: 200, prepTime: '45 mins' },
    { id: 4, title: 'Vanilla Ice Cream', image: 'icecream.jpg', likes: 90, prepTime: '15 mins' },
    { id: 5, title: 'Vegetable Pulav', image: 'pulav.png', likes: 110, prepTime: '30 mins' },
  ]);
  const [notifications, setNotifications] = useState([]);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getUserRank = (postedRecipes) => {
    if (postedRecipes >= 16) return 'Legendary Chef';
    if (postedRecipes >= 11) return 'Master Chef';
    if (postedRecipes >= 6) return 'Professional Chef';
    if (postedRecipes >= 1) return 'Pro';
    return 'Beginner';
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUser,
      avatar: updatedUser.avatar || prev.avatar,
    }));
    console.log('Profile updated:', updatedUser);
  };

  const handleAddRecipe = useCallback((newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
    setUser((prev) => ({
      ...prev,
      postedRecipes: prev.postedRecipes + 1,
      rank: getUserRank(prev.postedRecipes + 1),
    }));
    toast.success('Recipe added successfully!');
    console.log('Recipe added:', newRecipe);
  }, [setRecipes, setUser]); // Dependencies for useCallback

  useEffect(() => {
    socket.on('newNotification', (notification) => {
      setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    });
    return () => socket.off('newNotification');
  }, []);

  // Handle new recipe from CreateRecipe page
  useEffect(() => {
    if (location.state?.newRecipe) {
      handleAddRecipe(location.state.newRecipe);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location, handleAddRecipe]);

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      setUser((prev) => ({
        ...prev,
        postedRecipes: prev.postedRecipes - 1,
        rank: getUserRank(prev.postedRecipes - 1),
      }));
      toast.success('Recipe deleted successfully!');
      console.log('Recipe deleted:', recipeId);
    }
  };

  const handleUnlikeRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to unlike this recipe?')) {
      setLikedRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      setUser((prev) => ({ ...prev, likedRecipes: prev.likedRecipes - 1 }));
      toast.success('Recipe unliked successfully!');
      console.log('Recipe unliked:', recipeId);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredLikedRecipes = likedRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar notifications={notifications} />
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <ProfileCard user={{ ...user, rank: getUserRank(user.postedRecipes) }} onUpdate={updateUserProfile} />
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Posted Recipes</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search your recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowRecipeForm(true)}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Recipe
            </button>
            <RecipeList recipes={filteredRecipes} onDelete={handleDeleteRecipe} />
          </section>
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Liked Recipes</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search liked recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            {filteredLikedRecipes.length > 0 ? (
              <RecipeList recipes={filteredLikedRecipes} onDelete={handleUnlikeRecipe} />
            ) : (
              <p className="text-gray-600">You haven’t liked any recipes yet.</p>
            )}
          </section>
        </motion.div>
      </div>
      {showRecipeForm && (
        <RecipeForm
          onClose={() => setShowRecipeForm(false)}
          onAddRecipe={handleAddRecipe}
        />
      )}
    </div>
  );
};

export default UserDashboard;