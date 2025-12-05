import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* ============================
   Unit conversion table
   ============================ */

const conversionTable = {
  g: { unit: "oz", factor: 0.0352739619 },
  oz: { unit: "g", factor: 28.3495231 },

  kg: { unit: "lb", factor: 2.20462 },
  lb: { unit: "kg", factor: 0.453592 },

  fl_oz: { unit: "ml", factor: 29.5735 },
  ml: { unit: "fl_oz", factor: 1 / 29.5735 },

  l: { unit: "quarts", factor: 1.05669 },
  quarts: { unit: "l", factor: 0.946353 },
};

const METRIC_UNITS = ["g", "kg", "ml", "l"];

const IMPERIAL_UNITS = ["oz", "lb", "cups", "quarts"];

const UNIT_ALIASES = {
  ounce: "oz",
  ounces: "oz",
  oz: "oz",

  pound: "lb",
  pounds: "lb",
  lb: "lb",
  lbs: "lb",

  cup: "cups",
  cups: "cups",

  quart: "quarts",
  quarts: "quarts",

  "fl oz": "fl_oz",
  floz: "fl_oz",
  "fluid ounce": "fl_oz",
  "fluid ounces": "fl_oz",
};

function normalizeUnit(rawUnit) {
  if (!rawUnit) return "";
  const u = String(rawUnit).trim().toLowerCase();
  return UNIT_ALIASES[u] || u;
}

function formatIngredient(ingredient, targetSystem) {
  if (!ingredient) return { quantity: "", unit: "" };

  let { quantity, unit } = ingredient;

  const normalizedUnit = normalizeUnit(unit);

  const num = typeof quantity === "number" ? quantity : parseFloat(quantity);
  if (Number.isNaN(num)) {
    return { quantity, unit: normalizedUnit || unit };
  }

  // Unknown unit → no conversion
  if (!conversionTable[normalizedUnit]) {
    return { quantity: num, unit: normalizedUnit };
  }

  const system = String(targetSystem || "").trim().toLowerCase();
  const wantsMetric = system === "metric";
  const isMetric = METRIC_UNITS.includes(normalizedUnit);

  // Already in preferred system → skip conversion
  if ((isMetric && wantsMetric) || (!isMetric && !wantsMetric)) {
    return { quantity: num, unit: normalizedUnit };
  }

  // Convert
  const { unit: newUnit, factor } = conversionTable[normalizedUnit];
  const newQuantity = num * factor;

  // Rounding rules
  let rounded;
  if (newQuantity < 1) rounded = Number(newQuantity.toFixed(2));
  else if (newQuantity < 10) rounded = Number(newQuantity.toFixed(2));
  else rounded = Number(newQuantity.toFixed(1));

  return {
    quantity: rounded,
    unit: newUnit,
  };
}

/* ============================
   Main component
   ============================ */

export default function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [measurementSystem, setMeasurementSystem] = useState("metric");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  /* --- Fetch recipe data --- */
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
        console.error("Error fetching recipe details:", err);
        setError(err.message || "Failed to fetch recipe details");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  /* --- Fetch user settings (unit preference) --- */
  useEffect(() => {
    fetch("/api/user/details", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.unit_pref) {
          setMeasurementSystem(String(data.unit_pref).trim().toLowerCase());
        }
        setIsLoggedIn(true);
      })
      .catch((err) =>
        console.error("Error loading user details:", err)
      );
  }, []);

  /* --- Fetch comments --- */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/recipe/${id}/comments`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  /* --- Handle comment submission --- */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/recipe/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ commentText: commentText.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      setComments([data.comment, ...comments]);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  /* --- Convert image buffer to base64 --- */
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
    }

    if (typeof recipeImg.data === "string") {
      return `data:${recipeImg.contentType};base64,${recipeImg.data}`;
    }

    return null;
  };

  /* ============================
       Render
     ============================ */

  return (
    <main className="create-page">
      <section className="recipe-details-card">
        
        {/* Header */}
        <header className="create-header recipe-details-header">
          {recipe && (
            <h1 className="create-main-title">
              {recipe.title}
            </h1>
          )}
        </header>

        {/* STATES */}
        {loading ? (
          <div className="browse-message">
            <p className="browse-message-text">Loading recipe...</p>
          </div>
        ) : error ? (
          <div className="browse-message">
            <p className="browse-message-error">Error: {error}</p>
          </div>
        ) : !recipe ? (
          <div className="browse-message">
            <p className="browse-message-text">Recipe not found.</p>
          </div>
        ) : (
          <>
            {/* TOP ROW: Image + Ingredients */}
            <section className="recipe-details-layout">
              
              {/* IMAGE */}
              <div className="recipe-details-panel recipe-details-panel--image">
                {getImageSrc(recipe.recipe_img) ? (
                  <img
                    src={getImageSrc(recipe.recipe_img)}
                    alt={recipe.title}
                    className="recipe-details-image"
                  />
                ) : (
                  <div className="recipe-details-image-placeholder">
                    Recipe Image
                  </div>
                )}
              </div>

              {/* RIGHT: INGREDIENTS PANEL */}
              <div className="recipe-details-panel recipe-details-panel--ingredients">
                <h2 className="recipe-details-panel-title">
                  Recipe Ingredients{" "}
                  <span className="settings-badge">
                    ({measurementSystem === "metric" ? "Metric" : "Imperial"})
                  </span>
                </h2>

                {recipe.ingredients?.length ? (
                  <ul className="recipe-details-list">
                    {recipe.ingredients.map((ing, idx) => {
                      const { quantity, unit } = formatIngredient(
                        ing,
                        measurementSystem
                      );

                      return (
                        <li key={idx} className="recipe-details-list-item">
                          <strong>{ing.item}</strong> — {quantity} {unit}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="recipe-details-help">No ingredients listed.</p>
                )}
              </div>
            </section>

            {/* BOTTOM: METHOD / STEPS FULL WIDTH */}
            <section className="recipe-details-panel recipe-details-panel--method">
              <h2 className="recipe-details-panel-title">
                Recipe Method / Steps
              </h2>

              {recipe.instructions?.length ? (
                <ol className="recipe-details-list">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="recipe-details-list-item">
                      {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="recipe-details-help">
                  No instructions provided.
                </p>
              )}
            </section>

            {/* COMMENTS SECTION */}
            <section className="recipe-details-panel recipe-details-panel--comments">
              <h2 className="recipe-details-panel-title">
                Comments ({comments.length})
              </h2>

              {/* Comment form for logged-in users */}
              {isLoggedIn ? (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    className="comment-textarea"
                    rows="4"
                    disabled={submittingComment}
                  />
                  <button
                    type="submit"
                    className="comment-submit-btn"
                    disabled={!commentText.trim() || submittingComment}
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </button>
                </form>
              ) : (
                <p className="recipe-details-help">
                  Please log in to leave a comment.
                </p>
              )}

              {/* Display comments */}
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-username">
                          {comment.username}
                        </span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.commentText}</p>
                    </div>
                  ))
                ) : (
                  <p className="recipe-details-help">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
