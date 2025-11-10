import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageSize, setPageSize] = useState(() => {
    return Number(localStorage.getItem("pageSize")) || 6;
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch recipes from database
  const fetchRecipes = async (page, size) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recipe/list/${page}/${size}`);
      if (!response.ok) {
        // If API fails display specific message
        throw new Error('Database connection issue');
      }
      const data = await response.json();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes when component mounts or when page/pageSize changes
  useEffect(() => {
    fetchRecipes(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // --- persist selection ---
  useEffect(() => {
    localStorage.setItem("pageSize", pageSize);
  }, [pageSize]);

  // Use the current recipes directly
  const currentRecipes = recipes;

  return (
    <div className="browse-page">
      <div className="browse-header">
        <div className="browse-header-left">
          <label htmlFor="pageSize" className="browse-label">
            Recipes per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="browse-select"
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </div>

        <h1 className="browse-title">Browse Recipes</h1>
      </div>

      <div className="browse-grid">
        {currentRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.title} className="recipe-img" />
            ) : (
              <div className="recipe-placeholder">No image</div>
            )}

          {loading ? (
              <div className="text-center py-8">
                  <p className="text-gray-600">Loading recipes...</p>
              </div>
          ) : error ? (
              <div className="text-center py-8">
                  <p className="text-red-600">Error: {error}</p>
                  <button 
                      onClick={() => fetchRecipes(currentPage, pageSize)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                      Retry
                  </button>
              </div>
          ) : currentRecipes.length === 0 ? (
              <div className="text-center py-8">
                  <p className="text-gray-600">No recipes found.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentRecipes.map((recipe) => {
                      // Convert Buffer to base64 string if needed
                      let imageSrc = null;
                      if (recipe.recipe_img?.data) {
                          if (recipe.recipe_img.data.type === 'Buffer' && recipe.recipe_img.data.data) {
                              // Buffer was serialized as {type: 'Buffer', data: [array of bytes]}
                              // Process in chunks to avoid call stack issues with large images
                              const uint8Array = new Uint8Array(recipe.recipe_img.data.data);
                              let binaryString = '';
                              const chunkSize = 8192; // Process 8KB at a time
                              for (let i = 0; i < uint8Array.length; i += chunkSize) {
                                  const chunk = uint8Array.slice(i, i + chunkSize);
                                  binaryString += String.fromCharCode(...chunk);
                              }
                              const base64String = btoa(binaryString);
                              imageSrc = `data:${recipe.recipe_img.contentType};base64,${base64String}`;
                          } else if (typeof recipe.recipe_img.data === 'string') {
                              // Already a base64 string
                              imageSrc = `data:${recipe.recipe_img.contentType};base64,${recipe.recipe_img.data}`;
                          }
                      }
                      
                      return (
                          <div
                              key={recipe._id}
                              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
                          >
                              {imageSrc ? (
                                  <img
                                      src={imageSrc}
                                      alt={recipe.title}
                                      className="w-full h-48 object-cover"
                                  />
                              ) : (
                                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500">No Image</span>
                                  </div>
                              )}
                          <div className="p-4 text-center">
                              {/* Title now centered and styled */}
                               <Link
                                    to={`/recipe/${recipe._id}`}
                                        className="inline-block text-xl font-bold
                                                    !text-gray-900 visited:!text-gray-900
                                                    no-underline hover:underline hover:!text-blue-600
                                                   underline-offset-2 transition-colors duration-200">
                                    {recipe.title}
                                </Link>
                              <p className="text-gray-600 text-sm">{recipe.desc}</p>
                          </div>
                      </div>
                      );
                  })}
              </div>
          )}

      {totalPages > 1 && (
        <div className="browse-pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="page-button"
          >
            Previous
          </button>

          {!loading && !error && (
              <div className="flex justify-center mt-8 gap-3">
                  <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                      Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                      Page {currentPage}
                  </span>
                  <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentRecipes.length < pageSize}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                      Next
                  </button>
              </div>
          )}
      </div>
  );
}
