import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Browse() {
  const recipes = [
    { id: 1, title: "Mango Smoothie", image: "data:image/jpeg;base64,..."},
    { id: 2, title: "Veggie Tacos", image: "data:image/jpeg;base64,..."},
    { id: 3, title: "Chocolate Cake", image: "data:image/jpeg;base64,..."},
  ];

  const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(recipes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentRecipes = recipes.slice(startIndex, startIndex + pageSize);

  return (
      <div className="p-6">
        <div className="relative flex items-center justify-center mb-8">
          {/* Page selector — pinned to far left */}
          <div className="absolute left-0 flex items-center gap-2 ml-6">
            <label htmlFor="pageSize" className="text-gray-700 font-medium">
              Recipes per page:
            </label>
            <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-700"
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


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecipes.map((recipe) => (
              <div
                  key={recipe.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {recipe.title}
                  </h2>
                  <Link
                      to={`/recipe/${recipe.id}`}
                      className="text-blue-600 hover:underline text-sm"
                  >
                    View Recipe →
                  </Link>
                </div>
              </div>
          ))}
        </div>

        {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-3">
              <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
              <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
        )}
      </div>
  );
}
