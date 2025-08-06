import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Для анимаций

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tasks/")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;

    fetch("http://127.0.0.1:8000/api/tasks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setNewTask(""); // очищаем поле
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleTask = (id, completed) => {
    fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    }).then(() => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
    });
  };

  const deleteTask = (id) => {
    fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800 drop-shadow">
        ✨ Todo App
      </h1>

      <div className="flex mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Новая задача..."
          className="border p-3 rounded-l-md w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={addTask}
          className="bg-purple-500 text-white px-5 rounded-r-md hover:bg-purple-600 transition"
        >
          Добавить
        </button>
      </div>

      <ul className="w-80 space-y-2">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <span
                className={`cursor-pointer transition ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
                onClick={() => toggleTask(task.id, task.completed)}
              >
                {task.title}
              </span>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default App;
