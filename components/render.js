import React, { useEffect, useState } from "react";
import "./render.css";
import { MdClose } from "react-icons/md";
import axios from "axios";

function Render() {
  const [addSection, setAddSection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [dataList, setDataList] = useState([]);
  const [editing, setEditing] = useState(null);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
     ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("http://localhost:8080/create", formData);

    console.log(data);
    if (data.data.success) {
      setAddSection(false);
      alert(data.data.message);
      getFetchData();
    }
  };

  const handleEdit = async (id) => {
    setEditing(id);
    const data = await axios.get(`http://localhost:8080/${id}`);
    setFormData(data.data);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put(`http://localhost:8080/edit/${editing}`, formData);

    console.log(data);
    if (data.data.success) {
      setEditing(null);
      alert(data.data.message);
      getFetchData();
    }
  };

  const handleDelete = async (id) => {
    const data = await axios.delete(`http://localhost:8080/delete/${id}`);

    console.log(data);
    if (data.data.success) {
      alert(data.data.message);
      getFetchData();
    }
  };

  const getFetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/");
      console.log(response.data);
      if (response.data.success) {
        setDataList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  console.log(dataList);

  return (
    <div className="rendered-data">
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>
          Add Tasks
        </button>

        {addSection && (
          <div className="addContainer">
            <form onSubmit={handleSubmit}>
              <div className="close-btn" onClick={() => setAddSection(false)}>
                <MdClose />
              </div>

              <label htmlFor="name">Name:</label>
<input
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
              ></input>

              <label htmlFor="email">Task:</label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={handleChange}
              ></input>

              <label htmlFor="mobile">Hours:</label>
              <input
                type="number"
                id="mobile"
                name="mobile"
                onChange={handleChange}
              ></input>

              <button className="btn">Submit</button>
            </form>
          </div>
        )}

        {editing && (
          <div className="editContainer">
            <form onSubmit={handleUpdate}>
              <div className="close-btn" onClick={() => setEditing(null)}>
                <MdClose />
              </div>

              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                value={formData.name}
              ></input>

              <label htmlFor="email">Task:</label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
              ></input>

              <label htmlFor="mobile">Hours:</label>
              <input
                type="number"
                id="mobile"
                name="mobile"
                onChange={handleChange}
                value={formData.mobile}
              ></input>

              <button className="btn">Update</button>
            </form>
          </div>
        )}

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Task One</th>
                <th>Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((el) => {
                return (
                  <tr>
                    <td>{el.name}</td>
                    <td>{el.email}</td>
                    <td>{el.mobile}</td>
                    <td>
  <button onClick={() => handleEdit(el._id.toString())}>Edit</button>
  <button onClick={() => handleDelete(el._id.toString())}>Delete</button>
</td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Render;