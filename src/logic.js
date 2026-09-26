export class Task {
    constructor(title, dueDate, priorityColor) {
        this.id = Date.now().toString();
        this.title = title;
        this.dueDate = dueDate;
        this.priorityColor = priorityColor;
    }
}

export class Project {
    constructor(name, color) {
        this.id = Date.now().toString();
        this.name = name;
        this.color = color;
        this.tasks = []; 
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    update(name, color) {
        this.name = name;
        this.color = color;
    }

    updateTask(taskId, updatedData) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.title = updatedData.title;
            task.dueDate = updatedData.dueDate;
            task.priorityColor = updatedData.priorityColor;
        }
    }
}