import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate=useNavigate();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:7173/api/user/register",
        form
      );

      setMessage("Registration successful ✅");

      // Optional: auto redirect to login
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage("Registration failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleRegister}>
        <h2 style={styles.title}>Register</h2>

        {message && <p style={styles.message}>{message}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Register
        </button>
        <p style={styles.linkText}>
  Already have an account?{" "}
  <span style={styles.link} onClick={() => navigate("/")}>
    Login here
  </span>
</p>
      </form>
    </div>
  );
};

export default Register;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #43e97b, #38f9d7)",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    background: "#43e97b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    marginBottom: "10px",
  },
};
