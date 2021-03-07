import React from 'react';
import { BasicCounter as BaseBasicCounter, getTypedBasicCounter } from './CounterRecipes';
import {
  ICounterState,
  ICustomCounterReducer,
  IActionCreators,
  IActionCreatorReturnType,
  defaultCounterState,
  defaultCounterReducer,
  counterActionCreators,
} from './CounterContext';
import '../App.css';

interface INewCounterState extends ICounterState {
  resetDisabled: boolean;
  incrementDisabled: boolean;
  decrementDisabled: boolean;
}
const initialCounterState: INewCounterState = {
  ...defaultCounterState,
  value: 2,
  resetDisabled: false,
  incrementDisabled: false,
  decrementDisabled: false,
};

enum NewCounterActionsEnum {
  Reset = 'NewCounterActions_Reset',
}

type INewCounterActionCreator = {
  reset: IActionCreators<NewCounterActionsEnum.Reset, never>;
};

type INewCounterActions = IActionCreatorReturnType<INewCounterActionCreator>;
type INewCounterReducer = ICustomCounterReducer<INewCounterState, INewCounterActions>;

const actionCreators: INewCounterActionCreator = {
  reset: () => ({ type: NewCounterActionsEnum.Reset }),
};

const newDefaultReducer: INewCounterReducer = (state, action) => {
  switch (action.type) {
    case NewCounterActionsEnum.Reset:
      return state;
    default:
      return { ...state, ...defaultCounterReducer(state, action) };
  }
};

const resetCounterReducer: INewCounterReducer = (state, action) => {
  switch (action.type) {
    case NewCounterActionsEnum.Reset:
      return { ...state, value: 0 };
    default:
      return state;
  }
};

const disableCounterReducer: INewCounterReducer = (state, action) => {
  const incrementDisabled = state.value > 10;
  const decrementDisabled = state.value < 0;
  const resetDisabled = state.value === 0;
  switch (action.type) {
    default: {
      return { ...state, incrementDisabled, decrementDisabled, resetDisabled };
    }
  }
};

const combineReducers = <S, A>(
  ...reducers: ReadonlyArray<React.Reducer<S, A>>
): React.Reducer<S, A> => (initialState: S, action: A) =>
  reducers.reduce((state, reducer) => reducer(state, action), initialState);

const resetReducer = combineReducers(newDefaultReducer, resetCounterReducer);
const resetAndDisableReducer = combineReducers(resetReducer, disableCounterReducer);

const BasicCounter = getTypedBasicCounter<INewCounterReducer>(BaseBasicCounter);

export default function App(): JSX.Element {
  const isDecrementDisabled = (s: INewCounterState) => s.decrementDisabled;
  const isIncrementDisabled = (s: INewCounterState) => s.incrementDisabled;
  const isResetDisabled = (s: INewCounterState) => s.resetDisabled;
  return (
    <div className="App">
      <h1>Example of Invariant of Controlled Counter Component</h1>
      <h2>
        Because of the compatibility of this IoC counter, we can make recipes (so we do not write up
        all elements)
      </h2>
      <BasicCounter initialState={initialCounterState} reducer={resetReducer}>
        <BasicCounter.ConnectedCounterButton
          onClick={(dispatch) => dispatch(actionCreators.reset())}
          text="Reset Counter"
        />
      </BasicCounter>

      <h1>Just like our previous tests, we can easily combine reducers and expand initial state</h1>
      <BasicCounter
        initialState={initialCounterState}
        reducer={resetAndDisableReducer}
        decrementDisabled={isDecrementDisabled}
        incrementDisabled={isIncrementDisabled}
      >
        <BasicCounter.ConnectedCounterButton
          onClick={(dispatch) => dispatch(counterActionCreators.decrement(5))}
          text="-5"
          disabled={isDecrementDisabled}
        />
        <BasicCounter.ConnectedCounterButton
          onClick={(dispatch) => dispatch(actionCreators.reset())}
          text="Reset Counter"
          disabled={isResetDisabled}
        />
        <BasicCounter.ConnectedCounterButton
          onClick={(dispatch) => dispatch(counterActionCreators.increment(5))}
          text="+5"
          disabled={isIncrementDisabled}
        />
      </BasicCounter>
    </div>
  );
}
