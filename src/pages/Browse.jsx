import React from "react";

export default function Browse() {
  const items = [
    { id: 1, title: "Mango Smoothie", desc: "A refreshing tropical drink" },
    { id: 2, title: "Veggie Tacos", desc: "Healthy tacos with guacamole" },
    { id: 3, title: "Chocolate Cake", desc: "Rich, moist, and decadent" },
  ];

  return (
    <div className="bg-[var(--color-bg)] min-h-screen py-12">
      <h1 className="text-4xl font-bold text-[var(--color-brand)] mb-10 text-center">
        Browse Recipes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="card p-6 hover:shadow-hover transition duration-200"
          >
            <img
              src={`https://source.unsplash.com/400x250/?${item.title}`}
              alt={item.title}
              className="rounded-lg mb-4 w-full h-48 object-cover"
            />
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
              {item.title}
            </h2>
            <p className="text-[var(--color-text-light)]">{item.desc}</p>
            <button className="btn-brand mt-4 w-full">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
