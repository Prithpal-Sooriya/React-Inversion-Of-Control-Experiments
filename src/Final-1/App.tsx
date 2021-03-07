import React, { useCallback } from 'react';
import type { Reducer, FC } from 'react';
import '../App.css';
import {
  defaultCounterReducer,
  defaultCounterState,
  useCounter,
  Counter,
  CounterActionsEnum,
} from './Counter';
import type { ICounterState, ICustomCounterReducer, IUseCounterProps } from './Counter';

const overwriteCounterState: ICounterState = {
  ...defaultCounterState,
  value: 2,
};

enum NewCounterActionsEnum {
  Reset = 'NewCounterActions_Reset',
}

const appendedCounterReducer: ICustomCounterReducer<NewCounterActionsEnum> = (state, action) => {
  switch (action) {
    case NewCounterActionsEnum.Reset:
      return { ...state, value: 0 };
    case CounterActionsEnum.Increment:
      return { ...state, value: state.value + 2 };
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

const combineReducers = <S, A>(...reducers: Array<Reducer<S, A>>): Reducer<S, A> => {
  const finalReducer: Reducer<S, A> = (initialState, action) => {
    return reducers.reduce((state, reducer) => reducer(state, action), initialState);
  };

  return finalReducer;
};

const useCounterPropsReducer = combineReducers(appendedCounterReducer, setDisabledReducer);

/*
  Example of Counter that uses the useCounterProps
  - Modifies the reducer function w/ additional functionalities
  - Modifies the initial state
*/
const App: FC = () => {
  const useCounterProps: IUseCounterProps<NewCounterActionsEnum> = useCounter(
    useCounterPropsReducer,
    overwriteCounterState,
  );
  const onReset = useCallback(() => useCounterProps.dispatch(NewCounterActionsEnum.Reset), [
    useCounterProps,
  ]);
  return (
    <div className="App">
      <h1>Example of Controlled Counter Component using Invariant of Control</h1>
      <h2>Uses Custom Hook that allows custom reducer/initial state for improved extensibility</h2>
      {/*
        Spreading as we want a new object props to be constrained to the counter actions (not the new actions).
        See by removing the object spread - the dispatches are different (since our new dispatch contains new actions).

        Likewise we could cast it to the constrained type (but want to prevent casting):
        <Counter useCounterProps={useCounterProps as unknown as IUseCounterProps<CounterActionsEnum>}/>
      */}
      <Counter useCounterProps={{ ...useCounterProps }} />
      <button onClick={onReset}>reset</button>
    </div>
  );
};

export default App;
