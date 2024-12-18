document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const categorySelect = document.getElementById("category-select");
    const prioritySelect = document.getElementById("priority-select");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskListUl = document.getElementById("task-list-ul");
    const showAllBtn = document.getElementById("show-all-btn");
    const showCompletedBtn = document.getElementById("show-completed-btn");
    const showPendingBtn = document.getElementById("show-pending-btn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskListUl.innerHTML = "";
        let filteredTasks = tasks;

        if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.toggle("completed", task.completed);

            const taskText = document.createElement("span");
            taskText.textContent = task.text;
            li.appendChild(taskText);

            const prioritySpan = document.createElement("span");
            prioritySpan.classList.add("priority");
            prioritySpan.textContent = `Priority: ${task.priority}`;
            li.appendChild(prioritySpan);

            const categorySpan = document.createElement("span");
            categorySpan.textContent = `Category: ${task.category}`;
            li.appendChild(categorySpan);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                tasks = tasks.filter(t => t !== task);
                saveTasksToLocalStorage();
                renderTasks();
            });
            li.appendChild(deleteBtn);

            const toggleCompleteBtn = document.createElement("button");
            toggleCompleteBtn.textContent = task.completed ? "Undo" : "Complete";
            toggleCompleteBtn.addEventListener("click", () => {
                task.completed = !task.completed;
                saveTasksToLocalStorage();
                renderTasks();
            });
            li.appendChild(toggleCompleteBtn);

            taskListUl.appendChild(li);
        });
    }

    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;
        const priority = prioritySelect.value;

        if (taskText !== "" && category && priority) {
            const newTask = {
                text: taskText,
                category: category,
                priority: priority,
                completed: false
            };
            tasks.push(newTask);
            saveTasksToLocalStorage();
            renderTasks();
            taskInput.value = "";
            categorySelect.value = "";
            prioritySelect.value = "Low";
        }
    });

    showAllBtn.addEventListener("click", () => renderTasks('all'));
    showCompletedBtn.addEventListener("click", () => renderTasks('completed'));
    showPendingBtn.addEventListener("click", () => renderTasks('pending'));

    renderTasks();
});
