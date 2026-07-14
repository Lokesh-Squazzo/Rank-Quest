# React + Vite + Tailwind CSS Project

A modern frontend application built with React.js, Vite, and Tailwind CSS.

## Features

- ⚡️ **Vite** - Lightning fast build tool and dev server
- ⚛️ **React 18** - Latest React with hooks and concurrent features
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📦 **Modern tooling** - ESLint, PostCSS, and more

## Getting Started

### Prerequisites

Make sure you have Node.js installed (version 16 or higher).

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
├── public/
├── src/
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS imports
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - CSS framework
- **PostCSS** - CSS processing
- **ESLint** - Code linting

## Customization

### Tailwind CSS
Edit `tailwind.config.js` to customize your design system, add custom colors, fonts, and more.

### Vite Configuration
Modify `vite.config.js` to add plugins, change build settings, or configure the dev server.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to any static hosting service.
