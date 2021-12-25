const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { header } = require('express/lib/request');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  
  if(!user) {
    return response.status(404).json({
      error: 'User account doesn\'t exists!'
    });   
  }

  request.user = user;
  next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  if(users.some(user => user.username === username)) {
    return response.status(400).json({
      error: 'Username already registered!'
    })
  }
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };
  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;

  return response.json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;  

  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };
  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;
  const { id } = request.params;

  const todo = todos.find(todo => todo.id === id);
  if(todo) {
    const { title, deadline } = request.body;
    todo.title = title;
    todo.deadline = deadline;

    return response.json(todo);
  }

  return response.status(404).json({
    error: 'Todo not found!'
  });
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;
  const { id } = request.params;

  const todo = todos.find(todo => todo.id === id);
  if(todo) {
    todo.done = !todo.done;
    return response.json(todo);
  }

  return response.status(404).json({
    error: 'Todo not found!'
  });
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  const { id } = request.params;

  if(user.todos.some(todo => todo.id === id)) {
    const todos = user.todos.filter(todo => todo.id !== id);
    user.todos = todos;
    return response.sendStatus(204);
  } 

  return response.status(404).json({
    error: 'Todo not found!'
  });
});

module.exports = app;