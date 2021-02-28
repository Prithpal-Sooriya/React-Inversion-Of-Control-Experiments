import React from 'react';

/* Example of a fully controlled counter component */
interface ICounterProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export const Counter: React.FC<ICounterProps> = ({
  value,
  onDecrement,
  onIncrement,
}) => {
  return (
    <div className="Counter">
      <button onClick={onDecrement}>Decrement</button>
      <span>Value {value}</span>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
};
