import React, { useRef, useState, useEffect } from "react";

export default function Settings({ onAvatarChange }) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [measurementSystem, setMeasurementSystem] = useState("metric");
  const fileInputRef = useRef(null);

  // 🔄 Load settings from backend on page load
  useEffect(() => {
    fetch("/api/user/settings", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return;

        if (data.profile_img?.data) {
          const base64 = `data:${data.profile_img.contentType};base64,${data.profile_img.data}`;
          setAvatarUrl(base64);
        }

        if (data.unit_pref) {
          setMeasurementSystem(data.unit_pref); // metric / imperial
        }
      });
  }, []);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const under5MB = file.size <= 5 * 1024 * 1024;

    if (!isImage) {
      alert("Please choose an image file.");
      e.target.value = "";
      return;
    }

    if (!under5MB) {
      alert("Image too large. Please use a file under 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setAvatarUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onAvatarChange) onAvatarChange("");
  };

  const handleSave = async () => {
    const payload = {
      unit: measurementSystem,
    };

    if (avatarUrl) payload.img = avatarUrl;

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Could not save settings: ${text}`);
        return;
      }

      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Could not save settings.");
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
