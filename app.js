
const STORAGE_KEY = "jarvis-maryana-os-tasks-v1";

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const categoryInput = document.querySelector("#task-category");
const dateInput = document.querySelector("#task-date");
const impactInput = document.querySelector("#task-impact");
const effortInput = document.querySelector("#task-effort");
const filterInput = document.querySelector("#task-filter");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");

const totalCount = document.querySelector("#total-count");
const completedCount = document.querySelector("#completed-count");
const urgentCount = document.querySelector("#urgent-count");
const focusButton = document.querySelector("#focus-button");

let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(task =>
      task &&
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      typeof task.done === "boolean" &&
      typeof task.impact === "number" &&
      typeof task.effort === "number"
    );
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    alert("Could not save tasks. Check your browser's local storage settings.");
    return false;
  }
}

function localToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysUntil(date) {
  if (!date) return null;

  const deadline = new Date(`${date}T00:00:00`);
  if (Number.isNaN(deadline.getTime())) return null;

  const today = new Date(`${localToday()}T00:00:00`);
  return Math.round((deadline - today) / 86400000);
}

function getPriority(task) {
  const days = daysUntil(task.dueDate);

  let urgency = 0;
  let urgencyReason = "No deadline set";

  if (days !== null) {
    if (days < 0) {
      urgency = 10;
      urgencyReason = `${Math.abs(days)} day(s) overdue`;
    } else if (days === 0) {
      urgency = 9;
      urgencyReason = "Due today";
    } else if (days === 1) {
      urgency = 7;
      urgencyReason = "Due tomorrow";
    } else if (days <= 3) {
      urgency = 5;
      urgencyReason = `Due in ${days} days`;
    } else if (days <= 7) {
      urgency = 3;
      urgencyReason = `Due in ${days} days`;
    } else {
      urgency = 1;
      urgencyReason = `Due in ${days} days`;
    }
  }

  // Transparent heuristic, not a learned AI model.
  const impactPoints = task.impact * 2;
  const effortPenalty = task.effort - 1;
  const score = urgency + impactPoints - effortPenalty;

  return {
    score,
    urgencyReason,
    impactPoints,
    effortPenalty
  };
}

function priorityLabel(score) {
  if (score >= 12) return "HIGH PRIORITY";
  if (score >= 7) return "MEDIUM PRIORITY";
  return "LOW PRIORITY";
}

function safeText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTasks() {
  const filter = filterInput.value;

  const visibleTasks = tasks
    .map(task => ({ ...task, priority: getPriority(task) }))
    .filter(task => {
      if (filter === "open") return !task.done;
      if (filter === "done") return task.done;
      return true;
    })
    .sort((a, b) => {
      if (a.done !== b.done) return Number(a.done) - Number(b.done);
      return b.priority.score - a.priority.score;
    });

  taskList.innerHTML = visibleTasks.map(task => {
    const label = priorityLabel(task.priority.score);
    const badgeClass =
      label === "HIGH PRIORITY" ? "high" :
      label === "LOW PRIORITY" ? "low" : "";

    const dueText = task.dueDate
      ? `Deadline: ${safeText(task.dueDate)}`
      : "No deadline";

    const reason = task.done
      ? "Completed."
      : `${task.priority.urgencyReason}. Impact contributes ${task.priority.impactPoints} points; effort subtracts ${task.priority.effortPenalty}. Total score: ${task.priority.score}.`;

    return `
      <article class="task-card ${task.done ? "done" : ""}">
        <div class="task-main">
          <input type="checkbox"
            aria-label="Mark ${safeText(task.title)} complete"
            data-action="toggle"
            data-id="${safeText(task.id)}"
            ${task.done ? "checked" : ""} />
          <div class="task-info">
            <div class="task-title">${safeText(task.title)}</div>
            <div class="task-meta">
              ${safeText(task.category)} · ${dueText}
            </div>
          </div>
        </div>
        <p class="task-reason">${safeText(reason)}</p>
        <div class="task-actions">
          <span class="priority-badge ${badgeClass}">
            ${task.done ? "COMPLETED" : label}
          </span>
          <button type="button" class="delete-button"
            data-action="delete" data-id="${safeText(task.id)}">
            Delete
          </button>
        </div>
      </article>
    `;
  }).join("");

  emptyState.hidden = visibleTasks.length > 0;

  totalCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter(task => task.done).length;
  urgentCount.textContent = tasks.filter(task =>
    !task.done &&
    task.dueDate &&
    daysUntil(task.dueDate) <= 0
  ).length;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const title = titleInput.value.trim();
  if (!title) return;

  const task = {
    id: crypto.randomUUID(),
    title,
    category: categoryInput.value,
    dueDate: dateInput.value,
    impact: Number(impactInput.value),
    effort: Number(effortInput.value),
    done: false
  };

  tasks.push(task);

  if (saveTasks()) {
    form.reset();
    impactInput.value = "2";
    effortInput.value = "2";
    renderTasks();
    titleInput.focus();
  } else {
    tasks.pop();
  }
});

taskList.addEventListener("change", event => {
  const control = event.target.closest('[data-action="toggle"]');
  if (!control) return;

  const task = tasks.find(item => item.id === control.dataset.id);
  if (!task) return;

  const previous = task.done;
  task.done = control.checked;

  if (saveTasks()) {
    renderTasks();
  } else {
    task.done = previous;
    renderTasks();
  }
});

taskList.addEventListener("click", event => {
  const button = event.target.closest('[data-action="delete"]');
  if (!button) return;

  const id = button.dataset.id;
  const previousTasks = tasks;
  tasks = tasks.filter(task => task.id !== id);

  if (saveTasks()) {
    renderTasks();
  } else {
    tasks = previousTasks;
    renderTasks();
  }
});

filterInput.addEventListener("change", renderTasks);

focusButton.addEventListener("click", () => {
  filterInput.value = "open";
  renderTasks();
  document.querySelector(".task-panel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

renderTasks();