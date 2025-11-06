import React, { useRef, useState } from "react";

export default function Settings({ onAvatarChange }) {
  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(
    () => localStorage.getItem("avatarUrl") || ""
  );

  // Measurement system: "metric" or "us"
  const [measurementSystem, setMeasurementSystem] = useState(
    () => localStorage.getItem("measurementSystem") || "metric"
  );

  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

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
      alert("Image too large. Please use a file under 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setAvatarUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Save avatar
    if (avatarUrl) {
      localStorage.setItem("avatarUrl", avatarUrl);
      if (onAvatarChange) onAvatarChange(avatarUrl);
    } else {
      localStorage.removeItem("avatarUrl");
      if (onAvatarChange) onAvatarChange("");
    }

    // Save measurement preference
    localStorage.setItem("measurementSystem", measurementSystem);

    alert("Settings saved.");
  };

  const handleRemove = () => {
    setAvatarUrl("");
    localStorage.removeItem("avatarUrl");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onAvatarChange) onAvatarChange("");
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h1 className="settings-title">User Settings</h1>

        {/* Avatar section */}
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

        {/* Measurement preference section */}
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
                value="us"
                checked={measurementSystem === "us"}
                onChange={(e) => setMeasurementSystem(e.target.value)}
              />
              <span className="settings-radio-text">
                US Standard (cups, tablespoons, pounds, ounces)
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
