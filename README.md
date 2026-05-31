Online Bicycle Shop — Full Stack Web Application

A full-stack e-commerce web application for selling bicycles, built for **Project Java and Web Development (DLBCSPJWD01)**.

The platform consists of two separate Next.js applications:
- **Customer Shop** — browse products, manage a cart, and complete purchases
- **Admin Panel** — manage products, view orders, and configure the storefront

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React), Tailwind CSS |
| Backend | Node.js, Express (via Next.js API routes) |
| Database | MongoDB (Atlas) |
| Authentication | NextAuth.js with Google OAuth |
| Payments | Stripe Payments API |
| Image Storage | Cloudinary |

---

## Project Structure

```
/
├── Online-Shop-CLient/          # Customer-facing shop application
└── online-shop-admin/    # Admin panel application
```

---

## Prerequisites

Make sure the following are installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [Yarn](https://yarnpkg.com/) package manager
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account and cluster
- A [Stripe](https://stripe.com) account (test mode is sufficient)
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials
- A [Cloudinary](https://cloudinary.com/) account

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/BjornX007/DLBCSPJWD01-Project-Java-and-Web-Development.git
cd Project-Java-and-Web-Development
```

---

### 2. Set up the Customer Shop

```bash
cd Online-Shop-Client
yarn install
```

Create a `.env.local` file in the `Online-Shop-Client` directory:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=shopdb

STRIPE_SECRET_KEY=your_stripe_secret_key

```

Start the development server:

```bash
yarn dev
```

The shop will be available at **http://localhost:3000**

---

### 3. Set up the Admin Panel

Open a new terminal:

```bash
cd online-shop-admin
yarn install
```

Create a `.env.local` file in the `online-shop-admin` directory with the same variables as above:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=shopdb

NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

CLOUDINARY_URL=your_cloudinary_url
```

Start the admin development server on a different port:

```bash
yarn dev -p 3001
```

The admin panel will be available at **http://localhost:3001**

---

## Admin Access

The admin panel is protected by Google OAuth. Only the Google account configured during setup will be granted access.

To log in:
1. Navigate to **http://localhost:3001**
2. Click "Sign in with Google"
3. Use the authorized Google account

---

## Key Features

**Customer Shop**
- Browse and search bicycle products
- Filter by category
- Add items to cart and checkout securely via Stripe
- Responsive layout for desktop and mobile

**Admin Panel**
- Add, edit, and delete products with image upload via Cloudinary
- View and manage customer orders
- Mark orders as shipped
- Edit homepage hero section (image, title, description)
- View Stripe sales statistics and order metrics

---

## Database

The application uses **MongoDB Atlas**. The following collections are used:

| Collection | Description |
|---|---|
| `products` | Bicycle product listings |
| `orders` | Customer orders placed via checkout |
| `settings` | Site configuration (e.g give access to a new admin)|

---

## Notes

- Both apps share the same MongoDB database and Stripe account
- Cloudinary is used for all product and hero image uploads
- Stripe is running in **test mode** — use test card `4242 4242 4242 4242` for checkout
