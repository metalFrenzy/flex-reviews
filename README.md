# 🏠 Flex Living Reviews Dashboard

> 🎯 A modern, comprehensive review management system for property managers to efficiently handle guest reviews across multiple channels.

## 🌟 Features

### 📊 Manager Dashboard
- 📈 **Real-time Statistics** - Total reviews, approval rates, and rating analytics
- 🔍 **Advanced Filtering** - Filter by rating quality and booking channels
- 📅 **Smart Sorting** - Sort by date, rating, guest, property, or channel
- ✅ **Approval Management** - One-click approve/reject functionality
- 🎨 **Modern Dark UI** - Professional interface with beautiful animations

### 🏢 Property Pages  
- ⭐ **Rating Analytics** - Visual distribution charts and key metrics
- 📝 **Guest Reviews** - Display only approved reviews with rich formatting
- 📊 **Category Ratings** - Detailed breakdowns for cleanliness, location, etc.
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile

### 🔗 API Integration
- 🏨 **Hostaway API** - Mock integration with realistic review data
- 🔄 **Data Normalization** - Clean, structured data processing
- 🚀 **Performance Optimized** - Fast loading with efficient data handling

## 🛠️ Tech Stack

- ⚡ **Next.js 14** - App Router with server components
- ⚛️ **React 18** - Modern hooks and TypeScript
- 🎨 **CSS Modules** - Scoped styling with dark theme
- 🔤 **Cabin Font** - Google Fonts integration
- 📱 **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### 📋 Prerequisites
- 📦 Node.js 18+ 
- 💻 npm or yarn

### ⚙️ Installation

1. **📥 Clone the repository**
   ```bash
   git clone <repository-url>
   cd flex-living-reviews
   ```

2. **📦 Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **🚀 Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **🌐 Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
📂 app/
├── 🌐 api/reviews/hostaway/route.ts    # API endpoint
├── 📊 data/properties.ts               # Property mappings
├── 🏠 dashboard/
│   ├── 🎨 dashboard.module.css         # Dashboard styles
│   └── 📄 page.tsx                     # Dashboard component
├── 🏢 property/[id]/
│   ├── 🎨 property.module.css          # Property styles
│   └── 📄 page.tsx                     # Property component
├── 🎨 globals.css                      # Global theme
└── 📋 layout.tsx                       # Root layout
```

## 🎮 Usage

### 👨‍💼 Manager Dashboard (`/`)
1. **📊 View Statistics** - Check total reviews and approval rates
2. **🔍 Filter Reviews** - Use dropdowns to filter by rating/channel
3. **📅 Sort Data** - Click column headers or use sort dropdown
4. **✅ Approve Reviews** - Toggle checkboxes to approve/reject
5. **👁️ View Properties** - Click "View Property" to see public page

### 🏢 Property Pages (`/property/[id]`)
1. **📈 Check Analytics** - See rating distribution and stats
2. **📝 Read Reviews** - Browse approved guest reviews
3. **⭐ View Ratings** - Check category-specific ratings
4. **🔙 Navigate Back** - Use back button to return to dashboard

### 🔗 Available Routes
- 🏠 `/` - Main dashboard
- 🏢 `/property/shoreditch-heights` - Shoreditch Heights property
- 🏢 `/property/bayside-loft` - Bayside Loft property  
- 🏢 `/property/seaside-studio` - Seaside Studio property

## 🎨 Key Features

### 🎯 Smart Filtering
- 🌟 **Excellent** (8-10) - Premium reviews
- 👍 **Good** (6-7) - Positive feedback
- 👎 **Poor** (1-5) - Issues to address

### 🏷️ Channel Support
- 🏠 **Airbnb** - Red theme
- 🏨 **Booking.com** - Blue theme  
- 📞 **Direct** - Purple theme
- 🔗 **Hostaway** - Green theme

### 📊 Visual Analytics
- 📈 Rating distribution charts
- 📋 Category performance bars
- 🎯 Key metrics cards
- 🔥 Trend indicators

## 🔧 Development

### 🐛 Development Commands
```bash
# 🚀 Start dev server
npm run dev

# 🏗️ Build production
npm run build

# ▶️ Start production server
npm run start

# 🧹 Lint code
npm run lint
```

### 🎨 Styling Guide
- 🌙 **Dark Theme** - Professional appearance
- 🎨 **CSS Custom Properties** - Consistent theming
- 📱 **Mobile-First** - Responsive breakpoints
- ✨ **Smooth Animations** - Enhanced user experience

### 📊 Mock Data
The app uses realistic mock data simulating:
- 🏠 **11 Reviews** across 3 properties
- 📅 **Date Range** - Various submission dates
- ⭐ **Rating Spread** - 1-10 rating scale
- 🏷️ **Multi-Channel** - Different booking platforms

## 🛡️ API Reference

### 📡 GET `/api/reviews/hostaway`

**Response:**
```json
{
  "reviews": [
    {
      "id": 1001,
      "property": "2B N1 A - 29 Shoreditch Heights",
      "guest": "Alice Johnson",
      "rating": 8,
      "review": "Lovely apartment...",
      "categories": [...],
      "date": "2024-06-21 15:30:00",
      "channel": "Airbnb",
      "approved": false
    }
  ],
  "total": 11,
  "lastUpdated": "2024-09-21T..."
}
```

## 🔮 Future Enhancements

### 🚀 Planned Features
- 🔗 **Real Hostaway API** - Live data integration
- 📊 **Advanced Analytics** - Trend analysis and insights
- 🔄 **Bulk Operations** - Mass approve/reject functionality
- 📧 **Notifications** - Email alerts for new reviews
- 💬 **Review Responses** - Manager reply system
- 📥 **Export Features** - PDF/CSV reports

### 🛠️ Technical Improvements
- 🧪 **Unit Tests** - Comprehensive test coverage
- 🔍 **Error Boundaries** - Better error handling
- 🚀 **Performance** - Caching and optimization
- ♿ **Accessibility** - Enhanced keyboard navigation
- 📱 **PWA Features** - Offline functionality

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m '✨ Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request


## 🙏 Acknowledgments

- 🏨 **Hostaway** - API inspiration and structure
- 🎨 **Next.js Team** - Amazing framework and documentation
- 🎯 **Flex Living** - Project requirements and vision
- ✨ **Open Source Community** - Tools and inspiration

---
