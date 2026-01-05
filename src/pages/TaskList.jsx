import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  const toggleStatus = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return (
    <div className="container">
      <h1>Internship Task Manager</h1>

      <Link to="/add" className="add-btn">
        + Add New Task
      </Link>

      {tasks.length === 0 && <p>No tasks added yet.</p>}

      {tasks.map((task, index) => (
        <div key={index} className="task">
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <span
            className={`status ${
              task.completed ? "completed" : "pending"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>

          <div className="task-buttons">
            <button
              className="complete-btn"
              onClick={() => toggleStatus(index)}
            >
              {task.completed ? "Undo" : "Mark Complete"}
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteTask(index)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
