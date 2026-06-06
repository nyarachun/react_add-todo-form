import React, { useState } from 'react';
import './App.scss';
import { TodoList } from './components/TodoList/TodoList';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { Todo } from './components/TodoInfo/TodoInfo';

const initialTodos: Todo[] = todosFromServer.map(todo => {
  const foundUser = usersFromServer.find(u => u.id === todo.userId);

  return {
    ...todo,
    user: foundUser
      ? {
          name: foundUser.name,
          username: foundUser.username,
          email: foundUser.email,
        }
      : undefined,
  };
});

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [userError, setUserError] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(
      /[^a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9 ]/g,
      '',
    );

    setTitle(cleanValue);
    setTitleError(false);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(Number(e.target.value));
    setUserError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isTitleInvalid = !title.trim();
    const isUserInvalid = userId === 0;

    if (isTitleInvalid) {
      setTitleError(true);
    }

    if (isUserInvalid) {
      setUserError(true);
    }

    if (isTitleInvalid || isUserInvalid) {
      return;
    }

    const foundUser = usersFromServer.find(el => el.id === userId);
    const allId = todos.map(el => el.id);
    const newId = allId.length > 0 ? Math.max(...allId) + 1 : 1;

    if (!foundUser) {
      return;
    }

    const newTodo: Todo = {
      title: title.trim(),
      id: newId,
      completed: false,
      userId: userId,
      user: {
        name: foundUser.name,
        username: foundUser.username,
        email: foundUser.email,
      },
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setUserId(0);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            placeholder="Please enter a title"
            value={title}
            onChange={handleTitleChange}
          />
          {titleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId}
            onChange={handleUserChange}
          >
            <option value="0">Choose a user</option>
            {usersFromServer.map(el => (
              <option key={el.id} value={el.id}>
                {el.name}
              </option>
            ))}
          </select>
          {userError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList items={todos} />
    </div>
  );
};
