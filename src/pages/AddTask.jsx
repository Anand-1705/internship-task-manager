import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      completed: false,
    };

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));

    navigate("/");
  };

  return (
    <div className="container">
      <h2>Add New Task</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default AddTask;
