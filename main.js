const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const addTaskWithDetailsBtn = document.getElementById("addTaskWithDetailsBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const descriptionInput = document.getElementById("descriptionInput");
const initialsInput = document.getElementById("initialsInput");
const importantCheck = document.getElementById("importantCheck");
const urgentCheck = document.getElementById("urgentCheck");
const starsInput = document.getElementById("starsInput");
const startDateInput = document.getElementById("startDateInput");
const endDateInput = document.getElementById("endDateInput");
const percentageInput = document.getElementById("percentageInput");
const sortSelect = document.getElementById("sortSelect");
const tasks = [];

// Hinzufügen-Button für neue Aufgaben
addTaskBtn.addEventListener("click", () => {
  validateAndAddTask();
});

//  Hinzufügen-Button für Aufgaben mit Details
addTaskWithDetailsBtn.addEventListener("click", () => {
  validateAndAddTaskWithDetails();
});

// Validieren und Hinzufügen einer Aufgabe
function validateAndAddTask() {
  const taskTitle = taskInput.value.trim();
  if (taskTitle !== "") {
    const task = {
      title: taskTitle
    };
    tasks.push(task);
    renderTasks();
    taskInput.value = "";
  } else {
    alert("Bitte geben Sie einen Aufgabentitel ein.");
  }
}

// Validieren und Hinzufügen einer Aufgabe mit Details
function validateAndAddTaskWithDetails() {
  const taskTitle = taskInput.value.trim();
  const description = descriptionInput.value.trim();
  const initials = initialsInput.value.trim();
  const important = importantCheck.checked;
  const urgent = urgentCheck.checked;
  const priority = parseInt(starsInput.dataset.star);
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const completedPercentage = parseInt(percentageInput.value);

  if (taskTitle !== "") {
    if (startDate === "" || endDate === "") {
      alert("Bitte geben Sie das Startdatum und das Enddatum ein.");
      return;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj >= endDateObj) {
      alert("Das Startdatum muss kleiner als das Enddatum sein.");
      return;
    }

    const task = {
      title: taskTitle,
      description: description,
      initials: initials,
      important: important,
      urgent: urgent,
      priority: priority,
      startDate: startDate,
      endDate: endDate,
      completedPercentage: completedPercentage
    };
    tasks.push(task);
    renderTasks();
    taskInput.value = "";
    descriptionInput.value = "";
    initialsInput.value = "";
    importantCheck.checked = false;
    urgentCheck.checked = false;
    starsInput.dataset.star = "1";
    startDateInput.value = "";
    endDateInput.value = "";
    percentageInput.value = "";
  } else {
    alert("Bitte geben Sie einen Aufgabentitel ein.");
  }
}
// Such-Button
searchBtn.addEventListener("click", () => {
  const searchText = searchInput.value.trim().toLowerCase();
  if (searchText !== "") {
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchText));
    renderTasks(filteredTasks);
  } else {
    renderTasks();
  }
});

// Änderung der Sortieroption
sortSelect.addEventListener("change", () => {
  const sortBy = sortSelect.value;
  let sortedTasks = [...tasks];

  if (sortBy === "priority") {
    sortedTasks.sort((a, b) => b.priority - a.priority);
  } else if (sortBy === "important") {
    sortedTasks.sort((a, b) => b.important - a.important);
  } else if (sortBy === "alphabetical") {
    sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderTasks(sortedTasks);
});

// Funktion zum Rendern der Aufgabenliste
function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = "";
  filteredTasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    if (task.completedPercentage === 100) {
      listItem.classList.add("list-group-item-success");
    }
    listItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span>${task.title}</span>
        <div>
          <button class="btn btn-sm btn-danger me-2" onclick="deleteTask(${index})"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div class="mt-2">
        <p class="mb-1"><strong>Beschreibung:</strong> ${task.description}</p>
        <p class="mb-1"><strong>Kürzel:</strong> ${task.initials}</p>
        <p class="mb-1"><strong>Wichtig:</strong> ${task.important ? "Ja" : "Nein"}</p>
        <p class="mb-1"><strong>Dringend:</strong> ${task.urgent ? "Ja" : "Nein"}</p>
        <p class="mb-1"><strong>Priorität:</strong> ${task.priority} Sterne</p>
        <p class="mb-1"><strong>Startdatum:</strong> ${task.startDate}</p>
        <p class="mb-1"><strong>Enddatum:</strong> ${task.endDate}</p>
        <p class="mb-1"><strong>Fortschritt:</strong> ${task.completedPercentage}%</p>
      </div>
    `;
    taskList.appendChild(listItem);
  });
}

// Funktion zum Löschen einer Aufgabe
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Funktion zum Ändern des Status einer Aufgabe
function toggleTaskStatus(index) {
  tasks[index].completedPercentage = tasks[index].completedPercentage === 100 ? 0 : 100;
  renderTasks();
}

// Sternenfunktion zur Auswahl der Priorität
const stars = document.querySelectorAll(".star");
stars.forEach(star => {
  star.addEventListener("click", () => {
    const selectedStar = parseInt(star.dataset.star);
    stars.forEach(s => s.classList.remove("fas", "far"));
    stars.forEach((s, index) => {
      if (index < selectedStar) {
        s.classList.add("fas");
      } else {
        s.classList.add("far");
      }
    });
    starsInput.dataset.star = selectedStar.toString();
  });
});

// Initialisierung der Aufgabenliste
renderTasks();
