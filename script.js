// --- Select DOM elements ---
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");

// --- Default tasks ---
const defaultTasks = [
    "Read book",
    "Complete coding practice",
    "Google meet"
];

// --- Load tasks from localStorage or use defaults ---
let tasks = JSON.parse(localStorage.getItem("tasks")) || defaultTasks;
localStorage.setItem("tasks", JSON.stringify(tasks));

// --- Render tasks in UI ---
function renderTasks() {
    taskList.innerHTML = ""; // clear list
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item";

        // Task text span
        const span = document.createElement("span");
        span.textContent = task;
        span.style.cursor = "pointer";
        li.appendChild(span);

        // Click text to mark complete
        span.addEventListener("click", () => {
            li.classList.toggle("completed");
            updateProgress();
        });

        // Inline editing on double-click
        span.addEventListener("dblclick", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = tasks[index];
            input.style.width = "60%";
            input.style.marginRight = "5px";

            li.insertBefore(input, span);
            li.removeChild(span);
            input.focus();

            // Save on Enter or blur
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") saveEdit(input, index, li);
            });
            input.addEventListener("blur", () => saveEdit(input, index, li));
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            updateTasks();
        });
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateProgress();
}

// --- Save inline edit ---
function saveEdit(input, index, li) {
    const newValue = input.value.trim();
    if (newValue !== "") {
        tasks[index] = newValue;
        updateTasks();
    } else {
        // If empty, remove the task
        tasks.splice(index, 1);
        updateTasks();
    }
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
