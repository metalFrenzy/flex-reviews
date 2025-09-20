"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { propertyMap } from "../data/properties";

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
    const [sortBy, setSortBy] = useState<string>("date"); // default sort by date

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

    // Apply sorting
    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === "rating") {
            return b.rating - a.rating; // highest first
        }
        if (sortBy === "guest") {
            return a.guest.localeCompare(b.guest);
        }
        if (sortBy === "date") {
            return new Date(b.date).getTime() - new Date(a.date).getTime(); // newest first
        }
        return 0;
    });

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Manager Dashboard</h1>

            {/* Sorting control */}
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Sort by:{" "}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="date">Date</option>
                        <option value="rating">Rating</option>
                        <option value="guest">Guest</option>
                    </select>
                </label>
            </div>

            {/* Table of reviews */}
            <table
                border={1}
                cellPadding={8}
                style={{ width: "100%", marginTop: "1rem" }}
            >
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Guest</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Date</th>
                        <th>Approved</th>
                        <th>Public Page</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedReviews.map((review) => {
                        const propertyId = Object.keys(propertyMap).find(
                            (key) => propertyMap[key] === review.property
                        );

                        return (
                            <tr key={review.id}>
                                <td>{review.property}</td>
                                <td>{review.guest}</td>
                                <td>{review.rating}</td>
                                <td>{review.review}</td>
                                <td>{new Date(review.date).toLocaleDateString()}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={review.approved}
                                        onChange={() => toggleApproval(review.id)}
                                    />
                                </td>
                                <td>
                                    {propertyId ? (
                                        <Link
                                            href={`/property/${propertyId}`}
                                            style={{
                                                color: "blue",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            View Property
                                        </Link>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
