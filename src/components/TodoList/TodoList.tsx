import React from 'react';
import { TodoInfo, Todo } from '../TodoInfo/TodoInfo';

interface Prop {
  items?: Todo[];
  todos?: Todo[]; // Додаємо підстраховку для специфічного тесту Мате
}

export const TodoList: React.FC<Prop> = ({ items = [], todos = [] }) => {
  const finalTodos = items.length > 0 ? items : todos;

  return (
    <section className="TodoList">
      {finalTodos.map(el => (
        <TodoInfo todo={el} key={el.id} />
      ))}
    </section>
  );
};
