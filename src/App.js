import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import RecipeFull from "./components/RecipeFull";
import RecipeExcerpt from "./components/RecipeExcerpt"
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  })
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  };

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  };

  const onUpdateForm = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok) {
          const recipesData = await response.json();
          setRecipes(recipesData)
        } else {
          console.log("Couldn't fetch recipes.")
        }
      } catch (e) {
        console.error("An error occured during the request", e)
        console.log("An unexpected error occured. Please try again later.")
      }
    };

    fetchAllRecipes();
  }, [])

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} />
      {showNewRecipeForm && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} />}
      {selectedRecipe && <RecipeFull
        selectedRecipe={selectedRecipe}
        handleUnselectRecipe={handleUnselectRecipe} />}
      {!selectedRecipe && (<div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeExcerpt
            key={recipe.id}
            recipe={recipe}
            handleSelectRecipe={handleSelectRecipe} />
        ))}
      </div>)}
    </div>
  );
}

export default App;
