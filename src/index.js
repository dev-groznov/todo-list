import "./styles.css";
import { UI } from './ui.js';
import { Project, Task } from './logic.js';

const projects = [];
const openedProjectIds = [];

let targetProjectId = null;
let editingTaskId = null;
let editingProjectId = null;

document.getElementById('openProjectModal').addEventListener('click', UI.openModal);
document.getElementById('closeProjectModal').addEventListener('click', () => {
    editingProjectId = null;
    UI.closeModal();
});
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
            if (editingProjectId) {
                const project = projects.find(p => p.id === editingProjectId);
                if (project) {
                    project.update(data.name, data.color);
                }
                editingProjectId = null;
            } else {
                const newProject = new Project(data.name, data.color); 
                projects.push(newProject); 
                openedProjectIds.push(newProject.id);
            }
            UI.closeModal(); 
            updateUI();
        }
});

document.querySelector('main').addEventListener('click', (e) => {
    const editProjectBtn = e.target.closest('.icon-edit-project');
    const editBtn = e.target.closest('.icon-edit');
    const trashTaskBtn = e.target.closest('.icon-trash');
    const deleteProjectBtn = e.target.closest('.icon-delete-project');
    const addBtn = e.target.classList.contains('btn-add-task');

    if (editProjectBtn) {
        editingProjectId = editProjectBtn.dataset.projectId;
        const project = projects.find(p => p.id === editingProjectId);
        if (project) {
            UI.fillProjectModal(project);
            UI.openModal(true); 
        }
    } else if (deleteProjectBtn) {
        const projectId = deleteProjectBtn.dataset.projectId;
        
        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
            projects.splice(projectIndex, 1);
        }

        const openedIndex = openedProjectIds.indexOf(projectId);
        if (openedIndex !== -1) {
            openedProjectIds.splice(openedIndex, 1);
        }

        updateUI();
    } else if (addBtn) {
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
    } else if (trashTaskBtn) {
        const projectId = trashTaskBtn.dataset.projectId;
        const taskId = trashTaskBtn.dataset.taskId;
        const project = projects.find(p => p.id === projectId);

        if (project) {
            project.deleteTask(taskId);
            updateUI();
        }
    }
});

document.getElementById('createTaskBtn').addEventListener('click', () => {
    const data = UI.getTaskFormData();
    
    if (!data.title.trim() || !targetProjectId) return;

    if (data.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = data.dueDate.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const maxDate = new Date(2030, 11, 31);

        if (selectedDate < today || selectedDate > maxDate) {
            alert('Пожалуйста, выберите дату от сегодняшнего дня до конца 2030 года.');
            return;
        }
    }

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
});