# Game Merch Sales Site

A React single page application for browsing and purchasing game-themed merchandise. Inventory and order placement are handled by a REST API.

## Tech Stack

- React 19
- React Router
- Vite
- ESLint

## Prerequisites

- Node.js 20 or later
- npm 10 or later

## Getting Started

Clone the repository:

```bash
git clone https://github.com/wang2989/game-merch-sales-site.git
cd game-merch-sales-site
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal (typically `http://localhost:5173`).

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Features

- Browse inventory loaded from the API, with category filters
- Shopping cart with quantity limits based on stock
- Checkout flow: payment, shipping, review, and confirmation
- Order submission with confirmation number display

## API

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| GET | `inventory-management/inventory` | List items (`id`, `name`, `price`, `stock`, `image`) |
| POST | `order-processing/order` | Place an order |

Order responses: `201` success, `400` missing fields, `409` out of stock, `502` inventory service unavailable.

## Project Structure

```text
src/
  components/   Page and UI components
  context/      Cart and inventory state
  data/         API request helpers
  types/        Shared item shape
```
