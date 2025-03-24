# Project Manager App

This is a mobile project management application with a Supabase backend.

## Getting Started

### Running the MCP Server (Backend)

To start the MCP server that connects to Supabase:

```
npm run mcp
```

The server runs on http://localhost:3002

### Running the Frontend

To start the frontend web application:

```
npm run web
```

To start the frontend for mobile development:

```
npm start
```

## Project Structure

- `project-manager/` - Main application code
  - `src/` - Source code
    - `server/` - MCP server code
    - `components/` - React components
    - `screens/` - Application screens
  - `supabase/` - Supabase configuration and SQL files

## Troubleshooting

If you encounter port conflicts when running the MCP server, you can modify the port in:
`project-manager/mcp-config.json` 