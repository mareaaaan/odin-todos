export class Project {
	#todos = [];
	#title = "";

	constructor(title) {
		this.#title = title;
	}

	set title(newTitle) {
		this.#title = newTitle;
	}

	get title() {
		return this.#title;
	}

	addTodo(todo) {
		this.#todos.push(todo);
	}

	get todos() {
		return this.#todos;
	}

    getTodo(index) {
		return this.#todos[index];
	}

    getTodoNumber() {
		return this.#todos.length;
	}
}
