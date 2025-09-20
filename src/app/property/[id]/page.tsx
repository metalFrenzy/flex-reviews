"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { propertyMap } from "@/app/data/properties";
import styles from "../property.module.css";


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
  const params = useParams();
  const propertyId = params.id as string;
  const propertyName = propertyMap[propertyId];

  const [reviews, setReviews] = useState<Review[]>([]);
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

        setReviews(
          merged.filter(
            (r: Review) => r.property === propertyName && r.approved === true
          )
        );
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [propertyName]);

  // Calculate statistics
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

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
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>
          {propertyName || `Property ${propertyId}`}
        </h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{reviews.length}</div>
          <div className={styles.statLabel}>Total Reviews</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            <span className={styles.ratingValue}>★ {avgRating}</span>
          </div>
          <div className={styles.statLabel}>Average Rating</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {reviews.filter(r => r.rating >= 8).length}
          </div>
          <div className={styles.statLabel}>Excellent Reviews</div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className={styles.ratingChart}>
          <h3 className={styles.chartTitle}>Rating Distribution</h3>
          <div className={styles.chartBars}>
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating] || 0;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={rating} className={styles.chartBar}>
                  <span className={styles.chartLabel}>{rating}</span>
                  <div className={styles.chartBarContainer}>
                    <div
                      className={styles.chartBarFill}
                      style={{ width: `${percentage}%` }}
                      data-rating={rating}
                    ></div>
                  </div>
                  <span className={styles.chartCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>
          Guest Reviews
          <span className={styles.reviewCount}>({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>No approved reviews yet</h3>
            <p>Once reviews are approved in the dashboard, they will  appear here.</p>
          </div>
        ) : (
          <div className={styles.reviewsList}>
            {reviews
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <div className={styles.reviewerName}>{review.guest}</div>
                      <div className={styles.reviewDate}>
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className={styles.reviewRating} data-rating={review.rating}>
                      <span className={styles.ratingStars}>
                        {'★'.repeat(Math.min(Math.floor(review.rating / 2), 5))}
                        {'☆'.repeat(5 - Math.min(Math.floor(review.rating / 2), 5))}
                      </span>
                      <span className={styles.ratingNumber}>{review.rating}/10</span>
                    </div>
                  </div>

                  <div className={styles.reviewContent}>
                    <p className={styles.reviewText}>{review.review}</p>
                  </div>

                  {review.categories && review.categories.length > 0 && (
                    <div className={styles.reviewCategories}>
                      <h4 className={styles.categoriesTitle}>Category Ratings</h4>
                      <div className={styles.categoriesList}>
                        {review.categories.map((cat, index) => (
                          <div key={index} className={styles.categoryItem}>
                            <span className={styles.categoryName}>{cat.category}</span>
                            <div className={styles.categoryRating}>
                              <div className={styles.categoryBar}>
                                <div
                                  className={styles.categoryBarFill}
                                  style={{ width: `${(cat.rating / 10) * 100}%` }}
                                ></div>
                              </div>
                              <span className={styles.categoryScore}>{cat.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}