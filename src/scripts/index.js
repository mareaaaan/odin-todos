import "../styles/reset.css";
import "../styles/index.css";

import { Project } from "./project.js";
import { Todo } from "./todo.js";
import PubSub from "pubsub-js";

var TodoController = (function () {
	var projects = [];

	function addProject(name) {
		projects.push(new Project(name));
		PubSub.publish("STATE_CHANGE", "");
	}

	function removeProject(index) {
		projects.splice(index, 1);
		PubSub.publish("STATE_CHANGE", "");
	}

	function getProjects() {
		return projects;
	}

	function getProject(index) {
		return projects[index];
	}

	function getTodoFromProject(projectIndex, todoIndex) {
		return getProject(projectIndex).getTodo(todoIndex);
	}

	function toggleIsDoneTodo(projectIndex, todoIndex) {
		getProject(projectIndex).getTodo(todoIndex).toggleIsDone();
		PubSub.publish("STATE_CHANGE", "");
	}

	function addTodoToProject(
		projectIndex,
		title,
		description,
		dueDate,
		priority
	) {
		getProject(projectIndex).addTodo(
			new Todo(title, description, dueDate, priority)
		);
		PubSub.publish("STATE_CHANGE", "");
	}

	return {
		getProjects,
		addProject,
		removeProject,
		getProject,
		getTodoFromProject,
		addTodoToProject,
		toggleIsDoneTodo,
	};
})();

TodoController.addProject("University");
TodoController.addProject("Books");
TodoController.addProject("Job");
TodoController.addProject("Fitness");

TodoController.addTodoToProject(
	1,
	"Read History of Economics",
	"Finish reding history of economics",
	new Date("July 20, 2023 10:30:00"),
	"high"
);

TodoController.addTodoToProject(
	0,
	"Data structures assignment",
	"Finish data structures assignment",
	new Date("July 17, 2023 10:30:00"),
	"high"
);

TodoController.addTodoToProject(
	0,
	"Watch PPA lectures",
	"Watch PPA lectures",
	new Date("July 19, 2023 18:00:00"),
	"medium"
);

TodoController.addTodoToProject(
	0,
	"NSE coursework",
	"Finish NSE coursework",
	new Date("July 25, 2023 14:00:00"),
	"high"
);

