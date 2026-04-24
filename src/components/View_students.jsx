import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    id:"",
    admno: "",
    name: "",
    age: "",
    course: "",
    mark: "",
    imageUrl: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const API = "https://localhost:7173/api/students";

  const config = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // 📥 Load students
  const loadStudents = async () => {
    try {
      const res = await axios.get(API, config());
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // 🧠 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add
  const handleAdd = async () => {
    try {
      const payload = {
        admno: Number(form.admno),
        name: form.name,
        age: Number(form.age),
        course: form.course,
        mark: Number(form.mark),
        imageUrl: form.imageUrl,
      };

      await axios.post(API, payload, config());
      loadStudents();
      clearForm();
      setShowForm(false);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ✏️ Edit
  const handleEdit = (s) => {
    setForm(s);
    setIsEdit(true);
    setShowForm(true);
  };

  // 💾 Update
  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/${form.id}`, form, config());
      loadStudents();
      clearForm();
      setIsEdit(false);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };



  const confirmDelete = async () => {
  try {
    await axios.delete(`${API}/${selectedId}`, config());
    loadStudents();
    setShowDeleteModal(false);
    setSelectedId(null);
  } catch (err) {
    console.error(err);
  }
};

  // 🔄 Clear form
  const clearForm = () => {
    setForm({
      id:"",
      admno: "",
      name: "",
      age: "",
      course: "",
      mark: "",
      imageUrl: "",
    });
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2> Student Management</h2>

        <div>
          <button
            style={styles.addMainBtn}
            onClick={() => {
              setShowForm(!showForm);
              setIsEdit(false);
              clearForm();
            }}
          >
             Add Student
          </button>

          <button
            style={styles.logout}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div style={styles.formCard}>
          <h3>{isEdit ? " Edit Student" : "Add Student"}</h3>

          <div style={styles.formGrid}>
            <input style={styles.input} type="number" name="admno" placeholder="Adm No" value={form.admno} onChange={handleChange} /> 
            <input style={styles.input} name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input style={styles.input} type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} />
            <input style={styles.input} name="course" placeholder="Course" value={form.course} onChange={handleChange} />
            <input style={styles.input} type="number" name="mark" placeholder="Mark" value={form.mark} onChange={handleChange} />
            <input style={styles.input} name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
          </div>

          <div style={{ marginTop: "10px" }}>
            {isEdit ? (
              <button style={styles.updateBtn} onClick={handleUpdate}>Update</button>
            ) : (
              <button style={styles.addBtn} onClick={handleAdd}>Add</button>
            )}
          </div>
        </div>
      )}

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Image</th>
            <th style={styles.th}>Adm No</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Course</th>
            <th style={styles.th}>Mark</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.admno}>
              <td style={styles.td}>
                <img
                  src={s.imageUrl || "https://via.placeholder.com/50"}
                  style={styles.avatar}
                  alt=""
                />
              </td>
              <td style={styles.td}>{s.admno}</td>
              <td style={styles.td}>{s.name}</td>
              <td style={styles.td}>{s.age}</td>
              <td style={styles.td}>{s.course}</td>
              <td style={styles.td}>{s.mark}</td>

              <td style={styles.td}>
                <div style={styles.actionContainer}>
                <button style={styles.iconEdit} onClick={() => handleEdit(s)}>
  <FontAwesomeIcon icon={faPen} />
</button>

<button
  style={styles.iconDelete}
  onClick={() => {
    setSelectedId(s.id);
    setShowDeleteModal(true);
  }}
>
  <FontAwesomeIcon icon={faTrash} />
</button>
</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDeleteModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalBox}>
      <h3>⚠️ Confirm Delete</h3>
      <p>Are you sure you want to delete this student?</p>

      <div style={styles.modalActions}>
        <button style={styles.confirmBtn} onClick={confirmDelete}>
          Yes, Delete
        </button>

        <button
          style={styles.cancelBtn}
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Students;

const styles = {
  container: {
    padding: "30px",
    background: "#eef2f7",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  addMainBtn: {
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    marginRight: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  logout: {
    background: "#e53935",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  formCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  // 👇 FORM GRID FIX (NOT SINGLE LINE)
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginTop: "15px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  addBtn: {
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
  },

  updateBtn: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  th: {
    background: "#1976d2",
    color: "#fff",
    padding: "12px",
    textAlign: "center",
    border: "1px solid #ddd",
  },

  td: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #eee",
  },

  row: {
    transition: "0.2s",
  },

  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  iconEdit: {
  background: "#FFC107",
  border: "none",
  borderRadius: "50%",
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
},

iconDelete: {
  background: "#E53935",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
},

actionContainer: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",   // space between buttons
},

modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
},

modalBox: {
  background: "#fff",
  padding: "25px",
  borderRadius: "10px",
  width: "300px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
},

modalActions: {
  marginTop: "20px",
  display: "flex",
  justifyContent: "space-around",
},

confirmBtn: {
  background: "#e53935",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
},

cancelBtn: {
  background: "#6c757d",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
},

};
