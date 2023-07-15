class Todo {
    #isCompleted = false;
    #title = "";
    #description = "";
    #dueDate = "";
    #priority = "";

    constructor(title, description, dueDate, priority) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
    }

    set isCompleted(newIsCompleted){
        this.#isCompleted = newIsCompleted;
    }

    get isCompleted() {
        return this.#isCompleted;
    }

    set title(newTitle){
        this.#title = newTitle;
    }

    get title() {
        return this.#title;
    }

    set description(newDescription){
        this.#description = newDescription;
    }

    get description(){
        return this.#description;
    }

    set dueDate(newDueDate){
        this.#dueDate = newDueDate;
    }

    get dueDate(){
        return this.#dueDate;
    }

    set priority(newPriority){
        this.#priority = newPriority;
    }

    get priority(){
        return this.#priority;
    }
}

class Project {
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