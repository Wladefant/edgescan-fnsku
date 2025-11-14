# EdgeScan FNSKU

[cloudflarebutton]

A professional, mobile-first web application for rapid Amazon FNSKU barcode scanning and warehouse inventory management, optimized for speed and efficiency on the edge.

## About The Project

EdgeScan FNSKU is a professional, high-performance, mobile-first web application designed to streamline Amazon FNSKU inventory management in warehouse environments. Built on Cloudflare's edge network, it offers instantaneous, continuous barcode scanning directly in the browser.

The core workflow allows warehouse staff to scan an FNSKU barcode, which immediately triggers a modal to assign a local warehouse SKU. This process is optimized for speed and hands-free operation, minimizing interruptions. The application features a real-time list of all scanned items with robust search and filtering, a data-rich analytics dashboard to visualize scanning activity, and a one-click CSV export for seamless integration with external inventory systems. The entire experience is wrapped in a clean, minimalist, and distraction-free UI, adhering to Amazon's branding for a professional feel, ensuring maximum efficiency and minimal user error.

## Key Features

- **Continuous Barcode Scanning**: High-performance, in-browser scanning using `@zxing/library`.
- **Mobile-First UI**: A distraction-free interface optimized for handheld devices in a warehouse setting.
- **Instant SKU Assignment**: A streamlined modal-based workflow for assigning local SKUs to scanned FNSKUs.
- **Real-time Inventory List**: View, search, and filter all scanned items instantly.
- **Analytics Dashboard**: Visualize scanning activity with charts for daily scans and unique item distribution.
- **CSV Export**: Easily export all inventory data for use in other systems.
- **Professional Branding**: A clean UI themed with Amazon's brand colors for a familiar and professional experience.

## Technology Stack

- **Frontend**:
  - React & TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui
  - Zustand for state management
  - TanStack Query for server state
  - Recharts for charts
  - `@zxing/library` for barcode scanning
- **Backend**:
  - Cloudflare Workers
  - Hono
- **Database**:
  - Cloudflare Durable Objects
- **Tooling**:
  - Bun
  - Wrangler CLI

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/edgescan_fnsku.git
    cd edgescan_fnsku
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```sh
    bun install
    ```

## Development

To run the application locally, which starts both the Vite frontend development server and the Wrangler development server for the backend worker, use the following command:

```sh
bun dev
```

The frontend will be available at `http://localhost:3000` (or the next available port), and it will automatically proxy API requests to the Cloudflare Worker running locally.

## Deployment

This application is designed to be deployed to Cloudflare's global network.

1.  **Login to Wrangler:**
    First, ensure you are logged into your Cloudflare account.
    ```sh
    bunx wrangler login
    ```

2.  **Deploy the application:**
    The `deploy` script will build the frontend application and deploy it along with the worker to Cloudflare.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[cloudflarebutton]

## Project Structure

-   `src/`: Contains the frontend React application.
    -   `pages/`: Main views of the application (Scanner, Inventory, Analytics).
    -   `components/`: Reusable UI components.
    -   `hooks/`: Custom React hooks.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the backend Cloudflare Worker code built with Hono.
-   `shared/`: TypeScript types and interfaces shared between the frontend and backend.