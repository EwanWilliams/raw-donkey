import React, { useState } from "react";

export default function Browse() {
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data
  const recipes = [
    { id: 1, title: "Mango Smoothie" },
    { id: 2, title: "Veggie Tacos" },
    { id: 3, title: "Chocolate Cake" },
    { id: 4, title: "Spaghetti Carbonara" },
    { id: 5, title: "Avocado Toast" },
    { id: 6, title: "Chicken Curry" },
    { id: 7, title: "Salmon Bowl" },
    { id: 8, title: "Caesar Salad" },
    { id: 9, title: "Pancakes" },
    { id: 10, title: "Burrito Bowl" },
    { id: 11, title: "Beef Stir Fry" },
    { id: 12, title: "Greek Yogurt Parfait" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(recipes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecipes = recipes.slice(startIndex, startIndex + pageSize);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container py-5">

      {/* ---------------- Header Section ---------------- */}
      <div className="position-relative text-center mb-5">
        {/* Centered title */}
        <h1 className="text-4xl fw-bold text-gray-800 mb-0">
          Browse Recipes
        </h1>

        {/* Selector pinned neatly to the left */}
        <div className="position-absolute top-50 start-0 translate-middle-y ms-4 d-flex align-items-center gap-2">
          <label htmlFor="pageSize" className="text-gray-700 fw-medium mb-0">
            Recipes per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="form-select form-select-sm w-auto"
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </div>
      </div>

      {/* ---------------- Recipe Grid ---------------- */}
      <div className="row g-4">
        {paginatedRecipes.map((recipe) => (
          <div key={recipe.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 text-center shadow-sm border-0 p-3">
              <div
                className="bg-light rounded-3 d-flex justify-content-center align-items-center"
                style={{ height: "180px" }}
              >
                <span className="text-muted">No image</span>
              </div>
              <h5 className="mt-3 text-blue-600">{recipe.title}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Pagination Controls ---------------- */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="btn btn-outline-primary rounded-pill px-4"
        >
          ← Previous
        </button>

        <span className="fw-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="btn btn-outline-primary rounded-pill px-4"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
