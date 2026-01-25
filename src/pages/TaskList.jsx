import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, updateTask } from "../redux/taskSlice";
import { Link } from "react-router-dom";
    //React Router helps navigate between pages without refreshing the browser
function TaskList() {
    //I used useState to store and update task data dynamically in the UI.
  const dispatch = useDispatch();                                           //redux state
  const { list: tasks, loading } = useSelector((state) => state.tasks);     //redux state

  const [searchTerm, setSearchTerm] = useState("");//to store what user types in search box
  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light");//adding theme
  const [localTasks, setLocalTasks] = useState([]);

  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState({
  title: "",
  description: "",
  });
  //Adding edit button
  useEffect(() => { //to load from api
  document.body.className = theme;
  dispatch(fetchTasks());
  }, [dispatch, theme]);
  useEffect(() => {
  setLocalTasks(tasks);
  }, [tasks]);

  const toggleStatus = (task) => {
  dispatch(
    updateTask({
      id: task.id,
      updatedData: { ...task, status: !task.status },
    })
  );
};

  const handleDelete = (id) => {
  dispatch(deleteTask(id));
};

  // SORTING FUNCTIONS 
  const sortByNewest = () => {
  const sorted = [...tasks].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });
  setLocalTasks(sorted);
  };


  const sortByOldest = () => {
  const sorted = [...tasks].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateA - dateB;
  });
  setLocalTasks(sorted);
  };


  const sortByStatus = () => {
  const sorted = [...localTasks].sort((a, b) => {
    return a.status - b.status;
  });
  setLocalTasks(sorted);
      };
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
    const filteredTasks = localTasks.filter((task) =>
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
       <div key={task.id} className="task">

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
            Added on:{" "}
            {task.createdAt
              ? new Date(task.createdAt).toLocaleString()
              : "Not available"}
          </p>


          <span
            className={`status ${
              task.status ? "completed" : "pending"
            }`}
          >
            {task.status ? "Completed" : "Pending"}
          </span>

          <div className="task-buttons">
            <button
              className="complete-btn"
              onClick={() => toggleStatus(task)}
            >
              {task.status ? "Undo" : "Mark Complete"}
            </button>
            {/*adding edit button */}       
             {editIndex === index ? (
              <>
                <button
                  className="complete-btn"
                  onClick={() => {
                    dispatch(
                      updateTask({
                        id: task.id,
                        updatedData: {
                          ...task,
                          title: editTask.title,
                          description: editTask.description,
                        },
                      })
                    );
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
              onClick={() => handleDelete(task.id)}
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
