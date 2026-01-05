import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
    //React Router helps navigate between pages without refreshing the browser
function TaskList() {
    //I used useState to store and update task data dynamically in the UI.
  const [tasks, setTasks] = useState([]);
    //I used useEffect to load tasks from Local Storage when the component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = savedTasks.map((task) => ({
    ...task,
    createdAt: task.createdAt || new Date().toISOString(),
  }));

  setTasks(updatedTasks);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
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

  // SORTING FUNCTIONS 
  const sortByNewest = () => {
    const sorted = [...tasks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setTasks(sorted);};

  const sortByOldest = () => {
    const sorted = [...tasks].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    setTasks(sorted); };

  const sortByStatus = () => {
    const sorted = [...tasks].sort(
      (a, b) => a.completed - b.completed
    );
    setTasks(sorted);};

     //Task status like Completed or Pending is shown using conditional rendering
  return (
    <div className="container">
      <h1>Internship Task Manager</h1>

      <Link to="/add" className="add-btn">
        + Add New Task
      </Link>

       {/* SORT BUTTONS */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={sortByNewest} className="complete-btn">
          Newest
        </button>
        <button onClick={sortByOldest} className="complete-btn">
          Oldest
        </button>
        <button onClick={sortByStatus} className="complete-btn">
          By Status
        </button>
      </div>

      {tasks.length === 0 && <p>No tasks added yet.</p>}

      {tasks.map((task, index) => (
        <div key={index} className="task">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        {/*To show time on the task card*/}
          <p style={{ fontSize: "12px", color: "#777" }}>
            Added on: {new Date(task.createdAt).toLocaleString()}
          </p>

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
