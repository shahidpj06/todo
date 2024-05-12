import React from 'react'

const TodoFilter = ({todos}) => {
  const completedTodos = todos.filter(todo => todo.status == true).length;
  const pendingTodos = todos.length - completedTodos;

  return (
    <div>
      <br />
      <p style={{ color: 'white', textAlign: 'center' }}>Summary: {completedTodos}/{completedTodos + pendingTodos} tasks completed</p>
      <br />
    </div>
  );
};

export default TodoFilter