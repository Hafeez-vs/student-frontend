import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const navigate=useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

//   console.log("Sending:", form); // 🔍 DEBUG

  try {
    const res = await axios.post(
      "https://localhost:7173/api/user/login",
      {
        username: form.username,
        password: form.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("Response:", res.data);

    localStorage.setItem("token", res.data.token);
    navigate("/students");


  } catch (err) {
  console.log("FULL ERROR:", err);
  console.log("BACKEND MESSAGE:", err.response?.data);
  alert(JSON.stringify(err.response?.data));
}
  }

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h2 style={styles.title}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

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
          Login
        </button>
        <p style={styles.linkText}>
  Don't have an account?{" "}
  <span style={styles.link} onClick={() => navigate("/register")}>
    Register here
  </span>
</p>
      </form>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
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
    background: "#4facfe",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center",
  },
};
