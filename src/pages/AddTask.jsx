import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/taskSlice";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
  e.preventDefault();

  await dispatch(
    addTask({
      title,
      description,
      status: false,
      createdAt: new Date().toISOString(),
    })
  ).unwrap();   // waits until API finishes

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