var DisplayController = (function () {
	var selectedProjectIndex = 0;

	const bodyElement = document.body;
	const blurElement = document.getElementsByClassName("layer")[0];
	const sidebarElement = document.getElementsByClassName("sidebar")[0];
	const contentElement = document.getElementsByClassName("content")[0];
	const todoCardTemplate = document.getElementsByClassName(
		"todo-card--template"
	)[0];
	const projectTemplate =
		document.getElementsByClassName("project--template")[0];
	const addButtonTemplate = document.getElementsByClassName(
		"add-button--template"
	)[0];
	const addTodoDialogTemplate =
		document.getElementsByClassName("add-todo--template")[0];
	const editTodoDialogTemplate = document.getElementsByClassName(
		"edit-todo--template"
	)[0];

	PubSub.subscribe("STATE_CHANGE", render);

	function render() {
		renderProjects();
		renderContent();
		bindEvents();
	}

	function renderProjects() {
		sidebarElement.textContent = "";
		var projects = TodoController.getProjects();
		for (let index = 0; index < projects.length; index++) {
			renderProject(projects[index], index);
		}
	}

	function renderContent() {
		renderTodos(selectedProjectIndex);
		renderAddButton();
	}

	function renderTodos(projectIndex) {
		contentElement.textContent = "";
		var todos = TodoController.getProjects()[projectIndex].todos;
		for (let index = 0; index < todos.length; index++) {
			renderTodo(todos[index], index);
		}
	}

	function renderAddButton() {
		const addButtonNode = document.importNode(
			addButtonTemplate.content,
			true
		);
		contentElement.appendChild(addButtonNode);
	}

	function renderProject(project, projectIndex) {
		const projectNode = document.importNode(projectTemplate.content, true);
		sidebarElement.appendChild(projectNode);
		const projectELement =
			sidebarElement.getElementsByClassName("project")[projectIndex];
		projectELement.textContent = project.title;
		projectELement.setAttribute("data-index", projectIndex.toString());
		if (projectIndex == selectedProjectIndex) {
			projectELement.classList.add("project--selected");
		}
	}

	function renderTodo(todo, todoIndex) {
		const todoCardNode = document.importNode(
			todoCardTemplate.content,
			true
		);
		contentElement.appendChild(todoCardNode);

		const todoCardELement =
			contentElement.getElementsByClassName("todo-card")[todoIndex];

		todoCardELement.setAttribute("data-index", todoIndex.toString());
		todoCardELement.getElementsByClassName(
			"todo-card__title"
		)[0].textContent = todo.title;
		todoCardELement.getElementsByClassName(
			"todo-card__due-date"
		)[0].textContent = todo.dueDate;

		todoCardELement.getElementsByClassName(
			"todo-card__button"
		)[0].textContent = todo.isCompleted ? "Completed" : "Pending";

		todoCardELement
			.getElementsByClassName("todo-card__button")[0]
			.classList.add(
				todo.isCompleted
					? "todo-card__button--completed"
					: "todo-card__button--pending"
			);
	}

	function renderAddNewTodoDialog() {
		const addNewTodoDialogNode = document.importNode(
			addTodoDialogTemplate.content,
			true
		);
		bodyElement.appendChild(addNewTodoDialogNode);
	}

	function renderEditTodoDialog(todoIndex) {
		const editTodoDialogNode = document.importNode(
			editTodoDialogTemplate.content,
			true
		);
		bodyElement.appendChild(editTodoDialogNode);

		const editTodoDialogELement =
			bodyElement.getElementsByClassName("add-todo-dialog")[0];

		const todoTitleElement =
			editTodoDialogELement.getElementsByClassName("todo-title")[0];
		const todoDescriptionElement =
			editTodoDialogELement.getElementsByClassName("todo-description")[0];
		const todoDueDateElement =
			editTodoDialogELement.getElementsByClassName("todo-due-date")[0];
		const selectedTodo = TodoController.getTodoFromProject(
			selectedProjectIndex,
			todoIndex
		);
		todoTitleElement.value = selectedTodo.title;
		todoDescriptionElement.value = selectedTodo.description;
		todoDueDateElement.value = selectedTodo.dueDate.toString();
	}

	function bindEvents() {
		bindProjectEvents();
		bindTodoEvents();
		bindAddButtonEvents();
	}

	function bindProjectEvents() {
		const projectElements =
			sidebarElement.getElementsByClassName("project");
		Array.from(projectElements).forEach(function (element) {
			element.addEventListener("click", changeSelectedElement);
		});
	}

	function bindTodoEvents() {
		const todoButtons =
			contentElement.getElementsByClassName("todo-card__button");
		Array.from(todoButtons).forEach(function (element) {
			element.addEventListener("click", changeIsDoneTodo);
		});

		const todoElements = contentElement.getElementsByClassName("todo-card");
		Array.from(todoElements).forEach(function (element) {
			element.addEventListener("click", openEditTodoDialog);
		});
	}

	function bindAddButtonEvents() {
		const addButton =
			contentElement.getElementsByClassName("add-button")[0];
		addButton.addEventListener("click", openAddNewTodoDialog);
	}

	function bindAddNewTodoDialogEvents() {
		const closeButton = bodyElement.getElementsByClassName(
			"close-dialog-button"
		)[0];
		closeButton.addEventListener("click", closeAddNewTodoDialog);

		const addButton =
			bodyElement.getElementsByClassName("add-todo__button")[0];

		addButton.addEventListener("click", () => {
			addNewTodo();
			closeAddNewTodoDialog();
		});
	}

	function bindEditTodoDialogEvents() {
		const closeButton = bodyElement.getElementsByClassName(
			"close-dialog-button"
		)[0];
		closeButton.addEventListener("click", closeEditTodoDialog);

		const submitButton = bodyElement.getElementsByClassName(
			"submit-todo__button"
		)[0];

		submitButton.addEventListener("click", () => {
			closeAddNewTodoDialog();
		});
	}

	function openAddNewTodoDialog() {
		blurScreen();
		renderAddNewTodoDialog();
		bindAddNewTodoDialogEvents();
	}

	function openEditTodoDialog(event) {
		const todoIndex = event.srcElement.closest(".todo-card").dataset.index;
		blurScreen();
		renderEditTodoDialog(todoIndex);
		bindEditTodoDialogEvents(todoIndex);
	}

	function closeAddNewTodoDialog() {
		const addNewTodoDialogNode =
			bodyElement.getElementsByClassName("add-todo-dialog")[0];
		addNewTodoDialogNode.remove();
		unblurScreen();
	}

	function closeEditTodoDialog() {
		const editTodoDialogNode =
			bodyElement.getElementsByClassName("add-todo-dialog")[0];
		editTodoDialogNode.remove();
		unblurScreen();
	}

	function blurScreen() {
		blurElement.classList.add("blur");
	}

	function unblurScreen() {
		blurElement.classList.remove("blur");
	}

	function addNewTodo() {
		const todoTitle =
			bodyElement.getElementsByClassName("todo-title")[0].value;
		const todoDescription =
			bodyElement.getElementsByClassName("todo-description")[0].value;
		const todoDueDate =
			bodyElement.getElementsByClassName("todo-due-date")[0].value;
		const todoPriority = document.querySelector(
			'input[name="todo-priority"]:checked'
		).value;
		TodoController.addTodoToProject(
			selectedProjectIndex,
			todoTitle,
			todoDescription,
			new Date(todoDueDate),
			todoPriority
		);
	}

	function changeSelectedElement(event) {
		selectedProjectIndex = event.srcElement.dataset.index;
		render();
	}

	function changeIsDoneTodo(event) {
		event.stopPropagation();
		var selectedTodoIndex = event.srcElement.parentElement.dataset.index;
		TodoController.toggleIsDoneTodo(
			selectedProjectIndex,
			selectedTodoIndex
		);
	}

	return { render };
})();

DisplayController.render();
