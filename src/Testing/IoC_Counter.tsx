import React, { useReducer } from 'react';
import type { FC, Reducer } from 'react';

export interface ICounterState {
  value: number;
}

export enum CounterActionsEnum {
  Increment = 'CounterActions_Increment',
  Decrement = 'CounterActions_Decrement',
}

export type ICounterReducer = Reducer<ICounterState, CounterActionsEnum>;

export const defaultCounterState: ICounterState = {
  value: 0,
};

export const defaultCounterReducer: ICounterReducer = (
  state: ICounterState,
  action: CounterActionsEnum,
): ICounterState => {
  const exhaustedAction = (_: never): ICounterState => state;
  switch (action) {
    case CounterActionsEnum.Increment:
      return { ...state, value: state.value + 1 };
    case CounterActionsEnum.Decrement:
      return { ...state, value: state.value - 1 };
    default:
      return exhaustedAction(action);
  }
};

export const UnControlledCounter: FC = () => {
  const [{ value }, dispatch] = useReducer<ICounterReducer>(
    defaultCounterReducer,
    defaultCounterState,
  );
  return (
    <div className="Counter">
      <button onClick={() => dispatch(CounterActionsEnum.Decrement)}>Decrement</button>
      <span>Value {value}</span>
      <button onClick={() => dispatch(CounterActionsEnum.Increment)}>Increment</button>
    </div>
  );
};

interface IIoCCounterProps {
  initialState?: ICounterState;
  customReducer?: ICounterReducer;
}

export const IoCCounter: FC<IIoCCounterProps> = ({
  initialState = defaultCounterState,
  customReducer = defaultCounterReducer,
}: IIoCCounterProps) => {
  const [{ value }, dispatch] = useReducer<ICounterReducer>(customReducer, initialState);
  return (
    <div className="Counter">
      <button onClick={() => dispatch(CounterActionsEnum.Decrement)}>Decrement</button>
      <span>Value {value}</span>
      <button onClick={() => dispatch(CounterActionsEnum.Increment)}>Increment</button>
    </div>
  );
};
