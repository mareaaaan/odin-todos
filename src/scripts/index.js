import { Project } from "./project.js";
import { Todo } from "./todo.js";
import "../styles/reset.css";
import "../styles/index.css";

var TodoController = (function () {
	var projects = [];

	function addProject(name) {
		projects.push(new Project(name));
	}

	function removeProject(index) {
		projects.splice(index, 1);
	}

	function getProject(index) {
		projects[index];
	}

    function getTodoFromProject(projectIndex, todoIndex) {
		projects[index];
	}

    function addTodoToProject(projectIndex, todo) {
        getProject(projectIndex).addTodo(todo);
    }

	return { addProject, removeProject, getProject, getTodoFromProject, addTodoToProject};
})();

var DisplayController = (function () {
	function render() {}

	return { render };
})();

DisplayController.render();
