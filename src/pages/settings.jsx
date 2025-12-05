import React, { useRef, useState, useEffect } from "react";

export default function Settings({ onAvatarChange }) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [measurementSystem, setMeasurementSystem] = useState("metric");
  const [errorMessage, setErrorMessage] = useState(""); // popup message
  const fileInputRef = useRef(null);

  function buildAvatarUrl(profile_img) {
    if (!profile_img || !profile_img.data) return "";

    const raw = profile_img.data;
    const byteArray = Array.isArray(raw) ? raw : raw.data;
    if (!byteArray) return "";

    const uint8 = new Uint8Array(byteArray);

    let binary = "";
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }

    const base64 = window.btoa(binary);
    return `data:${profile_img.contentType};base64,${base64}`;
  }

  useEffect(() => {
    fetch("/api/user/details", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;

        console.log("DETAILS RESPONSE:", data);

        if (data.profile_img) {
          const url = buildAvatarUrl(data.profile_img);
          console.log("BUILT AVATAR URL:", url);
          setAvatarUrl(url);
        }

        if (data.unit_pref) {
          setMeasurementSystem(data.unit_pref);
        }
      });
  }, []);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.");
      e.target.value = "";
      return;
    }

  
    if (file.size > 200 * 1024) {
      setErrorMessage("Image too large (max 200kb). Please choose a smaller file.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);
  };


  const handleSave = async () => {
    let imgToSend = "";

    if (
      avatarUrl &&
      avatarUrl.startsWith("data:image/") &&
      avatarUrl.includes(",") &&
      avatarUrl.split(",")[1].length > 0
    ) {
      imgToSend = avatarUrl;
    }

    const payload = {
      unit: measurementSystem,
      img: imgToSend,
    };

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) {
        try {
          const data = JSON.parse(text);
          setErrorMessage(data.error || "Could not save settings.");
        } catch {
          setErrorMessage("Could not save settings.");
        }
        return;
      }

      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage("Could not save settings.");
    }
  };

  return (
    <>
      {/* Error popup */}
      {errorMessage && (
        <div className="settings-popup-overlay">
          <div className="settings-popup"
          data-test="settings-error-popup"
          >
            <p className="settings-popup-message">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="rd-btn rd-btn-primary"
              data-test="settings-error-popup-ok-button"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="settings-page"
      data-test="settings-page">
        <div className="recipe-details-card"
        data-test="settings-card">
          <h1 className="settings-title"
          data-test="settings-title"
          >User Settings</h1>

          {/* Avatar Section */}
          <div className="settings-avatar-section">
            <div className="settings-avatar-wrapper">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile preview"
                  className="settings-avatar-img"
                  data-test="settings-avatar-img"
                />
              ) : (
                <div className="settings-avatar-placeholder">No picture</div>
              )}
            </div>

            <p className="settings-help-text">Upload a profile picture.</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="settings-file-input"
              data-test="settings-file-input"
              onChange={handleFileChange}
            />

            <div className="settings-button-row">
              <button
                type="button"
                onClick={openFilePicker}
                className="rd-btn rd-btn-outline"
                data-test="settings-change-picture-button"
              >
                Change Picture
              </button>
            </div>
          </div>

          {/* Measurement preference */}
          <div className="settings-measure-section"
          data-test="settings-measure-section">
            <h2 className="settings-measure-title"
            data-test="settings-measure-title"
            >Measurement Preference</h2>
            <p className="settings-measure-help">
              Choose how ingredients should be displayed.
            </p>

            <div className="settings-measure-options">
              <label className="settings-radio-label">
                <input
                  type="radio"
                  name="measurementSystem"
                  data-test="settings-metric-radio"
                  value="metric"
                  checked={measurementSystem === "metric"}
                  onChange={(e) => setMeasurementSystem(e.target.value)}
                />
                <span className="settings-radio-text">
                  Metric (grams, millilitres)
                </span>
              </label>

              <label className="settings-radio-label">
                <input
                  type="radio"
                  name="measurementSystem"
                  data-test="settings-imperial-radio"
                  value="imperial"
                  checked={measurementSystem === "imperial"}
                  onChange={(e) => setMeasurementSystem(e.target.value)}
                />
                <span className="settings-radio-text">
                  Imperial (ounces, pounds)
                </span>
              </label>
            </div>
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            className="rd-btn rd-btn-primary rd-btn-full"
            data-test="settings-save-button"
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
}
