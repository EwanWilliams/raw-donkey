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
                  {currentRecipes.map((recipe) => (
                      <div
                          key={recipe._id}
                          className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
                      >
                          {recipe.recipe_img && recipe.recipe_img.data ? (
                              <img
                                  src={`data:${recipe.recipe_img.contentType};base64,${recipe.recipe_img.data}`}
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
                  ))}
              </div>
          )}


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
