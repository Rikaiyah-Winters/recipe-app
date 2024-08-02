import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import RecipeFull from "./components/RecipeFull";
import RecipeExcerpt from "./components/RecipeExcerpt"
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
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
      <Header />
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
