import { NextResponse } from "next/server";


const mockReviews = [
  {
    id: 1001,
    type: "guest-to-host",
    status: "published",
    rating: 8,
    publicReview: "Lovely apartment, very clean and close to transport.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 10 },
    ],
    submittedAt: "2023-11-21 15:30:00",
    guestName: "Alice Johnson",
    listingName: "2B N1 A - 29 Shoreditch Heights",
  },
  {
    id: 1002,
    type: "guest-to-host",
    status: "published",
    rating: 6,
    publicReview: "Nice flat but noisy at night.",
    reviewCategory: [
      { category: "cleanliness", rating: 7 },
      { category: "communication", rating: 9 },
      { category: "location", rating: 5 },
    ],
    submittedAt: "2023-11-18 12:00:00",
    guestName: "Bob Smith",
    listingName: "2B N1 A - 29 Shoreditch Heights",
  },
];

export async function GET() {
  const normalized = mockReviews.map((r) => ({
    id: r.id,
    property: r.listingName,
    guest: r.guestName,
    rating: r.rating,
    review: r.publicReview,
    categories: r.reviewCategory,
    date: r.submittedAt,
    approved: false,
  }));

  return NextResponse.json({ reviews: normalized });
}
