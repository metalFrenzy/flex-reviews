"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { propertyMap } from "../data/properties";
import styles from "./dashboard.module.css";

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
  const [sortBy, setSortBy] = useState<string>("date");

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

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "guest") return a.guest.localeCompare(b.guest);
    if (sortBy === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    return 0;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manager Dashboard</h1>

      <div className={styles.controls}>
        <label>
          Sort by:{" "}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select">
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="guest">Guest</option>
          </select>
        </label>
      </div>

      <table className={styles.table}>
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
                    className={styles.checkbox}
                  />
                </td>
                <td>
                  {propertyId ? (
                    <Link href={`/property/${propertyId}`} className={styles.link}>
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
