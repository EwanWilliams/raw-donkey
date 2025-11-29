import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/recipe/${id}`);
        if (!response.ok) throw new Error("Failed to fetch recipe details");

        const data = await response.json();
        setRecipe(data[0] || null);
        setError(null);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  // Convert image buffer → base64
  const getImageSrc = (recipeImg) => {
    if (!recipeImg?.data) return null;

    if (recipeImg.data.type === "Buffer" && recipeImg.data.data) {
      const uint8 = new Uint8Array(recipeImg.data.data);
      let str = "";
      const chunkSize = 8192;
      for (let i = 0; i < uint8.length; i += chunkSize) {
        const chunk = uint8.slice(i, i + chunkSize);
        str += String.fromCharCode(...chunk);
      }
      return `data:${recipeImg.contentType};base64,${btoa(str)}`;
    } else if (typeof recipeImg.data === "string") {
      return `data:${recipeImg.contentType};base64,${recipeImg.data}`;
    }
    return null;
  };

  return (
    <main className="create-page">
      <section className="recipe-details-card">
        {/* Header like the Figma: centered title */}
        <header className="create-header recipe-details-header">
          <h1 className="create-main-title">Recipe Details</h1>
        </header>

        {/* STATES */}
        {loading ? (
          <div className="browse-message">
            <p className="browse-message-text">Loading recipe...</p>
          </div>
        ) : error ? (
          <div className="browse-message">
            <p className="browse-message-error">Error: {error}</p>
          </div>
        ) : !recipe ? (
          <div className="browse-message">
            <p className="browse-message-text">Recipe not found.</p>
          </div>
        ) : (
          <>
            {/* TOP ROW: Image + Ingredients */}
            <section className="recipe-details-layout">
              {/* LEFT: IMAGE PANEL */}
              <div className="recipe-details-panel recipe-details-panel--image">
                {getImageSrc(recipe.recipe_img) ? (
                  <img
                    src={getImageSrc(recipe.recipe_img)}
                    alt={recipe.title}
                    className="recipe-details-image"
                  />
                ) : (
                  <div className="recipe-details-image-placeholder">
                    Recipe Image
                  </div>
                )}
              </div>

              {/* RIGHT: INGREDIENTS PANEL */}
              <div className="recipe-details-panel recipe-details-panel--ingredients">
                <h2 className="recipe-details-panel-title">
                  Recipe Ingredients
                </h2>

                {recipe.ingredients?.length ? (
                  <ul className="recipe-details-list">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="recipe-details-list-item">
                        <strong>{ing.item}</strong> — {ing.quantity}{" "}
                        {ing.unit}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="recipe-details-help">
                    No ingredients listed.
                  </p>
                )}
              </div>
            </section>

            {/* BOTTOM: METHOD / STEPS FULL WIDTH */}
            <section className="recipe-details-panel recipe-details-panel--method">
              <h2 className="recipe-details-panel-title">
                Recipe Method / Steps
              </h2>

              {recipe.instructions?.length ? (
                <ol className="recipe-details-list">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="recipe-details-list-item">
                      {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="recipe-details-help">
                  No instructions provided.
                </p>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
