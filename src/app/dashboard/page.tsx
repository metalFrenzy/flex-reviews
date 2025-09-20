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

    // Load reviews from API + saved approvals
    useEffect(() => {
        async function fetchReviews() {
            const res = await fetch("/api/reviews/hostaway");
            const data = await res.json();

            // Get saved approvals from localStorage
            const savedApprovals =
                JSON.parse(localStorage.getItem("approvals") || "{}");

            const merged = data.reviews.map((r: Review) => ({
                ...r,
                approved: savedApprovals[r.id] || false,
            }));

            setReviews(merged);
        }
        fetchReviews();
    }, []);

    function toggleApproval(id: number) {
        setReviews((prev) => {
            const updated = prev.map((r) =>
                r.id === id ? { ...r, approved: !r.approved } : r
            );
            const approvals: Record<number, boolean> = {};
            updated.forEach((r) => {
                approvals[r.id] = r.approved;
            });
            localStorage.setItem("approvals", JSON.stringify(approvals));

            return updated;
        });
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
