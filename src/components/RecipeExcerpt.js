import React from "react";
import { truncateText } from "../helpers/utils";

const RecipeExerpt = ({recipe, handleSelectRecipe}) => {
    return (
        <article className="recipe-card">
            <figure><img src={recipe.image_url} alt={recipe.title} /></figure>
            <h2>{recipe.title}</h2>
            <p className="flex-spacing">Description: {truncateText(recipe.description)}</p>
            <button onClick={() => handleSelectRecipe(recipe)}>View</button>
        </article>
    )
}

export default RecipeExerpt