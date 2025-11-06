import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Browse() {
  const recipes = [
    { id: 1, title: "Mango Smoothie", image: "" },
    { id: 2, title: "Veggie Tacos", image: "" },
    { id: 3, title: "Chocolate Cake", image: "" },
    { id: 4, title: "Spaghetti Carbonara", image: "" },
    { id: 5, title: "Steak and Chips", image: "" },
    { id: 6, title: "Vodka Pasta", image: "" },
    { id: 7, title: "Lemon Cake", image: "" },
    { id: 8, title: "Pesto Pasta", image: "" },
    { id: 9, title: "Pork Chop", image: "" },
  ];

  const [pageSize, setPageSize] = useState(() => {
    return Number(localStorage.getItem("pageSize")) || 6;
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("pageSize", pageSize);
  }, [pageSize]);

  const totalPages = Math.ceil(recipes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentRecipes = recipes.slice(startIndex, startIndex + pageSize);

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

            <div className="recipe-body">
              <Link to={`/recipe/${recipe.id}`} className="recipe-link">
                {recipe.title}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="browse-pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="page-button"
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
