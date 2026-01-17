import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
    //React Router helps navigate between pages without refreshing the browser
function TaskList() {
    //I used useState to store and update task data dynamically in the UI.
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");//to store what user types in search box
  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light");//adding theme

  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState({
  title: "",
  description: "",
  });
  //Adding edit button
  useEffect(() => {//I used useEffect to load tasks from Local Storage when the component mounts"
    document.body.className = theme;
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = savedTasks.map((task) => ({
    ...task,
    createdAt: task.createdAt || new Date().toISOString(),
  }));

  setTasks(updatedTasks);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}, [theme]);

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
      //Dropdown
      const handleSortChange = (e) => {
      const value = e.target.value;

      if (value === "newest") {
        sortByNewest();
      } else if (value === "oldest") {
        sortByOldest();
      } else if (value === "status") {
        sortByStatus();
      }
    };
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

     //Task status like Completed or Pending is shown using conditional rendering
  return (
    <div className="container">
      <h1>Internship Task Manager</h1>

      <Link to="/add" className="add-btn">
        + Add New Task
      </Link>
      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      {/*sort dropdown menu*/}
    <div style={{ marginBottom: "15px" }}>
      <label style={{ marginRight: "8px", fontWeight: "bold" }}>
        Sort by:
      </label>

      <select onChange={handleSortChange}>
        <option value="">Select</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="status">Status</option>
      </select>
    </div>
      <button //to add dark theme button
        className="complete-btn"
        onClick={() => {
          const newTheme = theme === "light" ? "dark" : "light";
          setTheme(newTheme);
          localStorage.setItem("theme", newTheme);
        }}
        style={{ marginBottom: "15px" }}
      >
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
      {tasks.length === 0 && <p>No tasks added yet.</p>}

      {filteredTasks.map((task, index) => (
        <div key={index} className="task">
        {/* add edit task */}
         {editIndex === index ? (
        <>
          <input
            type="text"
            value={editTask.title}
            onChange={(e) =>
              setEditTask({ ...editTask, title: e.target.value })
            }
          />

          <textarea
            value={editTask.description}
            onChange={(e) =>
              setEditTask({ ...editTask, description: e.target.value })
            }
          />
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </>
      )}

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
            {/*adding edit button */}       
             {editIndex === index ? (
              <>
                <button
                  className="complete-btn"
                  onClick={() => {
                    const updatedTasks = [...tasks];
                    updatedTasks[index] = {
                      ...updatedTasks[index],
                      title: editTask.title,
                      description: editTask.description,
                    };
                    setTasks(updatedTasks);
                    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                    setEditIndex(null);
                  }}
                >
                  Save
                </button>

                <button
                  className="delete-btn"
                  onClick={() => setEditIndex(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="complete-btn"
                onClick={() => {
                  setEditIndex(index);
                  setEditTask({
                    title: task.title,
                    description: task.description,
                  });
                }}
              >
                Edit
              </button>
            )}

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
