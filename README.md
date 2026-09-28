# EventIQ — Institutional Event Intelligence & Strategic Resource Management

EventIQ is a modern event intelligence and resource management platform designed for institutions and organizations.

## Design System Tokens

### Official Color Palette
- **Warm Cream**: `#F7F1E8` (Background)
- **Ivory**: `#FFFDF8` (Surface / Cards)
- **Burgundy**: `#6E1F2A` (Primary Brand Color)
- **Dark Burgundy**: `#4A1420`
- **Secondary Burgundy**: `#8E3A46`
- **Soft Burgundy**: `#E8CDD0`
- **Espresso**: `#24191A` (Primary Text)
- **Warm Gray**: `#756A68` (Muted Text)
- **Beige**: `#E5D9CC` (Borders)
- **Muted Olive**: `#66745A` (Success)
- **Warm Ochre**: `#B68132` (Warning)
- **Muted Red**: `#A63D40` (Critical / Error)

### Typography Architecture
- **Primary UI Font**: `Outfit` (Headings, Body text, Navigation, Buttons, Forms, Cards)
- **Data / Analytics Font**: `Space Grotesk` (Large numbers, Metrics, Statistics, Percentages, Charts)

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM v6
- **Icons**: Lucide React Icons
- **Charts**: Recharts
- **API Client**: Native Fetch-based client configured for future FastAPI integration (`src/services/apiClient.js`)

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Production build check
npm run build
```
