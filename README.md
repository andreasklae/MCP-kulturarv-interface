# Kulturarv Chat

A minimal chat interface for exploring Norwegian cultural heritage using AI-powered search across Riksantikvaren, Wikipedia, and Store norske leksikon.

## Features

- 🏛️ **Multiple Sources**: Query Wikipedia, Store norske leksikon (SNL), and Riksantikvaren's cultural heritage database
- 🔐 **Token Authentication**: Secure access via Bearer token
- 💬 **Conversational AI**: Natural language questions with context-aware responses
- 🎨 **Norwegian-inspired Design**: Dark theme with fjord colors

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in `dist/`.

## Deployment

This app is designed to be deployed to GitHub Pages. The `dist/` folder contains static files that can be served from any static hosting service.

### GitHub Pages Setup

1. Build the app: `npm run build`
2. Push to the `gh-pages` branch, or configure GitHub Actions for automatic deployment

## Usage

1. **Get an Access Token**: Contact the administrator to obtain a valid access token
2. **Enter Token**: On the login screen, enter your access token
3. **Select Sources**: Toggle which data sources to include in searches
4. **Ask Questions**: Type your question about Norwegian cultural heritage and press Enter

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- No additional runtime dependencies

## API

This frontend connects to the Kulturarv MCP Server API:

- **Chat endpoint**: `POST /api/chat`
- **Status endpoint**: `GET /api/chat/status`

Authentication is required via `Authorization: Bearer <token>` header.

## License

MIT
