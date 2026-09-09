# NIRIKSHIQ

Satellite intelligence dashboard for searching, discovering, and reviewing
changes in satellite imagery. The interface is built as a responsive React
single-page application with a dark, data-focused visual design.

## Features

- **Semantic Search** - Search satellite observations using natural-language
  queries such as "Find newly developed roads".
- **Change Analysis** - Inspect detected sites and compare before/after
  observations.
- **Satellite Map** - Explore detected locations and select a site for review.
- **Image Comparison** - View the before layer, after layer, or use the swipe
  comparison control.
- **Temporal Analysis** - Review multi-temporal observations and confidence
  progression.
- **Change Discovery** - Browse a summary table of detected changes and their
  priorities.

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide React icons

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Getting Started

Clone the repository and install the dependencies:

```bash
git clone https://github.com/kesav266/NiriskIQ.git
cd NiriskIQ
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173/`.

> Do not open `index.html` directly with a `file://` URL. It loads
> `src/main.tsx`, which must be compiled by Vite before the browser can run it.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Type-check and create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |

To test the production build locally:

```bash
npm run build
npm run preview
```

## Project Structure

```text
.
├── index.html                  # Vite HTML entry point
├── src/
│   ├── main.tsx                # React application entry point
│   ├── App.tsx                 # Main dashboard and application state
│   ├── index.css               # Global styles and Tailwind imports
│   └── components/
│       ├── SatelliteMap.tsx    # Site map and markers
│       └── SatelliteImageViewer.tsx
├── public/                     # Static assets, when present
├── vite.config.ts              # Vite and GitHub Pages configuration
└── .github/workflows/
    └── deploy-pages.yml        # GitHub Pages deployment workflow
```

## Deploying to GitHub Pages

This repository includes a GitHub Actions workflow that builds and deploys
the `dist/` directory whenever changes are pushed to `main`.

1. Push the project to the `main` branch.
2. In GitHub, open **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. Wait for the workflow to finish.

The site is available at:

```text
https://kesav266.github.io/NiriskIQ/
```

The Vite base path is configured for the repository name during production
builds. If the repository is renamed, update `base` in `vite.config.ts` and
the URL above.

## Development Notes

The current dashboard is a front-end demonstration. Search results, map
locations, imagery, and temporal observations are represented by application
data in the React code; no external satellite API or backend service is
required to run it.

## License

No license has been specified for this project yet.
