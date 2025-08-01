import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      navigate("/login", { state: { success: "Signup successful! Please login." } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded px-8 py-8"
      >
        <div className="flex items-center justify-center mb-8">
          <FaUserPlus className="text-2xl text-black mr-2" />
          <h2 className="text-2xl font-bold text-center text-black">Sign Up</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-gray-100 border-l-4 border-black text-black">
            <p>{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-black font-medium mb-1">Username</label>
          <input
            className="w-full px-3 py-2 border border-black rounded bg-white text-black"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-black font-medium mb-1">Password</label>
          <input
            className="w-full px-3 py-2 border border-black rounded bg-white text-black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-black font-medium mb-1">Confirm Password</label>
          <input
            className="w-full px-3 py-2 border border-black rounded bg-white text-black"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-xs text-gray-600">Passwords don't match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-medium py-2 rounded hover:bg-gray-800 transition-colors"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-black hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}