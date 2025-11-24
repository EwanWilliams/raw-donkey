import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageSize, setPageSize] = useState(() => {
    // Load saved selection or default to 6
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
        throw new Error("Database connection issue");
      }
      const data = await response.json();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes when component mounts or when page/pageSize changes
  useEffect(() => {
    fetchRecipes(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  // Persist selection
  useEffect(() => {
    localStorage.setItem("pageSize", pageSize);
  }, [pageSize]);

  const currentRecipes = recipes;

  return (
    <div className="browse-page">
      {/* Header */}
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
            data-test="page-size-selector"
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </div>

              {/* Title — perfectly centered */}
              <h1 className="text-4xl font-bold text-gray-800 text-center">
                  Browse Recipes
              </h1>
          </div>

      {/* States: loading / error / empty / list */}
      {loading ? (
        <div className="browse-message">
          <p className="browse-message-text">Loading recipes...</p>
        </div>
      ) : error ? (
        <div className="browse-message">
          <p className="browse-message-error">Error: {error}</p>
          <button
            onClick={() => fetchRecipes(currentPage, pageSize)}
            className="browse-retry-button"
          >
            Retry
          </button>
        </div>
      ) : currentRecipes.length === 0 ? (
        <div className="browse-message">
          <p className="browse-message-text">No recipes found.</p>
        </div>
      ) : (
        <div className="browse-grid">
          {currentRecipes.map((recipe) => {
            // Convert Buffer to base64 string if needed
            let imageSrc = null;
            if (recipe.recipe_img?.data) {
              if (
                recipe.recipe_img.data.type === "Buffer" &&
                recipe.recipe_img.data.data
              ) {
                const uint8Array = new Uint8Array(
                  recipe.recipe_img.data.data
                );
                let binaryString = "";
                const chunkSize = 8192;
                for (let i = 0; i < uint8Array.length; i += chunkSize) {
                  const chunk = uint8Array.slice(i, i + chunkSize);
                  binaryString += String.fromCharCode(...chunk);
                }
                const base64String = btoa(binaryString);
                imageSrc = `data:${recipe.recipe_img.contentType};base64,${base64String}`;
              } else if (typeof recipe.recipe_img.data === "string") {
                imageSrc = `data:${recipe.recipe_img.contentType};base64,${recipe.recipe_img.data}`;
              }
            }

            return (
              <div key={recipe._id} className="recipe-card">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={recipe.title}
                    className="recipe-img"
                  />
                ) : (
                  <div className="recipe-img-placeholder">
                    <span className="recipe-img-placeholder-text">
                      No Image
                    </span>
                  </div>
                )}
                <div className="recipe-body">
                  <Link
                    to={`/recipe/${recipe._id}`}
                    className="recipe-link"
                  >
                    {recipe.title}
                  </Link>
                  <p className="recipe-desc">{recipe.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* Pagination */}
      {!loading && !error && (
        <div className="browse-pagination">
          <button
            data-test="previous-page-button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="page-button"
          >
            Previous
          </button>
          <span className="page-info">Page {currentPage}</span>
          <button
            data-test="next-page-button"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentRecipes.length < pageSize}
            className="page-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
        
        
  );
}
