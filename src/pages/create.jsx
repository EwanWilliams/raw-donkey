import React, { useState } from "react";

export default function CreateRecipe() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState([{ item: "", amount: "", unit: "g" }]);
  const [steps, setSteps] = useState([""]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { item: "", amount: "", unit: "g" }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Must be an image
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.");
      e.target.value = "";
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    // 200KB limit
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image too large (max 2 MB). Please choose a smaller file.");
      e.target.value = "";
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!recipeTitle.trim()) {
      alert("Please enter a recipe title");
      return;
    }

    if (ingredients.some((ing) => !ing.item.trim() || !ing.amount)) {
      alert("Please fill in all ingredient fields");
      return;
    }

    if (steps.some((step) => !step.trim())) {
      alert("Please fill in all instruction steps");
      return;
    }

    if (selectedImage == null) {
      alert("Please select a recipe image");
      return;
    }

    setIsUploading(true);

    try {
      let imageData = null;
      if (selectedImage) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(selectedImage);
        });
      }

      const formattedIngredients = ingredients.map((ing) => ({
        item: ing.item,
        quantity: parseFloat(ing.amount),
        unit: ing.unit,
      }));

      const recipeData = {
        title: recipeTitle,
        recipe_img: imageData,
        ingredients: formattedIngredients,
        instructions: steps.filter((step) => step.trim()),
      };

      // Send to backend
      const response = await fetch(`/api/recipe/new`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData)
      });

      if (response.ok) {
        await response.json();
        alert("Recipe uploaded successfully!");
        setRecipeTitle("");
        setSelectedImage(null);
        setImagePreview(null);
        setIngredients([{ item: "", amount: "", unit: "g" }]);
        setSteps([""]);
        document.getElementById('FileInput').value = null;
      } else {
        const error = await response.json();
        alert(`Failed to upload recipe: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload recipe. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
  <>
    {errorMessage && (
      <div className="settings-popup-overlay">
        <div 
        className="settings-popup"
        >
          <p 
          className="settings-popup-message"
          data-test="settings-popup"
          >{errorMessage}</p>
          <button
            type="button"
            data-test="settings-popup-ok-button"
            onClick={() => setErrorMessage("")}
            className="rd-btn rd-btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    )}

    <div className="create-page">
      <div className="recipe-details-card">
        <main>
          <h2 className="create-main-title">Create Recipe</h2>

          <form onSubmit={handleUpload} data-test="add-recipe-form" className="create-form">
            {/* Title */}
            <div className="create-field-group">
              <label className="create-label">Recipe Title: *</label>
              <input
                type="text"
                data-test="recipe-title-input"
                value={recipeTitle}
                onChange={(e) => setRecipeTitle(e.target.value)}
                required
                placeholder="Enter recipe title..."
                className="create-input"
              />
            </div>

            {/* Image upload */}
            <div className="create-field-group">
              <label className="create-label">Recipe Image:</label>
              <input
                id="FileInput"
                type="file"
                data-test="recipe-image-input"
                accept="image/*"
                onChange={handleImageUpload}
                className="create-image-input"
              />
              {imagePreview && (
                <div className="create-image-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    data-test="recipe-image-preview"
                    className="create-image-preview"
                  />
                </div>
              )}

              <p>Recipe image may not be larger than ~ 2 MB</p>
            </div>

            {/* Ingredients */}
            <h3 className="create-section-title">Ingredients:</h3>
            {ingredients.map((ingredient, i) => (
              <div key={i} className="create-ingredient-block">
                <div className="create-ingredient-row">
                  <label className="create-label">Item: *</label>
                  <input
                    type="text"
                    data-test="ingredient-item-input"
                    value={ingredient.item}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[i].item = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    required
                    placeholder="e.g. Flour, Sugar..."
                    className="create-ingredient-input create-ingredient-input--item"
                  />

                  <label className="create-label">Amount: *</label>
                  <input
                    type="number"
                    data-test="ingredient-amount-input"
                    min="0"
                    step="0.01"
                    value={ingredient.amount}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[i].amount = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    required
                    placeholder="0"
                    className="create-ingredient-input create-ingredient-input--amount"
                  />

                  <label className="create-label">Unit:</label>
                  <select
                    value={ingredient.unit}
                    data-test="ingredient-unit-select"
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[i].unit = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    className="create-ingredient-select"
                  >
                    <option value="whole">whole</option>
                    <option value="g">g</option>
                    <option value="ml">mL</option>
                    <option value="oz">oz</option>
                    <option value="floz">fl.oz</option>
                    <option value="cup">cup</option>
                    <option value="tsp">tbsp</option>
                    <option value="tbsp">tsp</option>
                  </select>

                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      data-test="ingredient-remove-button"
                      onClick={() => handleRemoveIngredient(i)}
                      className="btn-create btn-create-danger"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddIngredient}
              data-test="ingredient-add-button"
              className="btn-create btn-create-secondary"
            >
              Add Ingredient
            </button>

            {/* Instructions */}
            <h3 className="create-section-title">Instructions: *</h3>
            {steps.map((step, i) => (
              <div key={i} className="create-step-block">
                <label className="create-step-label">Step {i + 1}: *</label>
                <textarea
                  placeholder="Describe this cooking step..."
                  data-test="instruction-text-input"
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[i] = e.target.value;
                    setSteps(newSteps);
                  }}
                  required
                  className="create-textarea"
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    data-test="instruction-remove-button"
                    onClick={() => handleRemoveStep(i)}
                    className="btn-create btn-create-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddStep}
              data-test="instruction-add-button"
              className="btn-create btn-create-secondary"
            >
              Add Step
            </button>

            {/* Submit */}
            <div className="create-submit-wrapper">
              <button
                type="submit"
                data-test="recipe-submit-button"
                disabled={isUploading}
                className="btn-create btn-create-primary"
              >
                {isUploading ? "Uploading..." : "Upload Recipe"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
     </>
  );
}

