import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";


const API_URL = "http://localhost:4000/api"; // connect to backend server

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle sign up submissions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, password, confirmPassword } = formData;

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // Send signup request to backend
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json(); // wait for response data

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user)); // store user credentials

      navigate("/login"); // redirect to login page after successful signup
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>


        {error && <p className="signup-error">{error}</p>}


        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Create a username"
            autoComplete="username"
          />
        </div>


        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </div>


        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            autoComplete="new-password"
          />
        </div>


        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>


        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}


export default Signup;
