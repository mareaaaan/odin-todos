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
	}

	function addTodoToProject(projectIndex, todo) {
		getProject(projectIndex).addTodo(todo);
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
	new Todo(
		"Read History of Economics",
		"Finish reding history of economics",
		new Date("July 20, 2023 10:30:00"),
		"high"
	)
);

TodoController.addTodoToProject(
	0,
	new Todo(
		"Data structures assignment",
		"Finish data structures assignment",
		new Date("July 17, 2023 10:30:00"),
		"high"
	)
);

TodoController.addTodoToProject(
	0,
	new Todo(
		"Watch PPA lectures",
		"Watch PPA lectures",
		new Date("July 19, 2023 18:00:00"),
		"medium"
	)
);

TodoController.addTodoToProject(
	0,
	new Todo(
		"NSE coursework",
		"Finish NSE coursework",
		new Date("July 25, 2023 14:00:00"),
		"high"
	)
);

var DisplayController = (function () {
	var selectedProjectIndex = 0;
	const sidebarElement = document.getElementsByClassName("sidebar")[0];
	const contentElement = document.getElementsByClassName("content")[0];
	const todoCardTemplate = document.getElementsByClassName(
		"todo-card--template"
	)[0];
	const projectTemplate =
		document.getElementsByClassName("project--template")[0];

	PubSub.subscribe("STATE_CHANGE", render);

	function render() {
		renderProjects();
		renderTodos(selectedProjectIndex);
		bindEvents();
	}

	function renderProjects() {
		sidebarElement.textContent = "";
		var projects = TodoController.getProjects();
		for (let index = 0; index < projects.length; index++) {
			renderProject(projects[index], index);
		}
	}

	function renderTodos(projectIndex) {
		contentElement.textContent = "";
		var todos = TodoController.getProjects()[projectIndex].todos;
		for (let index = 0; index < todos.length; index++) {
			renderTodo(todos[index], index);
		}
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

	function bindEvents() {
		bindProjectEvents();
		bindTodoEvents();
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
	}

	function changeSelectedElement(event) {
		selectedProjectIndex = event.srcElement.dataset.index;
		render();
	}

	function changeIsDoneTodo(event) {
		var selectedTodoIndex = event.srcElement.parentElement.dataset.index;
		TodoController.toggleIsDoneTodo(
			selectedProjectIndex,
			selectedTodoIndex
		);
		render();
	}

	return { render };
})();

DisplayController.render();
