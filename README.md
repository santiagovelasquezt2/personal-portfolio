# Santiago Velasquez Talbott - Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.172-000000?logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

A modern, interactive personal portfolio featuring a 3D hero section with metallic text animation, project showcases with video demos, and a clean responsive design.

## ✨ Features

- **3D Interactive Hero** - Mouse-responsive metallic "SVT" letters using React Three Fiber
- **Project Showcase** - Video demos with tech stack doughnut charts
- **Custom Navigation** - Animated bubble navbar with scroll spy
- **Responsive Design** - Optimized for all screen sizes
- **Vercel Analytics** - Built-in performance tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **3D Graphics**: React Three Fiber, Three.js, React Three Drei
- **Charts**: Recharts
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/santiagovelasquezt2/personal-portfolio.git
cd personal-portfolio

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📁 Project Structure

```
├── app/
│   ├── page.tsx          # Main portfolio page
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── components/
│   ├── hero-3d.tsx       # 3D animated hero section
│   ├── navbar.tsx        # Custom navigation bar
│   ├── project-card.tsx  # Project showcase cards
│   ├── tech-stack-chart.tsx  # Doughnut chart component
│   └── ui/               # shadcn/ui components
├── public/
│   ├── profile.jpg       # Profile image
│   ├── fonts/            # Custom fonts
│   └── projects/         # Project demo videos
└── styles/
```

## 📦 Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ by Santiago Velasquez Talbott
