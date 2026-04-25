import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    id: "",
    admno: "",
    name: "",
    age: "",
    course: "",
    mark: "",
  });

  const [file, setFile] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

const [profile, setProfile] = useState({
  currentUsername: "",
  currentPassword: "",
  newUsername: "",
  newPassword: "",
});

  const API = "https://localhost:7173/api/students";

  const config = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get(API, config());
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
  setProfile({ ...profile, [e.target.name]: e.target.value });
};

  const handleAdd = async () => {
    try {
      const formData = new FormData();

      formData.append("admno", form.admno);
      formData.append("name", form.name);
      formData.append("age", form.age);
      formData.append("course", form.course);
      formData.append("mark", form.mark);

      if (file) formData.append("imageFile", file);

      await axios.post(API, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      loadStudents();
      clearForm();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleUserUpdate = async () => {
  try {
    if (!profile.currentPassword) {
      alert("Enter current password");
      return;
    }

    if (!profile.newUsername && !profile.newPassword) {
      alert("Nothing to update");
      return;
    }

    await axios.put(
      "https://localhost:7173/api/user/update-profile",
      {
        OldUsername: profile.currentUsername,
        OldPassword: profile.currentPassword,
        newUsername: profile.newUsername,
        newPassword: profile.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Profile updated. Please login again.");

    // 🔥 FORCE LOGOUT
    localStorage.removeItem("token");
    window.location.href = "/";

  } catch (err) {
    console.log(err.response?.data);
    alert("Update failed");
  }
};

  const handleEdit = (s) => {
    setForm(s);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("admno", form.admno);
      formData.append("name", form.name);
      formData.append("age", form.age);
      formData.append("course", form.course);
      formData.append("mark", form.mark);

      if (file) formData.append("imageFile", file);

      await axios.put(`${API}/${form.id}`, formData, config());

      loadStudents();
      clearForm();
      setIsEdit(false);
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${selectedId}`, config());
      loadStudents();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const clearForm = () => {
    setForm({
      id: "",
      admno: "",
      name: "",
      age: "",
      course: "",
      mark: "",
    });
    setFile(null);
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Student Management</h2>

        <div style={styles.headerButtons}>
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
  style={styles.addMainBtn}
  onClick={() => setShowProfileForm(!showProfileForm)}
>
  Update Profile
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
          <h3>{isEdit ? "Edit Student" : "Add Student"}</h3>

          <div style={styles.formGrid}>
            <input style={styles.input} name="admno" placeholder="Adm No" value={form.admno} onChange={handleChange} />
            <input style={styles.input} name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input style={styles.input} name="age" placeholder="Age" value={form.age} onChange={handleChange} />
            <input style={styles.input} name="course" placeholder="Course" value={form.course} onChange={handleChange} />
            <input style={styles.input} name="mark" placeholder="Mark" value={form.mark} onChange={handleChange} />

            <input style={styles.input} type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}

          <div style={{ marginTop: "10px" }}>
            {isEdit ? (
              <button style={styles.updateBtn} onClick={handleUpdate}>
                Update
              </button>
            ) : (
              <button style={styles.addBtn} onClick={handleAdd}>
                Add
              </button>
            )}
          </div>
        </div>
      )}

      {showProfileForm && (
  <div style={styles.formCard}>
    <h3>Update Profile</h3>

    <div style={styles.formGrid}>
      <input
        style={styles.input}
        name="currentUsername"
        placeholder="Current Username"
        value={profile.currentUsername}
        onChange={handleProfileChange}
      />

      <input
        style={styles.input}
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        value={profile.currentPassword}
        onChange={handleProfileChange}
      />

      <input
        style={styles.input}
        name="newUsername"
        placeholder="New Username (optional)"
        value={profile.newUsername}
        onChange={handleProfileChange}
      />

      <input
        style={styles.input}
        type="password"
        name="newPassword"
        placeholder="New Password (optional)"
        value={profile.newPassword}
        onChange={handleProfileChange}
      />
    </div>

    <div style={{ marginTop: "10px" }}>
      <button style={styles.updateBtn} onClick={handleUserUpdate}>
        Update Profile
      </button>
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
            <tr key={s.id}>
              <td style={styles.td}>
                <img
                  src={`https://localhost:7173${s.imageUrl}`}
                  style={styles.avatar}
                  onMouseEnter={() => setHoveredImage(s.imageUrl)}
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

      {/* IMAGE POPUP (FIXED NO BLINK) */}
      {hoveredImage && (
        <div
          style={styles.overlay}
          onMouseLeave={() => setHoveredImage(null)}
        >
          <div
            style={styles.imagePopup}
            onMouseEnter={(e) => e.stopPropagation()}
          >
            <img
              src={`https://localhost:7173${hoveredImage}`}
              style={styles.popupImage}
              alt=""
            />
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3>Confirm Delete</h3>
            <p>Are you sure?</p>

            <div style={styles.modalActions}>
              <button style={styles.confirmBtn} onClick={confirmDelete}>
                Yes
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
  container: { padding: "30px", background: "#eef2f7", minHeight: "100vh" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ✅ spacing between buttons
  headerButtons: {
    display: "flex",
    gap: "10px",
  },

  addMainBtn: {
    background: "#4CAF50",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",              // ✅ removed border
    cursor: "pointer",
    fontWeight: "600",
  },

  logout: {
    background: "#e53935",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",              // ✅ removed border
    cursor: "pointer",
    fontWeight: "600",
  },

  formCard: {
    background: "#fff",
    padding: "20px",
    margin: "20px 0",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  // ✅ better input styling
  input: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s",
  },

  table: {
    width: "100%",
    background: "#fff",
    borderCollapse: "collapse",
    border: "1px solid #ccc",   // ✅ table border
  },

  th: {
    background: "#1976d2",
    color: "#fff",
    padding: "12px",
    border: "1px solid #ddd",   // ✅ header border
  },

  td: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #ddd",   // ✅ cell borders
  },

  // ✅ improved image look
  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #ccc",
    cursor: "pointer",
  },

  actionContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },

  iconEdit: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#FFC107",
    border: "none",              // ✅ removed border
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  iconDelete: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#E53935",
    color: "#fff",
    border: "none",              // ✅ removed border
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px)",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  imagePopup: {
    background: "#fff",
    padding: "10px",
    borderRadius: "12px",
  },

  popupImage: {
    width: "320px",
    height: "320px",
    objectFit: "cover",
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
  },

  modalBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  modalActions: {
    display: "flex",
    justifyContent: "space-around",
  },

  confirmBtn: {
    background: "red",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  },

  cancelBtn: {
    background: "gray",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  },

  addBtn: {
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
},

updateBtn: {
  background: "#1976d2",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
},
};
