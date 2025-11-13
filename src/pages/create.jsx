import React, { useState } from "react";

export default function CreateRecipe() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState([{ item: "", amount: "", unit: "g" }]);
  const [steps, setSteps] = useState([""]);
  const [isUploading, setIsUploading] = useState(false);

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
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!recipeTitle.trim()) {
      alert("Please enter a recipe title");
      return;
    }

    if (ingredients.some(ing => !ing.item.trim() || !ing.amount)) {
      alert("Please fill in all ingredient fields");
      return;
    }

    if (steps.some(step => !step.trim())) {
      alert("Please fill in all instruction steps");
      return;
    }

    if (selectedImage == null) {
      alert("Please select a recipe image");
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert image to base64 if selected
      let imageData = null;
      if (selectedImage) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(selectedImage);
        });
      }

      // Format ingredients to match schema (quantity instead of amount)
      const formattedIngredients = ingredients.map(ing => ({
        item: ing.item,
        quantity: parseFloat(ing.amount),
        unit: ing.unit
      }));

      // Prepare recipe data
      const recipeData = {
        title: recipeTitle,
        recipe_img: imageData,
        ingredients: formattedIngredients,
        instructions: steps.filter(step => step.trim())
      };

      // Send to backend
      const response = await fetch('/api/recipe/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData)
      });

      if (response.ok) {
        const result = await response.json();
        alert("Recipe uploaded successfully!");
        // Reset form
        setRecipeTitle("");
        setSelectedImage(null);
        setImagePreview(null);
        setIngredients([{ item: "", amount: "", unit: "g" }]);
        setSteps([""]);
        document.getElementById('FileInput').value = null;
      } else {
        const error = await response.json();
        alert(`Failed to upload recipe: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload recipe. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <header>
        <h1>Raw Donkey</h1>
        <nav>
          <a href="/">Browse</a> | <a href="/create">Create</a> | <a href="/login">Login</a>
        </nav>
      </header>

      <main>
        <h2>Create Recipe</h2>

        <form onSubmit={handleUpload} data-test="add-recipe-form">
          <label>Recipe Title: *</label><br />
          <input
            type="text"
            data-test="recipe-title-input"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
            required
            placeholder="Enter recipe title..."
            style={{
              width: "300px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
          <br /><br />
          
          <label>Recipe Image:</label><br />
          <input
            id="FileInput"
            type="file"
            data-test="recipe-image-input"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: "10px" }}
          />
          {imagePreview && (
            <div style={{ marginBottom: "20px" }}>
              <img 
                src={imagePreview} 
                alt="Recipe preview" 
                data-test="recipe-image-preview"
                style={{ 
                  maxWidth: "200px", 
                  maxHeight: "200px", 
                  objectFit: "cover",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }} 
              />
            </div>
          )}
          <p>Recipe image may not be larger than ~200 KB</p>
          <br />

          <h3>Ingredients:</h3>
          {ingredients.map((ingredient, i) => (
            <div key={i} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
              <label>Item: *</label>
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
                style={{ marginRight: "10px", padding: "5px" }}
              />

              <label>Amount: *</label>
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
                style={{ marginRight: "10px", padding: "5px", width: "80px" }}
              />

              <label>Unit:</label>
              <select
                value={ingredient.unit}
                data-test="ingredient-unit-select"
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[i].unit = e.target.value;
                  setIngredients(newIngredients);
                }}
              >
                <option value="whole">whole</option>
                <option value="tsp">tsp</option>
                <option value="tbsp">tbsp</option>
                <option value="cup">cup</option>
                <option value="g">g</option>
                <option value="ml">mL</option>
                <option value="oz">oz</option>
                <option value="floz">fl.oz</option>
              </select>

              {ingredients.length > 1 && (
                <button 
                  type="button" 
                  data-test="ingredient-remove-button"
                  onClick={() => handleRemoveIngredient(i)}
                  style={{ 
                    marginLeft: "10px", 
                    backgroundColor: "#ff6b6b", 
                    color: "white", 
                    border: "none", 
                    padding: "5px 10px", 
                    borderRadius: "3px",
                    cursor: "pointer"
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddIngredient} data-test="ingredient-add-button">Add Ingredient</button>

          <h3>Instructions: *</h3>
          {steps.map((step, i) => (
            <div key={i} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
              <label>Step {i + 1}: *</label><br />
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
                style={{ 
                  width: "100%", 
                  minHeight: "80px", 
                  marginBottom: "5px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
              {steps.length > 1 && (
                <button 
                  type="button"
                  data-test="instruction-remove-button"
                  onClick={() => handleRemoveStep(i)}
                  style={{ 
                    backgroundColor: "#ff6b6b", 
                    color: "white", 
                    border: "none", 
                    padding: "5px 10px", 
                    borderRadius: "3px",
                    cursor: "pointer"
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddStep} data-test="instruction-add-button">Add Step</button>

          <br />
          <button 
            type="button"
            onClick={handleUpload}
            data-test="recipe-submit-button"
            disabled={isUploading}
            style={{
              backgroundColor: isUploading ? "#ccc" : "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: isUploading ? "not-allowed" : "pointer",
              fontSize: "16px"
            }}
          >
            {isUploading ? "Uploading..." : "Upload Recipe"}
          </button>
        </form>
      </main>
    </div>
  );
}
