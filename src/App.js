import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt"
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([])

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
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeExcerpt key={recipe.id} recipe={recipe}/>
        ))}
      </div>
    </div>
      );
}

      export default App;
