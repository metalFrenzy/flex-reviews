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
  channel: string;
  approved: boolean;
};

export default function DashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<string>("date");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews/hostaway");
        const data = await res.json();

        const savedApprovals =
          JSON.parse(localStorage.getItem("approvals") || "{}");

        const merged = data.reviews.map((r: Review) => ({
          ...r,
          approved: savedApprovals[r.id] || false,
        }));

        setReviews(merged);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
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

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterBy === "all" ||
      (filterBy === "excellent" && review.rating >= 8) ||
      (filterBy === "good" && review.rating >= 6 && review.rating < 8) ||
      (filterBy === "poor" && review.rating < 6);

    const matchesChannel = channelFilter === "all" || review.channel === channelFilter;

    return matchesRating && matchesChannel;
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "guest") return a.guest.localeCompare(b.guest);
    if (sortBy === "property") return a.property.localeCompare(b.property);
    if (sortBy === "channel") return a.channel.localeCompare(b.channel);
    if (sortBy === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    return 0;
  });

  // Get unique channels for filter dropdown
  const uniqueChannels = [...new Set(reviews.map(r => r.channel))];

  // Calculate stats
  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.approved).length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0",
    excellent: reviews.filter(r => r.rating >= 8).length
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manager Dashboard</h1>
        <div className={styles.statsOverview}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Reviews</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.approved}</span>
            <span className={styles.statLabel}>Approved</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>★ {stats.avgRating}</span>
            <span className={styles.statLabel}>Avg Rating</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.excellent}</span>
            <span className={styles.statLabel}>Excellent (8+)</span>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>
            Sort by:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.select}>
              <option value="date">Date</option>
              <option value="rating">Rating</option>
              <option value="guest">Guest</option>
              <option value="property">Property</option>
              <option value="channel">Channel</option>
            </select>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label>
            Filter by Rating:
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className={styles.select}>
              <option value="all">All Ratings</option>
              <option value="excellent">Excellent (8-10)</option>
              <option value="good">Good (6-7)</option>
              <option value="poor">Poor (1-5)</option>
            </select>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label>
            Filter by Channel:
            <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className={styles.select}>
              <option value="all">All Channels</option>
              {uniqueChannels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.resultsCount}>
          Showing {sortedReviews.length} of {reviews.length} reviews
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Property</th>
              <th>Guest</th>
              <th>Rating</th>
              <th>Channel</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
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
                  <td className={styles.ratingCell} data-rating={review.rating}>
                    ★ {review.rating}
                  </td>
                  <td>
                    <span className={styles.channelBadge} data-channel={review.channel.toLowerCase()}>
                      {review.channel}
                    </span>
                  </td>
                  <td className={styles.reviewCell}>
                    <div className={styles.reviewText}>{review.review}</div>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td>
                    <div className={styles.approvalBadge}>
                      <input
                        type="checkbox"
                        checked={review.approved}
                        onChange={() => toggleApproval(review.id)}
                        className={styles.checkbox}
                        aria-label={`Toggle approval for ${review.guest}'s review`}
                      />
                      <span
                        className={`${styles.approvalStatus} ${review.approved ? styles.approved : styles.pending
                          }`}
                      >
                        {review.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </td>
                  <td>
                    {propertyId ? (
                      <Link href={`/property/${propertyId}`} className={styles.link}>
                        View Property
                      </Link>
                    ) : (
                      <span style={{ color: 'var(--foreground-muted)' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}