import React from "react";

export default function Create() {
  return (
    <div className="bg-[var(--color-bg)] min-h-screen flex items-center justify-center py-12">
      <div className="card p-10 w-[500px]">
        <h1 className="text-3xl font-bold text-[var(--color-brand)] mb-8 text-center">
          Create Recipe
        </h1>

        <form className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-[var(--color-text)] font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              className="form-control w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] outline-none transition"
              placeholder="Recipe title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[var(--color-text)] font-medium mb-2">
              Description
            </label>
            <textarea
              rows="4"
              className="form-control w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] outline-none transition"
              placeholder="Write a short description..."
            ></textarea>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[var(--color-text)] font-medium mb-2">
              Image URL
            </label>
            <input
              type="text"
              className="form-control w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] outline-none transition"
              placeholder="Optional image link"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-brand w-full py-3 text-lg font-semibold hover:scale-[1.02]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
