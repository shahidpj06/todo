import React from 'react'

const TodoFilter = ({todos}) => {
  const completedTodos = todos.filter(todo => todo.status == true).length;
  const pendingTodos = todos.length - completedTodos;

  return (
    <div>
      <p style={{ color: 'white' }}>Summary: {completedTodos}/{completedTodos + pendingTodos} tasks completed</p>
    </div>
  );
};

export default TodoFilter