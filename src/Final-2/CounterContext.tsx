import React from 'react';

//#region Context Utility Types
type IIsNever<Predicate, NeverType, ExistingType> = [Predicate] extends [never]
  ? NeverType
  : ExistingType;

export type IActionCreators<Type, Payload> = (
  ...args: IIsNever<Payload, never, [Payload]>
) => IIsNever<Payload, { type: Type }, { type: Type; payload: Payload }>;

export type IActionCreatorReturnType<ActionCreators extends Record<string, unknown>> = {
  [Key in keyof ActionCreators]: ActionCreators[Key] extends IActionCreators<infer T, infer P>
    ? ReturnType<IActionCreators<T, P>>
    : never;
}[keyof ActionCreators];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReducerDispatch<R extends React.Reducer<any, any>> = React.Dispatch<
  React.ReducerAction<R>
>;
//#endregion

//#region Counter Action/Reducers Setup
export interface ICounterState {
  value: number;
}

export enum CounterActionTypesEnum {
  Increment = 'CounterActionTypes_Increment',
  Decrement = 'CounterActionTypes_Decrement',
}

type ICounterActionCreators = {
  increment: IActionCreators<CounterActionTypesEnum.Increment, number>;
  decrement: IActionCreators<CounterActionTypesEnum.Decrement, number>;
};

export type ICounterActions = IActionCreatorReturnType<ICounterActionCreators>;
export type ICounterReducer = React.Reducer<ICounterState, ICounterActions>;
export type ICustomCounterReducer<State extends ICounterState, Actions> = React.Reducer<
  State,
  ICounterActions | Actions
>;
export type ICustomCounterDispatch<Actions> = React.Dispatch<ICounterActions | Actions>;

export const counterActionCreators: ICounterActionCreators = {
  increment: (payload) => ({ type: CounterActionTypesEnum.Increment, payload }),
  decrement: (payload) => ({ type: CounterActionTypesEnum.Decrement, payload }),
};

export const defaultCounterState: ICounterState = {
  value: 0,
};

export const defaultCounterReducer: ICounterReducer = (
  state: ICounterState,
  action: ICounterActions,
) => {
  const exhaustAction = (_: never): ICounterState => state;
  const { type, payload } = action;
  switch (type) {
    case CounterActionTypesEnum.Increment:
      return { ...state, value: state.value + payload };
    case CounterActionTypesEnum.Decrement:
      return { ...state, value: state.value - payload };
    default:
      return exhaustAction(type);
  }
};

const getTypedDefaultReducer = <R extends ICounterReducer>(defaultReducer: ICounterReducer): R =>
  defaultReducer as R;
const getTypedDefaultState = <R extends ICounterReducer>(
  defaultState: React.ReducerState<ICounterReducer>,
): React.ReducerState<R> => defaultState as React.ReducerState<R>;
//#endregion

//#region Context Setup
const CounterStateContext = React.createContext<React.ReducerState<ICounterReducer> | undefined>(
  undefined,
);
const CounterDispatchContext = React.createContext<ReducerDispatch<ICounterReducer> | undefined>(
  undefined,
);

const getTypedStateContext = <R extends ICounterReducer>(
  stateContext: React.Context<React.ReducerState<ICounterReducer> | undefined>,
) => stateContext as React.Context<React.ReducerState<R> | undefined>;
const getTypedDispatchContext = <R extends ICounterReducer>(
  dispatchContext: React.Context<ReducerDispatch<ICounterReducer> | undefined>,
) => dispatchContext as React.Context<React.Dispatch<React.ReducerAction<R>> | undefined>;

interface ICounterProviderProps<Reducer extends ICounterReducer> {
  initialState?: React.ReducerState<Reducer>;
  reducer?: Reducer;
  children?: React.ReactNode;
}

export const CounterProvider = <R extends ICounterReducer>(
  props: ICounterProviderProps<R>,
): JSX.Element => {
  const {
    initialState = getTypedDefaultState<R>(defaultCounterState),
    reducer = getTypedDefaultReducer<R>(defaultCounterReducer),
    children,
  } = props;
  // type IReducerTuple = [React.ReducerState<R>, ReducerDispatch<R>]
  const [state, dispatch] = React.useReducer<R>(reducer, initialState);
  const InternalCounterStateContext = React.useMemo(
    () => getTypedStateContext<R>(CounterStateContext),
    [],
  );
  const InternalCounterDispatchContext = React.useMemo(
    () => getTypedDispatchContext<R>(CounterDispatchContext),
    [],
  );
  return (
    <InternalCounterStateContext.Provider value={state}>
      <InternalCounterDispatchContext.Provider value={dispatch}>
        {children}
      </InternalCounterDispatchContext.Provider>
    </InternalCounterStateContext.Provider>
  );
};
//#endregion

//#region Context Hooks
export const useCounterState = <R extends ICounterReducer>(): React.ReducerState<R> => {
  const context = getTypedStateContext<R>(CounterStateContext);
  const state = React.useContext(context);
  if (state === undefined) {
    throw new TypeError(
      'Counter Context State does not exist, useCounterState must be used within a CounterProvider',
    );
  }
  return state;
};

export const useCounterDispatch = <R extends ICounterReducer>(): ReducerDispatch<R> => {
  const context = getTypedDispatchContext<R>(CounterDispatchContext);
  const dispatch = React.useContext(context);
  if (dispatch === undefined) {
    throw new TypeError(
      'Counter Context State does not exist, useCounterDispatch must be used within a CounterProvider',
    );
  }
  return dispatch;
};
//#endregion
