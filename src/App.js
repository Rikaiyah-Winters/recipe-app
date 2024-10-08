import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import RecipeFull from "./components/RecipeFull";
import RecipeExcerpt from "./components/RecipeExcerpt"
import NewRecipeForm from "./components/NewRecipeForm";
import displayToast from "./helpers/toastHelper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [searchTerm, setSearchTerm] = useState("");

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
          displayToast("Couldn't fetch recipes.", "error")
        }
      } catch (e) {
        displayToast("An error occured during the request. Please try again later", "error")
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
        displayToast("Recipe added sucessfully!", "success");
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
        displayToast("Couldn't fetch recipes.", "error")
      }
    } catch (e) {
        displayToast("An error occured during the request", "error")
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
        displayToast("Recipe updated sucessfully!", "success");
      } else {
        displayToast("Couldn't update recipes.", "error")
      }
    } catch (e) {
      displayToast("An error occured during the request", "error")
    }
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {method: "DELETE"});
      if (response.ok) {
        setRecipes(recipes.filter((recipe) => (recipe.id !== recipeId)))
        setSelectedRecipe(null);
        displayToast("Recipe was deleted successfully!", "success");
      } else {
        displayToast("Oops - could not delete recipe.", "error");
      }
    } catch (e) {
      displayToast("Something went wrong during the request", "error");
    }
  }
  
  const updateSearchTerm = (text) => {
    setSearchTerm(text);
  }

  const handleSearch = () => {
    //filters through the existing recipes
    const searchResults = recipes.filter((recipe) => {
      //array with the values of each recipe we want to search through
      const valuesToSearch = [recipe.title, recipe.ingredients, recipe.description];
      //returns TRUE or FALSE if the value (title, ingredients, description) contain the search term
      return valuesToSearch.some(value => value.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    //if any of the values (title, ingredients, desciprion) DO contain the searchTerm, then that recipe will be part of the searchResults
    return searchResults;
  }

  //if there is a search term then the handleSearch function will be triggered (resulting in searchResults) otherwise all recipes will show
  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  const displayAllRecipes = () => {
    updateSearchTerm("");
    handleUnselectRecipe();
    hideRecipeForm();
  }

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} 
      searchTerm={searchTerm} 
      updateSearchTerm={updateSearchTerm} 
      displayAllRecipes={displayAllRecipes}
      />
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
        {displayedRecipes.map((recipe) => (
          <RecipeExcerpt
            key={recipe.id}
            recipe={recipe}
            handleSelectRecipe={handleSelectRecipe} />
        ))}
      </div>)}
      <ToastContainer />
    </div>
  );
}

export default App;
