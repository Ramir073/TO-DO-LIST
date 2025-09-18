const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDate');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

let todos = [];
let editIndex = null;

function saveTodosToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromLocalStorage() {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  } else {
    todos = [];
  }
}

function createTodoElement(todo, index) {
  const li = document.createElement('li');

  const todoTextContainer = document.createElement('div');
  todoTextContainer.classList.add('todo-text-container');

  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `Mark task "${todo.text}" as completed`);
  checkbox.addEventListener('change', () => {
    todos[index].completed = checkbox.checked;
    saveTodosToLocalStorage();
    renderTodos();
  });
  todoTextContainer.appendChild(checkbox);

  
  const p = document.createElement('p');
  p.textContent = todo.text;
  if (todo.completed) p.classList.add('completed');
  todoTextContainer.appendChild(p);

  
  const priorityLabel = document.createElement('span');
  priorityLabel.classList.add('todo-priority', `priority-${todo.priority}`);
  priorityLabel.textContent = todo.priority;
  todoTextContainer.appendChild(priorityLabel);

  
  if (todo.dueDate) {
    const dueDateSpan = document.createElement('span');
    dueDateSpan.classList.add('due-date');
    const dateObj = new Date(todo.dueDate);
    dueDateSpan.textContent = `Due: ${dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
    todoTextContainer.appendChild(dueDateSpan);
  }

  li.appendChild(todoTextContainer);

  
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('todo-actions');

  
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.classList.add('edit-btn');
  editBtn.setAttribute('aria-label', `Edit task "${todo.text}"`);
  editBtn.addEventListener('click', () => {
    startEditingTodo(index);
  });
  actionsDiv.appendChild(editBtn);

  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Remove';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.setAttribute('aria-label', `Remove task "${todo.text}"`);
  deleteBtn.addEventListener('click', () => {
    deleteTodo(index);
  });
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(actionsDiv);

  return li;
}

function renderTodos() {
  todoList.innerHTML = '';

  
  const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const searchTerm = searchInput.value.trim().toLowerCase();

  let filteredTodos = todos.filter((todo) => {
    
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    // Filter by search term
    if (searchTerm && !todo.text.toLowerCase().includes(searchTerm)) return false;

    return true;
  });

  filteredTodos.forEach((todo, i) => {
    
    const originalIndex = todos.indexOf(todo);
    todoList.appendChild(createTodoElement(todo, originalIndex));
  });
}

function addTodo() {
  const text = inputBox.value.trim();
  if (text === '') {
    alert('You must write something in your to do');
    return;
  }

  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value ? dueDateInput.value : null;

  if (editIndex !== null) {
    
    todos[editIndex].text = text;
    todos[editIndex].priority = priority;
    todos[editIndex].dueDate = dueDate;
    editIndex = null;
    addBtn.textContent = 'Add';
  } else {
    
    todos.push({ text, completed: false, priority, dueDate });
  }

  inputBox.value = '';
  prioritySelect.value = 'Low';
  dueDateInput.value = '';
  saveTodosToLocalStorage();
  renderTodos();
}

function startEditingTodo(index) {
  const todo = todos[index];
  inputBox.value = todo.text;
  prioritySelect.value = todo.priority;
  dueDateInput.value = todo.dueDate || '';
  addBtn.textContent = 'Edit';
  editIndex = index;
  inputBox.focus();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodosToLocalStorage();
  renderTodos();
}

function clearCompletedTasks() {
  todos = todos.filter(todo => !todo.completed);
  saveTodosToLocalStorage();
  renderTodos();
}


addBtn.addEventListener('click', addTodo);

searchInput.addEventListener('input', renderTodos);

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTodos();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all completed tasks?')) {
    clearCompletedTasks();
  }
});


document.addEventListener('DOMContentLoaded', () => {
  loadTodosFromLocalStorage();
  renderTodos();
});