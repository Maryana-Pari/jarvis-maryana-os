# JARVIS–Maryana OS

### A Personal Command Center for Student Productivity

JARVIS–Maryana OS is a student-focused productivity dashboard designed to help students organize academic responsibilities, manage deadlines, and make more informed decisions about what to work on first.

Instead of treating every task equally, the project uses a rule-based priority system to rank tasks according to urgency, impact, and estimated effort.

The long-term vision is to develop a personal operating system that helps students coordinate academics, learning goals, applications, projects, and deadlines from one place.

## The Problem

Students often have to manage multiple courses, assignments, examinations, personal projects, and application deadlines at the same time. Traditional to-do lists record tasks but may not help students decide which task deserves attention first.

JARVIS–Maryana OS aims to address this problem by combining task management with transparent, deadline-aware prioritization.

## Current Features

* **Task management:** Add tasks with a title, category, deadline, impact, and estimated effort.
* **Priority scoring:** Calculate a priority score using task urgency, impact, and effort.
* **Priority ranking:** Organize tasks so that more urgent and impactful work can receive attention first.
* **Task completion:** Mark tasks as completed and remove tasks that are no longer needed.
* **Focus mode:** Filter the dashboard to concentrate on incomplete tasks.
* **Dashboard overview:** View task counts and monitor progress.
* **Local persistence:** Save tasks in the browser using local storage, allowing them to remain available after a page refresh on the same browser.

## How Priority Is Calculated

The current prototype uses a rule-based heuristic rather than a connected AI model.

The score is calculated as:

`Priority Score = Urgency + (Impact × 2) − (Effort − 1)`

Urgency is assigned according to the task's deadline:

| Deadline              | Urgency score |
| --------------------- | ------------: |
| Overdue               |            10 |
| Due today             |             9 |
| Due tomorrow          |             7 |
| Within 3 days         |             5 |
| Within 7 days         |             3 |
| More than 7 days away |             1 |
| No deadline           |             0 |

The system then combines urgency with impact and effort to produce a priority score. Tasks are assigned high, medium, or low priority according to the thresholds implemented in the application.

This approach is intended to make task prioritization understandable and explainable. It is a heuristic, not a guarantee that the highest-scoring task is always the most important in every real-world situation.

## Technology Stack

* **HTML5** — Dashboard structure
* **CSS3** — Styling and layout
* **JavaScript** — Task management, priority calculations, filtering, and application logic
* **Browser Local Storage** — Persistence of tasks in the local browser
* **Git and GitHub** — Version control and source-code hosting

## Getting Started

No build tools or package installation are required for the current prototype.

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.

Alternatively, open the folder in Visual Studio Code and use a local development server if you have one installed.

## Project Structure

```text
jarvis-maryana-os/
├── index.html
├── style.css
├── app.js
└── README.md
```

## Current Limitations

This is an early-stage prototype.

* The current priority system is rule-based; no external AI model or AI API is connected.
* Tasks are stored locally in the browser rather than synchronized to a cloud database.
* User accounts and cross-device synchronization are not implemented.
* Browser local storage is not a secure system for sensitive information.
* Priority scores are decision-support suggestions and do not replace a student's judgment.

## Future Development

Planned areas for exploration include:

* A daily briefing that identifies the top three tasks and explains why they matter.
* Goal decomposition to help turn larger objectives into manageable actions.
* Improved academic planning and deadline-conflict detection.
* Optional AI-assisted planning, subject to implementation and appropriate testing.
* More comprehensive documentation, usability testing, and accessibility improvements.

These are development goals, not claims about features already implemented.

## Project Motivation

JARVIS–Maryana OS began as a personal effort to make academic planning and competing responsibilities easier to manage. The project is being developed incrementally, with an emphasis on practical usefulness, transparent prioritization, and honest documentation of current capabilities and limitations.

## Contributing and Feedback

Suggestions, bug reports, and feedback on the priority system and user experience are welcome.

## License

No open-source license has been added yet. Until a license is selected, the repository's code should not be assumed to be available for unrestricted reuse.
