import React, { useReducer, useCallback } from 'react';
import type { Reducer, Dispatch } from 'react';

export interface ICounterState {
  value: number;
  isIncrementDisabled: boolean;
  isDecrementDisabled: boolean;
}

export enum CounterActionsEnum {
  Increment = 'CounterActions_Increment',
  Decrement = 'CounterActions_Decrement',
}

export type ICounterReducer = Reducer<ICounterState, CounterActionsEnum>;
export type ICustomCounterReducer<ActionTypes extends string> = Reducer<
  ICounterState,
  CounterActionsEnum | ActionTypes
>;

export const defaultCounterState: ICounterState = {
  value: 0,
  isIncrementDisabled: false,
  isDecrementDisabled: false,
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

export interface IUseCounterProps<ActionTypes extends string> {
  increment: () => void;
  decrement: () => void;
  state: ICounterState;
  dispatch: Dispatch<CounterActionsEnum | ActionTypes>;
}

export const useCounter = <ActionTypes extends string>(
  customReducer: ICustomCounterReducer<ActionTypes>,
  initialState: ICounterState = defaultCounterState,
): IUseCounterProps<ActionTypes> => {
  const [state, dispatch] = useReducer(customReducer, initialState);

  const increment = useCallback(() => dispatch(CounterActionsEnum.Increment), []);

  const decrement = useCallback(() => dispatch(CounterActionsEnum.Decrement), []);

  return {
    increment,
    decrement,
    state,
    dispatch,
  };
};

interface ICounterProps {
  useCounterProps?: IUseCounterProps<CounterActionsEnum>;
}
export const Counter = (props: ICounterProps): JSX.Element => {
  const defaultCounterProps = useCounter(defaultCounterReducer, defaultCounterState);
  const { useCounterProps } = props;
  const { increment, decrement, state } = useCounterProps || defaultCounterProps;
  return (
    <div className="Counter">
      <button onClick={decrement} disabled={state.isDecrementDisabled}>
        Decrement
      </button>
      <span>Value {state.value}</span>
      <button onClick={increment} disabled={state.isIncrementDisabled}>
        Increment
      </button>
    </div>
  );
};
