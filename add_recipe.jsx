import React, { useState } from "react";

export default function CreateRecipe() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState([{ item: "", amount: "", unit: "g" }]);
  const [steps, setSteps] = useState([""]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { item: "", amount: "", unit: "g" }]);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
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

  const handleUpload = (e) => {
    e.preventDefault();
    console.log({ recipeTitle, selectedImage, ingredients, steps });
    alert("Recipe uploaded (test mode)");
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

        <form onSubmit={handleUpload}>
          <label>Recipe Title:</label><br />
          <input
            type="text"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
          <br /><br />
          
          <label>Recipe Image:</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: "10px" }}
          />
          {imagePreview && (
            <div style={{ marginBottom: "20px" }}>
              <img 
                src={imagePreview} 
                alt="Recipe preview" 
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
          <br />

          <h3>Ingredients:</h3>
          {ingredients.map((ingredient, i) => (
            <div key={i}>
              <label>Item:</label>
              <input
                type="text"
                value={ingredient.item}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[i].item = e.target.value;
                  setIngredients(newIngredients);
                }}
              />

              <label>Amount:</label>
              <input
                type="number"
                value={ingredient.amount}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[i].amount = e.target.value;
                  setIngredients(newIngredients);
                }}
              />

              <label>Unit:</label>
              <select
                value={ingredient.unit}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[i].unit = e.target.value;
                  setIngredients(newIngredients);
                }}
              >
                <option value="g">g</option>
                <option value="ml">mL</option>
                <option value="oz">oz</option>
                <option value="floz">fl.oz</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>

          <h3>Instructions:</h3>
          {steps.map((step, i) => (
            <div key={i}>
              <label>{i + 1}.</label><br />
              <textarea
                placeholder="Please type here..."
                value={step}
                onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[i] = e.target.value;
                  setSteps(newSteps);
                }}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddStep}>Add Step</button>

          <br />
          <button type="submit">Upload</button>
        </form>
      </main>
    </div>
  );
}
