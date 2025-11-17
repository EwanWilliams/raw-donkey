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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Recipe Details
        </h1>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Loading recipe...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : recipe ? (
          <section className="grid gap-6 md:grid-cols-3">
            {/* Left: Recipe Image */}
            <div className="md:col-span-1 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {getImageSrc(recipe.recipe_img) ? (
                <img
                  src={getImageSrc(recipe.recipe_img)}
                  alt={recipe.title}
                  className="w-full h-72 md:h-[22rem] object-cover"
                />
              ) : (
                <div className="w-full h-72 md:h-[22rem] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>

            {/* Right: Ingredients */}
            <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {recipe.title}
              </h2>
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Recipe Ingredients
              </h3>
              {recipe.ingredients?.length ? (
                <ul className="list-disc list-inside space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">
                      <span className="font-medium">{ingredient.item}</span>
                      {" — "}
                      {ingredient.quantity} {ingredient.unit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No ingredients listed.</p>
              )}
            </div>

            {/* Bottom: Method / Steps (full width) */}
            <div className="md:col-span-3 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Recipe Method / Steps
              </h3>
              {recipe.instructions?.length ? (
                <ol className="list-decimal list-inside space-y-3">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="text-gray-700 leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-600">No instructions provided.</p>
              )}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600">Recipe not found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
