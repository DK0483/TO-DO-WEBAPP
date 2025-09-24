// Get references to the DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const logoutButton = document.getElementById('logout-btn');

const API_URL = 'http://localhost:5000/api/tasks';

// --- Helper Functions for Authentication ---

const getToken = () => localStorage.getItem('token');

const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
};

// --- API Call & Rendering Functions ---

/**
 * Fetches tasks and animates them into the list with a stagger effect.
 */
async function fetchTasks() {
    const token = getToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) logout();
            return;
        }

        const tasks = await response.json();
        renderTasks(tasks);

        // Animate the list items with Anime.js for a smooth entrance
        anime({
            targets: '.task-item',
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(100, { start: 100 }),
            easing: 'easeOutQuad'
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

/**
 * Renders the list of tasks to the DOM with the updated custom checkbox style.
 * @param {Array} tasks - An array of task objects from the API.
 */
// In script.js

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        // The checkbox input and label have been removed from this innerHTML
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// --- Event Listeners ---

taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    const token = getToken();

    if (taskText !== '') {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: taskText }),
            });

            if (response.ok) {
                taskInput.value = '';
                fetchTasks();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
});

taskList.addEventListener('click', async (event) => {
    const token = getToken();
    const target = event.target;

    // Handle delete button clicks
    if (target.classList.contains('delete-btn')) {
        const li = target.closest('.task-item');
        const taskId = li.dataset.id;
        
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                anime({
                    targets: li,
                    opacity: 0,
                    translateX: -50,
                    duration: 400,
                    easing: 'easeInQuad',
                    complete: () => li.remove() // Remove from DOM after animation
                });
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
    
    // Handle checkbox clicks to toggle 'completed' state
    if (target.classList.contains('task-checkbox')) {
        const li = target.closest('.task-item');
        const taskId = li.dataset.id;
        const isCompleted = target.checked;
        li.classList.toggle('completed', isCompleted);

        // Optional: Update the completed status on the backend
        // try {
        //     await fetch(`${API_URL}/${taskId}`, {
        //         method: 'PUT', // Or 'PATCH'
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}`
        //         },
        //         body: JSON.stringify({ completed: isCompleted })
        //     });
        // } catch (error) {
        //     console.error('Error updating task:', error);
        // }
    }
});

if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

// --- Initial Page Load ---
fetchTasks();