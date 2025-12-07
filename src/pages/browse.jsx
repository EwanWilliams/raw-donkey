import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔐 likes-related state
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set());
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);

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

  // fetch paginated recipes
  useEffect(() => {
    fetchRecipes(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // 🔐 check login *and* load likes using your existing backend behaviour
  useEffect(() => {
    const initLikes = async () => {
      try {
        setLikesLoading(true);
        const res = await fetch("/api/user/likes", { credentials: "include" });

        if (res.status === 401) {
          // not logged in
          setIsUserLoggedIn(false);
          setLikedIds(new Set());
          return;
        }

        if (!res.ok) {
          console.error("Failed to load likes");
          return;
        }

        const data = await res.json(); // { likes: [...] }
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

  const isLiked = (id) => likedIds.has(String(id));

  const handleToggleLike = async (recipeId) => {
    if (!isUserLoggedIn) {
      alert("Log in to like recipes.");
      return;
    }

    const idStr = String(recipeId);
    const currentlyLiked = likedIds.has(idStr);

    // optimistic UI update
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (currentlyLiked) next.delete(idStr);
      else next.add(idStr);
      return next;
    });

    try {
      const method = currentlyLiked ? "DELETE" : "POST";
      const res = await fetch(`/api/recipe/${idStr}/like`, {
        method,
        credentials: "include",
      });

      if (!res.ok) {
        // revert if server rejects
        setLikedIds((prev) => {
          const next = new Set(prev);
          if (currentlyLiked) next.add(idStr);
          else next.delete(idStr);
          return next;
        });
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      // revert on error
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (currentlyLiked) next.add(idStr);
        else next.delete(idStr);
        return next;
      });
    }
  };

  const handleToggleShowLiked = () => {
    setShowLikedOnly((prev) => !prev);
  };

  // base list = recipes from current page
  const pagedRecipes = recipes;
  const currentRecipes =
    showLikedOnly && isUserLoggedIn
      ? pagedRecipes.filter((r) => isLiked(r._id))
      : pagedRecipes;

  return (
    <div className="browse-page">
      {/* header */}
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
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </div>

        <h1 className="browse-title">Browse Recipes</h1>

        {/* ❤️ My liked recipes toggle (logged-in only) */}
        {isUserLoggedIn && (
          <button
            type="button"
            onClick={handleToggleShowLiked}
            className="rd-btn rd-btn-outline"
          >
            {showLikedOnly ? "Show All Recipes" : "Show My Liked Recipes"}
          </button>
        )}
      </div>

      {/* states */}
      {loading && (
        <div className="browse-message">
          <p className="browse-message-text">Loading recipes...</p>
        </div>
      )}

      {!loading && error && (
        <div className="browse-message">
          <p className="browse-message-error">Error: {error}</p>
          <button
            className="browse-retry-button"
            onClick={() => fetchRecipes(currentPage, pageSize)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {likesLoading && isUserLoggedIn && (
            <div className="browse-message">
              <p className="browse-message-text">Loading your likes...</p>
            </div>
          )}

          {currentRecipes.length === 0 ? (
            <div className="browse-message">
              <p className="browse-message-text">
                {showLikedOnly
                  ? "You haven't liked any recipes on this page yet."
                  : "No recipes found."}
              </p>
            </div>
          ) : (
            <div className="browse-grid" data-test="recipe-grid">
              {currentRecipes.map((recipe) => {
                // build image src (same logic as before)
                let imageSrc = null;
                if (recipe.recipe_img?.data) {
                  if (
                    recipe.recipe_img.data.type === "Buffer" &&
                    recipe.recipe_img.data.data
                  ) {
                    const uint8Array = new Uint8Array(
                      recipe.recipe_img.data.data
                    );
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
                          No image
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

                      {/* ❤️ Like button (logged-in only) */}
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
          )}

          {/* pagination */}
          <div
            className="browse-pagination"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              data-test="previous-page-button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="page-button"
            >
              Previous
            </button>
            <span
              className="page-info"
              data-test="current-page-display"
            >
              Page {currentPage}
            </span>
            <button
              data-test="next-page-button"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={pagedRecipes.length < pageSize}
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
