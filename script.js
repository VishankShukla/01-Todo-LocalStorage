document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");
  const clearAllBtn = document.getElementById("clear-all-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => renderTask(task));
  toggleClearButton();
  lengthCheck()

  addTaskButton.addEventListener("click", () => {
    let taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    saveTask();
    renderTask(newTask);
    toggleClearButton();
    lengthCheck()
    todoInput.value = "";
  });

  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTaskButton.click();
    }
  });

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <button class="delete-btn">Delete</button>
    `;
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      updateUI();
    });

    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation(); //prevent toggle from firing
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      updateUI();
    });
    todoList.appendChild(li);
  }

  function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

function toggleClearButton() {
  const hasCompleted = tasks.some(task => task.completed);

  if (hasCompleted) {
    clearCompletedBtn.style.display = "inline";
  } else {
    clearCompletedBtn.style.display = "none";
  }
}

function lengthCheck(){
  if(tasks.length>0){
    clearAllBtn.style.display = "inline";
  } else {
    clearAllBtn.style.display ="none";
  }
}

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTask();

  todoList.innerHTML = "";
  tasks.forEach(task => renderTask(task));

  toggleClearButton();
  lengthCheck();
});

clearAllBtn.addEventListener('click',()=>{
  if (!confirm("Are you sure you want to delete all tasks?")) return;
  tasks =[];
  todoList.innerHTML = "";
  updateUI();
});
function updateUI() {
  saveTask();
  toggleClearButton();
  lengthCheck();
};
});
