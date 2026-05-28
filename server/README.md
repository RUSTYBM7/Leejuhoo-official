# Lee Juhoo Backend Server

Express.js backend server for email functionality on the Lee Juhoo website.

## Features

- **POST /api/confirm-role**: Send role confirmation emails
- **GET /api/health**: Health check endpoint
- Security: Helmet, CORS, rate limiting
- Gmail SMTP integration via Nodemailer

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables in `.env`:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   PORT=3001
   FRONTEND_URL=https://your-frontend-url.com
   ```

## Gmail App Password Setup

1. Go to Google Account Settings
2. Navigate to Security > 2-Step Verification (enable if not already)
3. Go to App passwords (under 2-Step Verification)
4. Select "Mail" and "Other (Custom name)"
5. Enter "Lee Juhoo Server" as the name
6. Copy the 16-character password
7. Use this as `GMAIL_APP_PASSWORD`

## Running Locally

```bash
npm run dev   # Development with auto-reload
npm start    # Production
```

## API Endpoints

### POST /api/confirm-role

Send role confirmation email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Editor-in-Chief",
  "message": "Optional message"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Your role confirmation has been sent successfully!"
}
```

**Error Response:**
```json
{
  "error": "Name, email, and role are required."
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-28T16:00:00.000Z"
}
```

## Deploy to Render

1. Fork this repository to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" > "Blueprint"
4. Connect your GitHub repo
5. Add environment variables:
   - `GMAIL_USER`: your-gmail@gmail.com
   - `GMAIL_APP_PASSWORD`: your-app-password
6. Click "Apply"

The server will be deployed to: `https://leejuhoo-server.onrender.com`

## Security

- Rate limited: 5 requests per 15 minutes per IP
- Helmet.js for HTTP headers security
- Input sanitization
- Email validation
