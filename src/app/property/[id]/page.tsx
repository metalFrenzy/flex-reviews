"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Review = {
  id: number;
  property: string;
  guest: string;
  rating: number;
  review: string;
  categories: { category: string; rating: number }[];
  date: string;
  approved: boolean;
};

export default function PropertyPage() {
  const params = useParams(); // <-- use this
  const propertyId = params.id as string; // cast to string

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();

      const savedApprovals =
        JSON.parse(localStorage.getItem("approvals") || "{}");

      const merged = data.reviews.map((r: Review) => ({
        ...r,
        approved: savedApprovals[r.id] || false,
      }));

      setReviews(
        merged.filter(
          (r: Review) =>
            r.property.includes(propertyId) && r.approved === true
        )
      );
    }
    fetchReviews();
  }, [propertyId]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Property {propertyId}</h1>

      <h2>Guest Reviews</h2>
      {reviews.length === 0 ? (
        <p>No approved reviews yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reviews.map((r) => (
            <li
              key={r.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <strong>{r.guest}</strong> ({r.rating}/10)
              <p>{r.review}</p>
              <small>{new Date(r.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
