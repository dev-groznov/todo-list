import "./styles.css";
import { UI } from './ui.js';
import { Project, Task } from './logic.js';

const projects = [];
const openedProjectIds = [];

let targetProjectId = null;
let editingTaskId = null;

document.getElementById('openProjectModal').addEventListener('click', UI.openModal);
document.getElementById('closeProjectModal').addEventListener('click', UI.closeModal);
document.getElementById('closeTaskModal').addEventListener('click', () => {
    editingTaskId = null;
    UI.closeTaskModal();
});

UI.initColorPicker();
UI.initPriorityPicker();

function toggleProject(id) {
    const index = openedProjectIds.indexOf(id);
    if (index === -1) {
        openedProjectIds.push(id);
    } else {
        openedProjectIds.splice(index, 1);
    }
    updateUI();
}

function updateUI() {
    const openedProjects = openedProjectIds
        .map(id => projects.find(p => p.id === id))
        .filter(Boolean);

    UI.renderProjects(projects, openedProjectIds, toggleProject);
    UI.renderOpenProjects(openedProjects);
}

document.querySelector('#projectModal .btn-primary').addEventListener('click', () => {
    const data = UI.getProjectFormData(); 
    if (data.name.trim() !== '') {
        const newProject = new Project(data.name, data.color); 
        projects.push(newProject); 
        UI.closeModal(); 
        openedProjectIds.push(newProject.id);
        updateUI();
    }
});

document.querySelector('main').addEventListener('click', (e) => {
    const editBtn = e.target.closest('.icon-edit');
    const trashBtn = e.target.closest('.icon-trash');
    const addBtn = e.target.classList.contains('btn-add-task');

    if (addBtn) {
        targetProjectId = e.target.dataset.projectId;
        editingTaskId = null;
        UI.openTaskModal(false);
    } else if (editBtn) {
        targetProjectId = editBtn.dataset.projectId;
        editingTaskId = editBtn.dataset.taskId;

        const project = projects.find(p => p.id === targetProjectId);
        const task = project ? project.tasks.find(t => t.id === editingTaskId) : null;

        if (task) {
            UI.fillTaskModal(task);
            UI.openTaskModal(true);
        }
    } else if (trashBtn) {
        const projectId = trashBtn.dataset.projectId;
        const taskId = trashBtn.dataset.taskId;
        const project = projects.find(p => p.id === projectId);

        if (project) {
            project.deleteTask(taskId);
            updateUI();
        }
    }
});

document.getElementById('createTaskBtn').addEventListener('click', () => {
    const data = UI.getTaskFormData();
    
    if (data.title.trim() !== '' && targetProjectId) {
        const project = projects.find(p => p.id === targetProjectId);
        if (project) {
            if (editingTaskId) {
                project.updateTask(editingTaskId, data);
            } else {
                const newTask = new Task(data.title, data.dueDate, data.priorityColor);
                project.addTask(newTask);
            }
            editingTaskId = null;
            UI.closeTaskModal();
            updateUI();
        }
    }
});