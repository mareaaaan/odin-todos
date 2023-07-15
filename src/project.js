export class Project {
	#todos = [];
	#title = "";

	constructor(title) {
		this.#title = title;
	}

	addTodo(todo) {
		this.#todos.push(todo);
	}

	get todos() {
		return this.#todos;
	}

	set title(newTitle) {
		this.#title = newTitle;
	}

	get title() {
		return this.#title;
	}
}
