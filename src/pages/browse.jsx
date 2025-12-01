import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecipes = async (page, size) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recipe/list/${page}/${size}`);
      if (!response.ok) throw new Error("Database connection issue");
      const data = await response.json();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(currentPage, pageSize); }, [currentPage, pageSize])

  const currentRecipes = recipes;

  return (
    <div className="browse-page">
      {/* header */}
      <div className="browse-header">
        <div className="browse-header-left">
          <label htmlFor="pageSize" className="browse-label">Recipes per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="browse-select"
            data-test="page-size-selector"
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </div>

        <h1 className="browse-title">Browse Recipes</h1>
      </div>

      {/* states */}
      {loading && (
        <div className="browse-message"><p className="browse-message-text">Loading recipes...</p></div>
      )}

      {!loading && error && (
        <div className="browse-message">
          <p className="browse-message-error">Error: {error}</p>
          <button className="browse-retry-button" onClick={() => fetchRecipes(currentPage, pageSize)}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {currentRecipes.length === 0 ? (
            <div className="browse-message"><p className="browse-message-text">No recipes found.</p></div>
          ) : (
            <div className="browse-grid">
              {currentRecipes.map((recipe) => {
                // build image src (same logic as before)
                let imageSrc = null;
                if (recipe.recipe_img?.data) {
                  if (recipe.recipe_img.data.type === "Buffer" && recipe.recipe_img.data.data) {
                    const uint8Array = new Uint8Array(recipe.recipe_img.data.data);
                    let binary = "";
                    const chunk = 8192;
                    for (let i = 0; i < uint8Array.length; i += chunk) {
                      binary += String.fromCharCode(...uint8Array.slice(i, i + chunk));
                    }
                    imageSrc = `data:${recipe.recipe_img.contentType};base64,${btoa(binary)}`;
                  } else if (typeof recipe.recipe_img.data === "string") {
                    imageSrc = `data:${recipe.recipe_img.contentType};base64,${recipe.recipe_img.data}`;
                  }
                }

                return (
                  <div key={recipe._id} className="recipe-card">
                    {imageSrc ? (
                      <img src={imageSrc} alt={recipe.title} className="recipe-img" />
                    ) : (
                      <div className="recipe-img-placeholder">
                        <span className="recipe-img-placeholder-text">No image</span>
                      </div>
                    )}

                    <div className="recipe-body">
                      <Link to={`/recipe/${recipe._id}`} className="recipe-link">
                        {recipe.title}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* pagination */}
          <div className="browse-pagination" style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
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
        </>
      )}
    </div>
  );
}

