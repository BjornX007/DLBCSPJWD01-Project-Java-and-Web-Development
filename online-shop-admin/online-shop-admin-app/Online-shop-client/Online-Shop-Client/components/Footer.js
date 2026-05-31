import { FaFacebookF, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-6 py-10 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold mb-3">VeloHaus</h2>
          <p className="text-gray-300">
            Premium bikes for every journey. Road, mountain, city or electric – ride with passion.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-md font-semibold mb-2">Explore</h3>
          <ul className="space-y-1 text-gray-300">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/category/mountain" className="hover:text-white transition">Mountain</a></li>
            <li><a href="/category/road" className="hover:text-white transition">Road</a></li>
            <li><a href="/category/e-bike" className="hover:text-white transition">E-Bikes</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-md font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-gray-300">
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition">Returns</a></li>
            <li><a href="#" className="hover:text-white transition">Shipping</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-md font-semibold mb-2">Connect</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-300 hover:text-white transition">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 text-xs mt-10 border-t border-gray-600 pt-4">
        &copy; {new Date().getFullYear()} VeloHaus. All rights reserved.
      </div>
    </footer>
  );
}
