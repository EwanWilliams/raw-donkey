import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { formatIngredient } from "../utils/units"; // as we discussed before

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [measurementSystem, setMeasurementSystem] = useState("metric"); // 👈 NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load recipe + user settings (two separate effects for clarity)
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/recipe/${id}`);
        if (!response.ok) throw new Error("Failed to fetch recipe details");
        const data = await response.json();
        setRecipe(data[0]); // API returns an array
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching recipe details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeDetails();
  }, [id]);

  // 👇 NEW: fetch user unit preference (same as Settings)
  useEffect(() => {
    fetch("/api/user/details", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.unit_pref) {
          setMeasurementSystem(data.unit_pref); // "metric" | "imperial"
        }
      })
      .catch((err) => {
        console.error("Error loading user details:", err);
      });
  }, []);

  // Convert image buffer to displayable format
  const getImageSrc = (recipeImg) => {
    if (!recipeImg?.data) return null;

    if (recipeImg.data.type === "Buffer" && recipeImg.data.data) {
      const uint8Array = new Uint8Array(recipeImg.data.data);
      let binaryString = "";
      const chunkSize = 8192;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize);
        binaryString += String.fromCharCode(...chunk);
      }
      const base64String = btoa(binaryString);
      return `data:${recipeImg.contentType};base64,${base64String}`;
    } else if (typeof recipeImg.data === "string") {
      return `data:${recipeImg.contentType};base64,${recipeImg.data}`;
    }
    return null;
  };

  // Simple placeholder formatter until you plug in real conversions
  const formatIngredient = (ingredient, unitSystem) => {
    // Here you can implement the real metric/imperial conversion.
    // For now we just return what’s stored, or fake a conversion as needed.
    const { quantity, unit } = ingredient;

    // Example: if DB stores metric, convert on the fly for imperial:
    if (unitSystem === "imperial") {
      if (unit === "g") {
        const oz = quantity * 0.0352739619;
        return { quantity: oz.toFixed(1), unit: "oz" };
      }
      if (unit === "ml") {
        const cups = quantity / 240;
        return { quantity: cups.toFixed(1), unit: "cups" };
      }
    }

    // metric or unknown: just return as-is
    return { quantity, unit };
  };

  return (
    <main className="create-page">
      <section className="recipe-details-card">
        <header className="create-header recipe-details-header">
          {recipe && (
            <h1 className="create-main-title">
              {recipe.title}
            </h1>
          )}
        </header>

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
                  <span className="settings-badge">
                    ({measurementSystem === "metric" ? "Metric" : "Imperial"})
                  </span>
                </h2>

                {recipe.ingredients?.length ? (
                  <ul className="recipe-details-list">
                    {recipe.ingredients.map((ing, idx) => {
                      const { quantity, unit } = formatIngredient(
                        ing,
                        measurementSystem
                      );

                      return (
                        <li key={idx} className="recipe-details-list-item">
                          <strong>{ing.item}</strong> — {quantity} {unit}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="recipe-details-help">
                    No ingredients listed.
                  </p>
                )}
              </div>
            </section>

            {/* METHOD */}
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
