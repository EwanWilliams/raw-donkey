import React, { useRef, useState } from "react";

export default function Settings({ onAvatarChange }) {
  const [avatarUrl, setAvatarUrl] = useState(
    () => localStorage.getItem("avatarUrl") || ""
  );

  // Now use "metric" or "imperial"
  const [measurementSystem, setMeasurementSystem] = useState(
    () => localStorage.getItem("measurementSystem") || "metric"
  );

  const fileInputRef = useRef(null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const under5MB = file.size <= 5 * 1024 * 1024;

    if (!isImage) {
      alert("Please choose an image file (PNG, JPG, GIF).");
      e.target.value = "";
      return;
    }

    if (!under5MB) {
      alert("Image too large. Please use a file under 200KB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setAvatarUrl("");
    localStorage.removeItem("avatarUrl");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onAvatarChange) onAvatarChange("");
  };

const handleSave = async () => {
  // Backend expects:
  //   img  -> base64 data URL string
  //   unit -> string (e.g. "metric" or "imperial")
  const payload = {
    unit: measurementSystem,   // "metric" or "imperial"
  };

  if (avatarUrl) {
    payload.img = avatarUrl;   // data URL "data:image/png;base64,..."
  }

  console.log("Sending settings payload:", payload);

  try {
    const res = await fetch(`${import.meta.env.VITE_API}/user/settings`, {
      method: "PUT",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text();
    console.log("Settings response:", res.status, bodyText);

    if (!res.ok) {
      alert(
        bodyText
          ? `Could not save settings: ${bodyText}`
          : `Could not save settings (status ${res.status}).`
      );
      return;
    }

    // Keep local cache in sync
    localStorage.setItem("measurementSystem", measurementSystem);

    if (avatarUrl) {
      localStorage.setItem("avatarUrl", avatarUrl);
      if (onAvatarChange) onAvatarChange(avatarUrl);
    } else {
      localStorage.removeItem("avatarUrl");
      if (onAvatarChange) onAvatarChange("");
    }

    alert("Settings saved successfully.");
  } catch (err) {
    console.error("Network or parsing error while saving settings:", err);
    alert("Could not save settings. Please try again.");
  }
};


  return (
    <div className="settings-page">
      <div className="settings-card">
        <h1 className="settings-title">User Settings</h1>

        {/* Avatar Section */}
        <div className="settings-avatar-section">
          <div className="settings-avatar-wrapper">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile preview"
                className="settings-avatar-img"
              />
            ) : (
              <div className="settings-avatar-placeholder">No picture</div>
            )}
          </div>

          <p className="settings-help-text">
            Upload a profile picture (PNG, JPG, GIF, or WEBP — up to 5MB).
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="settings-file-input"
            onChange={handleFileChange}
          />

          <div className="settings-button-row">
            <button
              type="button"
              onClick={openFilePicker}
              className="rd-btn rd-btn-outline"
            >
              Change Picture
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={!avatarUrl}
              className="rd-btn rd-btn-outline"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Measurement preference */}
        <div className="settings-measure-section">
          <h2 className="settings-measure-title">Measurement Preference</h2>
          <p className="settings-measure-help">
            Choose how you want ingredients to be shown in recipes.
          </p>

          <div className="settings-measure-options">
            <label className="settings-radio-label">
              <input
                type="radio"
                name="measurementSystem"
                value="metric"
                checked={measurementSystem === "metric"}
                onChange={(e) => setMeasurementSystem(e.target.value)}
              />
              <span className="settings-radio-text">
                Metric (grams, millilitres, kilograms)
              </span>
            </label>

            <label className="settings-radio-label">
              <input
                type="radio"
                name="measurementSystem"
                value="imperial"
                checked={measurementSystem === "imperial"}
                onChange={(e) => setMeasurementSystem(e.target.value)}
              />
              <span className="settings-radio-text">
                Imperial (pounds, ounces)
              </span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className="rd-btn rd-btn-primary rd-btn-full"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
