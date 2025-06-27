# 🎬 Mini Movie App

A sleek and responsive movie browsing experience built with **Next.js 14**, **Zustand**, and **The Movie Database (TMDb) API**. Users can browse, search, view details, and favorite movies with smooth transitions and optimized performance.

[![Vercel Deployment](https://vercelbadge.vercel.app/api/NourHesham12/mini-movie-app)](https://mini-movie-app-brown.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-blue.svg?logo=next.js)](https://nextjs.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-orange.svg)](https://github.com/pmndrs/zustand)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

🌐 **Live Demo**  
🔗 [[https://mini-movie-app-brown.vercel.app](https://mini-movie-app-sage.vercel.app/)]

---

## 🚀 Features

- 🔍 **Real-time Movie Search** with Debounce  
- ❤️ **Favorite Movies** with Persistence using Zustand + localStorage  
- 📽️ **Movie Details Page** with Director, Cast, and Official Trailer  
- 🎨 **Animated UI** using Framer Motion  
- ⚙️ **Lazy Loading** and Intersection Observer for Performance  
- 🧠 **Fully Typed** with TypeScript  
- 🌈 **Responsive Design** with custom CSS  
- 🔒 **Accessible** and semantic HTML structure  
- ✨ **SEO Optimized** using SSR and Dynamic Metadata

---

## 📦 Tech Stack

- **Next.js 14 (App Router + SSR)**
- **Zustand** for Global State Management
- **TMDb API** for movie data
- **Framer Motion** for animations
- **Sonner** for toast notifications
- **Vercel** for deployment
- **TypeScript** for type safety

---

## 📁 Folder Structure

```
.
├── app/
│   ├── page.tsx                 # Homepage
│   ├── movies/page.tsx          # Movies Listing
│   ├── movie/[id]/page.tsx      # Movie Details Page
│   ├── favorites/page.tsx       # Favorite Movies Page
├── components/
│   ├── Card.tsx                 # Movie Card with hover logic
├── store/
│   ├── favoriteContext.ts       # Zustand favorite store
│   ├── searchContext.ts         # Zustand search store
├── styles/                      # Custom CSS files
```

---

## 🛠️ Installation & Setup

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/mini-movie-app.git
cd mini-movie-app
```

### 2. Install dependencies:

```bash
bun install   # or npm install / yarn install
```

### 3. Create `.env.local` file:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
```

### 4. Run development server:

```bash
bun dev   # or npm run dev / yarn dev
```

### 5. Open in Browser:

```
http://localhost:3000
```

---

## ✅ Roadmap

- [x] Trailer embedding on details page  
- [x] Framer motion transitions  
- [x] Zustand devtools integration  
- [ ] Theme switcher (light/dark mode)  
- [ ] Advanced filtering & genre sorting  
- [ ] Pagination or infinite scroll

---


## 🙌 Credits

- Movie data powered by [The Movie Database (TMDb)](https://www.themoviedb.org/)
- Icons from custom SVG & [Lucide](https://lucide.dev)

---

> Built with 💻 by [Nour Hesham](https://github.com/Nour-2003)
