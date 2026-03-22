const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => addTaskToDOM(task.text, task.completed));
updateProgress();

// Add new task
addBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = { text: taskText, completed: false };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    addTaskToDOM(taskText, false);
    taskInput.value = '';
    updateProgress();
});

function addTaskToDOM(text, completed) {
    const li = document.createElement('li');
    li.innerHTML = `
        ${text} 
        <div>
            <button class="edit-btn">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    if(completed) li.classList.add('completed');

    // Toggle completed status when clicking on task text
    li.addEventListener('click', (e) => {
        if(e.target.tagName !== 'BUTTON'){
            li.classList.toggle('completed');
            updateTaskStatus(text, li.classList.contains('completed'));
            updateProgress();
        }
    });

    // Edit task
    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent toggling completed
        const newText = prompt('Edit task:', text);
        if(newText && newText.trim() !== '') {
            updateTaskText(text, newText.trim());
            li.childNodes[0].textContent = newText + ' ';
            text = newText.trim(); // update reference for toggle
        }
    });

    taskList.appendChild(li);
}

// Delete task
function deleteTask(btn){
    const li = btn.parentElement.parentElement;
    const text = li.childNodes[0].textContent.trim();

    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    li.remove();
    updateProgress();
}

// Update task completed status in localStorage
function updateTaskStatus(text, completed) {
    const task = tasks.find(t => t.text === text);
    if(task) task.completed = completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task text in localStorage
function updateTaskText(oldText, newText) {
    const task = tasks.find(t => t.text === oldText);
    if(task) task.text = newText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update progress bar
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.style.width = percent + '%';
}