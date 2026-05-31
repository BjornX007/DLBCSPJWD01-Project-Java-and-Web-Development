import "@/styles/globals.css";
import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import Header from "@/components/Header"; // adjust path if needed
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <div className="bg-gray-600 text-black">
        <Header />
      </div>

        <Component {...pageProps} />
      <CartDrawer />
    </CartProvider>
  );
}
