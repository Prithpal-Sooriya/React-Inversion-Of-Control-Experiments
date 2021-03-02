import React from 'react';
import Counter, { defaultCounterState, defaultCounterReducer } from './Counter';
import type {
  ICounterState,
  ICustomCounterReducer,
  IActionCreators,
  IActions,
} from './Counter';
import '../App.css';

const initialCounterState: ICounterState = {
  ...defaultCounterState,
  value: 2,
};

enum NewCounterActionsEnum {
  Reset = 'NewCounterActions_Reset',
}

type INewCounterActionCreator = {
  reset: IActionCreators<NewCounterActionsEnum.Reset, never>;
};

type INewCounterActions = IActions<INewCounterActionCreator>;

const actionCreators: INewCounterActionCreator = {
  reset: () => ({ type: NewCounterActionsEnum.Reset }),
};

const appendedCounterReducer: ICustomCounterReducer<INewCounterActions> = (
  state,
  action,
) => {
  switch (action.type) {
    case NewCounterActionsEnum.Reset:
      return { ...state, value: 0 };
    default:
      return defaultCounterReducer(state, action);
  }
};

function App() {
  return (
    <div className="App">
      <h1>Example of Invariant of Controlled Counter Component</h1>
      <Counter
        initialState={initialCounterState}
        customReducer={appendedCounterReducer}
      />
      <Counter initialState={initialCounterState} />
      <Counter customReducer={appendedCounterReducer} />
      <Counter />
    </div>
  );
}
