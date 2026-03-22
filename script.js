// --- Select DOM elements ---
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");

// --- Default tasks for first-time visitors ---
const defaultTasks = [
    "Read book",
    "Complete coding practice",
    "Google meet"
];

// --- Load tasks from localStorage or use defaults ---
let tasks = JSON.parse(localStorage.getItem("tasks"));
if (!tasks || tasks.length === 0) {
    const defaultTasks = [
        "Read book",
        "Complete coding practice",
        "Google meet"
    ];
    tasks = defaultTasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Render tasks in UI ---
function renderTasks() {
    taskList.innerHTML = ""; // clear list
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item";

        // Task text span
        const span = document.createElement("span");
        span.textContent = task;
        li.appendChild(span);

        // Click text to mark complete
        span.addEventListener("click", () => {
            li.classList.toggle("completed");
            updateProgress();
        });

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.marginLeft = "10px";
        editBtn.style.cursor = "pointer";
        editBtn.addEventListener("click", () => {
            const newTask = prompt("Edit your task:", task);
            if (newTask !== null && newTask.trim() !== "") {
                tasks[index] = newTask.trim();
                updateTasks();
            }
        });
        li.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "5px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            updateTasks();
        });
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateProgress(); // update progress bar after rendering
}

// --- Add new task ---
addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        tasks.push(taskText);
        updateTasks();
        taskInput.value = "";
    }
});

// --- Update tasks in localStorage and re-render ---
function updateTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// --- Update progress bar ---
function updateProgress() {
    const allTasks = document.querySelectorAll(".task-item");
    const completedTasks = document.querySelectorAll(".task-item.completed");
    const progress = allTasks.length === 0 ? 0 : (completedTasks.length / allTasks.length) * 100;
    progressBar.style.width = progress + "%";
}

// --- Initial render ---
renderTasks();
