import React, { useCallback, useState } from 'react';
import { Counter } from './Counter';
import {
  UnControlledCounter,
  IoCCounter,
  defaultCounterState,
  CounterActionsEnum,
} from './IoC_Counter';
import {
  useCounterProps,
  IoCCounterWithHooks,
  defaultCounterReducer,
  defaultCounterState as iIoCCounterWithHooksDefaultState,
} from './IoC_CounterWithHooks';
import type { ICounterReducer, ICounterState } from './IoC_Counter';
import type { ICustomCounterReducer } from './IoC_CounterWithHooks';
import '../App.css';

const initialCounterState: ICounterState = {
  ...defaultCounterState,
  value: 2,
};

const overwriteCounterReducer: ICounterReducer = (state, action) => {
  const exhaustedAction = (_: never) => state;
  switch (action) {
    case CounterActionsEnum.Increment:
      return { ...state, value: state.value + 2 };
    case CounterActionsEnum.Decrement:
      return { ...state, value: state.value - 2 };
    default:
      return exhaustedAction(action);
  }
};

enum NewCounterActionsEnum {
  Reset = 'NewCounterActions_Reset',
}

const appendedCounterReducer: ICustomCounterReducer<NewCounterActionsEnum> = (state, action) => {
  switch (action) {
    case NewCounterActionsEnum.Reset:
      return { ...state, value: 0 };
    default:
      return defaultCounterReducer(state, action);
  }
};

const setDisabledReducer: ICustomCounterReducer<NewCounterActionsEnum> = (state, action) => {
  return {
    ...state,
    isDecrementDisabled: state.value <= 0,
    isIncrementDisabled: state.value >= 10,
  };
};

const combineReducers = <S, A>(...reducers: Array<React.Reducer<S, A>>): React.Reducer<S, A> => {
  const combinedReducer: React.Reducer<S, A> = (initialState, action) => {
    return reducers.reduce((state, reducer) => reducer(state, action), initialState);
  };

  return combinedReducer;
};

const combinedCounterPropsReducer = combineReducers(appendedCounterReducer, setDisabledReducer);
const useCounterPropsInitialState = combinedCounterPropsReducer(
  iIoCCounterWithHooksDefaultState,
  NewCounterActionsEnum.Reset,
);

const IoCCounterWithReset: React.FC = () => {
  const counterProps = useCounterProps<NewCounterActionsEnum>(
    combinedCounterPropsReducer,
    useCounterPropsInitialState,
  );
  const onReset = useCallback(() => counterProps.dispatch(NewCounterActionsEnum.Reset), [
    counterProps,
  ]);
  return (
    <>
      <IoCCounterWithHooks {...counterProps} />
      <button onClick={onReset}>reset</button>
    </>
  );
};

function App(): JSX.Element {
  const [counterValue, setCounterValue] = useState(0);
  const onIncrement = () => setCounterValue((c) => c + 1);
  const onDecrement = () => setCounterValue((c) => c - 1);
  return (
    <div className="App">
      <h1>Example of Controlled Counter Component</h1>
      <Counter {...{ value: counterValue, onIncrement, onDecrement }} />

      <h1>Example of a Uncontrolled Counter Component (that uses reducer pattern)</h1>
      <UnControlledCounter />

      <h1>Inversion of Control Counter Component</h1>
      <h2>We can pass in an initial state and a reducer (so we can customize actions)</h2>
      <IoCCounter initialState={initialCounterState} customReducer={overwriteCounterReducer} />

      <h1>Inversion of Control using Hooks</h1>
      <h2>
        Hooks allow us to decouple logic from components (easy to reuse/move logic to components)
      </h2>
      <IoCCounterWithReset />
    </div>
  );
}

export default App;
