import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-sm mb-4">
      {/* Logo (optional, import yours if you have one) */}
      <div className="flex items-center space-x-2">
        {/* Replace with your actual Logo component if you have one */}
        {/* <Logo /> */}
        <span className="font-bold text-black text-lg">FeEdBack</span>
      </div>
      <div className="flex space-x-4">
        <Link to="/history" className="text-black hover:underline">History</Link>
        <Link to="/login" className="text-black hover:underline">Logout</Link>
      </div>
    </nav>
  );
}
