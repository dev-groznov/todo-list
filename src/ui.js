const PRIORITY_ORDER = {
    'var(--priority-high)': 1,
    'var(--priority-medium)': 2,
    'var(--priority-low)': 3
};

export const UI = {
    openModal() {
        document.getElementById('projectModal').classList.add('open');
    },
    
    closeModal() {
        document.getElementById('projectModal').classList.remove('open');
        document.querySelector('.modal-input').value = '';
    },

    initColorPicker() {
        const colorOptions = document.querySelectorAll('#projectModal .color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    },

    getProjectFormData() {
        const nameInput = document.querySelector('.modal-input');
        const selectedColorEl = document.querySelector('#projectModal .color-option.selected');
        const color = selectedColorEl ? selectedColorEl.style.background : 'var(--project-focus)';

        return {
            name: nameInput.value,
            color: color
        };
    }, 
    
    openTaskModal(isEdit = false) {
        const modalTitle = document.querySelector('#taskModal .modal-title');
        const submitBtn = document.getElementById('createTaskBtn');
        
        modalTitle.textContent = isEdit ? 'Edit Task' : 'Create Task';
        submitBtn.textContent = isEdit ? 'Save Changes' : 'Add Task';

        document.getElementById('taskModal').classList.add('open');
    },

    closeTaskModal() {
        document.getElementById('taskModal').classList.remove('open');
        document.querySelector('.task-modal-input').value = '';
        document.querySelector('.task-modal-date').value = '';
    },

    fillTaskModal(task) {
        document.querySelector('.task-modal-input').value = task.title;
        document.querySelector('.task-modal-date').value = task.dueDate || '';

        const options = document.querySelectorAll('.priority-option');
        options.forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.color === task.priorityColor);
        });
    },

    initPriorityPicker() {
        const options = document.querySelectorAll('.priority-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    },

    getTaskFormData() {
        const titleInput = document.querySelector('.task-modal-input');
        const dateInput = document.querySelector('.task-modal-date');
        const selectedPriorityEl = document.querySelector('.priority-option.selected');

        return {
            title: titleInput.value,
            dueDate: dateInput.value,
            priorityColor: selectedPriorityEl ? selectedPriorityEl.dataset.color : 'var(--priority-medium)'
        };
    },

    renderProjects(projects, openedProjectIds, onProjectClick) {
        const projectListEl = document.querySelector('.project-list');
        projectListEl.innerHTML = '';

        projects.forEach(project => {
            const li = document.createElement('li');
            li.classList.add('project-item');
            
            if (openedProjectIds.includes(project.id)) {
                li.classList.add('active');
                li.style.setProperty('--active-color', project.color);
            }

            li.innerHTML = `
                <span class="dot" style="background: ${project.color};"></span>
                ${project.name}
            `;

            li.addEventListener('click', () => onProjectClick(project.id));
            projectListEl.appendChild(li);
        });
    },

    renderOpenProjects(projects) {
        const mainEl = document.querySelector('main');
        
        if (projects.length === 0) {
            mainEl.innerHTML = '<p style="color: var(--text-muted); font-weight: 600;">Select or create a project in the sidebar</p>';
            return;
        }

        mainEl.innerHTML = projects.map(project => {
            const tasksArray = Array.isArray(project.tasks) 
                ? [...project.tasks] 
                : Object.values(project.tasks);

            tasksArray.sort((a, b) => {
                const priorityA = PRIORITY_ORDER[a.priorityColor] || 99;
                const priorityB = PRIORITY_ORDER[b.priorityColor] || 99;
                return priorityA - priorityB;
            });

            return `
                <div class="project-card" style="--card-border-color: ${project.color};">
                    <div class="project-header">
                        <h2 class="project-title">${project.name}</h2>
                        <button class="btn-add-task" data-project-id="${project.id}">+ Add Task</button>
                    </div>
                    <div class="task-list">
                        ${tasksArray.length === 0 ? '<p style="color: var(--text-muted);">No tasks yet</p>' : ''}
                        ${tasksArray.map(task => `
                            <div class="task-item">
                                <div class="task-left">
                                    <span class="dot" style="background: ${task.priorityColor || 'var(--priority-medium)'};"></span>
                                    <span>${task.title}</span>
                                </div>
                                <div class="task-right">
                                    ${task.dueDate ? `<span>${task.dueDate}</span>` : ''}
                                    <svg class="icon-edit" data-task-id="${task.id}" data-project-id="${project.id}" viewBox="0 0 24 24" fill="none" stroke="#ff6b8b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    <svg class="icon-trash" data-task-id="${task.id}" data-project-id="${project.id}" viewBox="0 0 24 24" fill="none" stroke="#ff6b8b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
};