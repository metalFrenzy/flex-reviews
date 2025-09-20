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

export default function DashboardPage() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        async function fetchReviews() {
            const res = await fetch("/api/reviews/hostaway");
            const data = await res.json();
            setReviews(data.reviews);
        }
        fetchReviews();
    }, []);

    function toggleApproval(id: number) {
        setReviews((prev) =>
            prev.map((r) =>
                r.id === id ? { ...r, approved: !r.approved } : r
            )
        );
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Manager Dashboard</h1>
            <table border={1} cellPadding={8} style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Guest</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Date</th>
                        <th>Approved</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((r) => (
                        <tr key={r.id}>
                            <td>{r.property}</td>
                            <td>{r.guest}</td>
                            <td>{r.rating}</td>
                            <td>{r.review}</td>
                            <td>{new Date(r.date).toLocaleDateString()}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={r.approved}
                                    onChange={() => toggleApproval(r.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
