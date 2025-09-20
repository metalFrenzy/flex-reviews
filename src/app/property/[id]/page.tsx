"use client";

import { useEffect, useState } from "react";

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

export default function PropertyPage({ params }: { params: { id: string } }) {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        async function fetchReviews() {
            const res = await fetch("/api/reviews/hostaway");
            const data = await res.json();

            // Load saved approvals from localStorage
            const savedApprovals =
                JSON.parse(localStorage.getItem("approvals") || "{}");

            const merged = data.reviews.map((r: Review) => ({
                ...r,
                approved: savedApprovals[r.id] || false,
            }));

            // Only show approved reviews for this property
            setReviews(
                merged.filter(
                    (r: Review) =>
                        r.property.includes(params.id) && r.approved === true
                )
            );
        }
        fetchReviews();
    }, [params.id]);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Property {params.id}</h1>

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
