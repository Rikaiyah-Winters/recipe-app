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

  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({ ...selectedRecipe, [name]: value })
    } else if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    };

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

  //wouldn't use useEffect here since this funciton will only trigger when it's called, not every time the page loads
  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });
      if (response.ok) {
        const recipesData = await response.json();
        setRecipes([...recipes, recipesData.recipe]);
        console.log("Recipe added sucessfully!");
        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        });
      } else {
        console.error("Couldn't fetch recipes.")
      }
    } catch (e) {
      console.error("An error occured during the request", e)
    }
  };

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();
    const { id } = selectedRecipe;
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });
      if (response.ok) {
        const recipesData = await response.json();
        setRecipes(recipes.map((recipe) => {
          if (recipe.id === id) {
            return recipesData.recipe //returns the edited recipe after it updated in the server
          }
          return recipe
        }));
        console.log("Recipe updated sucessfully!");
      } else {
        console.error("Couldn't update recipes.")
      }
    } catch (e) {
      console.error("An error occured during the request", e)
    }
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {method: "DELETE"});
      if (response.ok) {
        setRecipes(recipes.filter((recipe) => (recipe.id !== recipeId)))
        setSelectedRecipe(null);
        console.log("Recipe was deleted successfully!");
      } else {
        console.else("Oops - could not delete recipe.");
      }
    } catch (e) {
      console.error("Something went wrong during the request:", e);
    }
  }

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} />
      {showNewRecipeForm &&
        <NewRecipeForm newRecipe={newRecipe}
          hideRecipeForm={hideRecipeForm}
          onUpdateForm={onUpdateForm}
          handleNewRecipe={handleNewRecipe} />}

      {selectedRecipe && <RecipeFull
        selectedRecipe={selectedRecipe}
        handleUnselectRecipe={handleUnselectRecipe}
        onUpdateForm={onUpdateForm}
        handleUpdateRecipe={handleUpdateRecipe}
        handleDeleteRecipe={handleDeleteRecipe} />}
      {!selectedRecipe && !showNewRecipeForm && (<div className="recipe-list">
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
