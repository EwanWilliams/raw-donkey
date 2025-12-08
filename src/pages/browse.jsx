import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set());
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);

  const [likedRecipes, setLikedRecipes] = useState([]);

  /* -----------------------------
     NEW STATE ADDED (ONLY CHANGE)
  ------------------------------ */
  const [nextDisabled, setNextDisabled] = useState(false);

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

  useEffect(() => {
    if (!showLikedOnly) {
      fetchRecipes(currentPage, pageSize);
    }
  }, [currentPage, pageSize, showLikedOnly]);

  useEffect(() => {
    const initLikes = async () => {
      try {
        setLikesLoading(true);
        const res = await fetch("/api/user/likes", { credentials: "include" });

        if (res.status === 401) {
          setIsUserLoggedIn(false);
          setLikedIds(new Set());
          return;
        }

        if (!res.ok) return;

        const data = await res.json();
        setIsUserLoggedIn(true);
        setLikedIds(new Set((data.likes || []).map((id) => String(id))));
      } catch (err) {
        console.error("Error loading likes:", err);
      } finally {
        setLikesLoading(false);
      }
    };

    initLikes();
  }, []);

  const fetchLikedRecipes = async () => {
    try {
      setLikesLoading(true);
      const res = await fetch("/api/recipe/liked", {
        credentials: "include",
      });

      if (res.status === 401) {
        setIsUserLoggedIn(false);
        setLikedRecipes([]);
        return;
      }

      const data = await res.json();
      setLikedRecipes(data);
    } catch (err) {
      console.error("Error loading liked recipes:", err);
    } finally {
      setLikesLoading(false);
    }
  };

  const isLiked = (id) => likedIds.has(String(id));

  const handleToggleLike = async (recipeId) => {
    if (!isUserLoggedIn) {
      alert("Log in to like recipes.");
      return;
    }

    const idStr = String(recipeId);
    const currentlyLiked = likedIds.has(idStr);

    setLikedIds((prev) => {
      const next = new Set(prev);
      if (currentlyLiked) next.delete(idStr);
      else next.add(idStr);
      return next;
    });

    if (showLikedOnly && currentlyLiked) {
      setLikedRecipes((prev) => prev.filter((r) => String(r._id) !== idStr));
    }

    try {
      const method = currentlyLiked ? "DELETE" : "POST";
      await fetch(`/api/recipe/${idStr}/like`, {
        method,
        credentials: "include",
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleToggleShowLiked = () => {
    if (!showLikedOnly) {
      fetchLikedRecipes();
      setCurrentPage(1);
    }
    setShowLikedOnly((prev) => !prev);
  };

  const currentRecipes =
    showLikedOnly && isUserLoggedIn ? likedRecipes : recipes;

  /* -------------------------------------------
     NEW: CHECK IF NEXT PAGE HAS ANY RECIPES
  --------------------------------------------*/
  const checkNextPage = async (nextPage, size) => {
    const res = await fetch(`/api/recipe/list/${nextPage}/${size}`);

    if (!res.ok) return false;

    const data = await res.json();

    // If backend returns array
    if (Array.isArray(data)) return data.length > 0;

    return (data.recipes || []).length > 0;
  };

  /* -----------------------------
     NEW: RESET DISABLED STATE
  ------------------------------ */
  useEffect(() => {
    setNextDisabled(false);
  }, [currentPage, pageSize]);

  useEffect(() => {
  setNextDisabled(recipes.length < pageSize);
}, [recipes, pageSize]);


  return (
    <div className="browse-page">
      {/* HEADER */}
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
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </div>

        <h1 className="browse-title">Browse Recipes</h1>

        <div className="browse-header-right">
          {isUserLoggedIn && (
            <button
              type="button"
              className="liked-toggle-button"
              onClick={handleToggleShowLiked}
            >
              {showLikedOnly ? "Show All Recipes" : "Show My Liked Recipes"}
            </button>
          )}
        </div>
      </div>

      {/* STATES */}
      {loading && !showLikedOnly && (
        <p className="browse-message-text">Loading recipes...</p>
      )}

      {error && <p className="browse-message-error">Error: {error}</p>}

      {/* GRID */}
      <div className="browse-grid">
        {currentRecipes.map((recipe) => {
          let imageSrc = null;

          if (recipe.recipe_img?.data) {
            if (
              recipe.recipe_img.data.type === "Buffer" &&
              recipe.recipe_img.data.data
            ) {
              const uint8Array = new Uint8Array(recipe.recipe_img.data.data);
              let binary = "";
              const chunk = 8192;
              for (let i = 0; i < uint8Array.length; i += chunk) {
                binary += String.fromCharCode(
                  ...uint8Array.slice(i, i + chunk)
                );
              }
              imageSrc = `data:${recipe.recipe_img.contentType};base64,${btoa(
                binary
              )}`;
            }
          }

          return (
            <div key={recipe._id} className="recipe-card">
              {imageSrc ? (
                <img src={imageSrc} alt={recipe.title} className="recipe-img" />
              ) : (
                <div className="recipe-img-placeholder">
                  <span className="recipe-img-placeholder-text">
                    No image
                  </span>
                </div>
              )}

              <div className="recipe-body">
                <Link to={`/recipe/${recipe._id}`} className="recipe-link">
                  {recipe.title}
                </Link>

                {isUserLoggedIn && (
                  <button
                    type="button"
                    onClick={() => handleToggleLike(recipe._id)}
                    className={`like-button ${
                      isLiked(recipe._id) ? "like-button--active" : ""
                    }`}
                  >
                    {isLiked(recipe._id) ? "♥ Liked" : "♡ Like"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {!showLikedOnly && (
        <div className="browse-pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-button"
          >
            Previous
          </button>

          <span className="page-info">Page {currentPage}</span>

          <button
  onClick={async () => {
    const nextPage = currentPage + 1;
    const ok = await checkNextPage(nextPage, pageSize);

    if (ok) {
      setCurrentPage(nextPage);
    } else {
      setNextDisabled(true); // disable if empty page
    }
  }}
  disabled={nextDisabled}
  className="page-button"
>
  Next
</button>

        </div>
      )}
    </div>
  );
}
