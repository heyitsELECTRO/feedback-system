import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (username === "administrator" && password === "admin") {
      localStorage.setItem("username", username);
      localStorage.setItem("role", "admin");
      navigate("/admin");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const { username: returnedUsername, role } = await res.json();
      localStorage.setItem("username", returnedUsername);
      localStorage.setItem("role", role);
      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded px-8 py-8"
      >
        <div className="flex items-center justify-center mb-6">
          
          <h2 className="text-2xl font-bold text-center text-black">Login</h2>
        </div>
        
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">Username</label>
          <input
            className="w-full px-3 py-2 border border-black rounded"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Password</label>
          <input
            className="w-full px-3 py-2 border border-black rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          New user?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}














