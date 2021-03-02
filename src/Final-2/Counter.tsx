import React, { useReducer } from 'react';
import type { Reducer, Dispatch, FC } from 'react';

type IExtendsNeverBranch<Predicate, NeverType, ExistingType> = [
  Predicate,
] extends [never]
  ? NeverType
  : ExistingType;

export type IActionCreators<Type, Payload> = (
  p: Payload,
) => IExtendsNeverBranch<
  Payload,
  { type: Type },
  { type: Type; payload: Payload }
>;

export type IActions<ActionCreators extends object> = {
  [Key in keyof ActionCreators]: ActionCreators[Key] extends IActionCreators<
    infer T,
    infer P
  >
    ? ReturnType<IActionCreators<T, P>>
    : never;
}[keyof ActionCreators];

//#region Counter Reducer Setup
export interface ICounterState {
  value: number;
  // isIncrementDisabled: boolean;
  // isDecrementDisabled: boolean;
}

export enum CounterActionTypesEnum {
  Increment = 'CounterActionTypes_Increment',
  Decrement = 'CounterActionTypes_Decrement',
}

type ICounterActionsCreators = {
  increment: IActionCreators<CounterActionTypesEnum.Increment, number>;
  decrement: IActionCreators<CounterActionTypesEnum.Decrement, number>;
};

type ICounterActions = ReturnType<
  ICounterActionsCreators[keyof ICounterActionsCreators]
>;
export type ICounterReducer = Reducer<ICounterState, ICounterActions>;
export type ICustomCounterReducer<Actions> = Reducer<
  ICounterState,
  ICounterActions | Actions
>;
export type ICustomCounterDispatch<Actions> = Dispatch<
  ICounterActions | Actions
>;

export const counterActionCreators: ICounterActionsCreators = {
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
//#endregion

interface ICounterButtonProps<Actions> {
  onClick?: (
    state: ICounterState,
    dispatch: ICustomCounterDispatch<Actions>,
  ) => () => void;
  disabled?: (state: ICounterState) => () => void;
  // text: string
}

interface ICounterProps<Actions> {
  initialState?: ICounterState;
  customReducer?: ICustomCounterReducer<Actions>;
  // LeftButton: ()
  // LeftButton: React.ReactElement<ICounterButtonProps<Actions>>;
  children?: React.ReactNode;
}

const cloneButton = <Actions extends object>(
  child: React.ReactElement<ICounterButtonProps<Actions>>,
  state: ICounterState,
  dispatch: ICustomCounterDispatch<Actions>,
) => {
  if (React.isValidElement(child)) {
    const props = child.props;
    if (props.onClick !== undefined) {
      // we want to inject the dependency into the onclick
      // so we can have a clean api compared to render props
      // in example below - dispatch is injected and scoped to onClick.
      // E.g. onClick={(dispatch) => dispatch(NewCounterActionsEnum.Reset)}
      props.onClick;

      // Worst case if this is not possible = we can useContext
      // Counter.Button will call the internal useContext & maybe then we can have a custom onClick?
    }
  }
  return child;
};

const Counter = <Actions extends object>(props: ICounterProps<Actions>) => {
  const {
    initialState = defaultCounterState,
    customReducer = defaultCounterReducer,
    // LeftButton,
    children,
  } = props;
  const [state, dispatch] = useReducer(customReducer, initialState);

  // React.Children.map(children, child => {
  //   return null;
  // })

  // LeftButton.props;

  return (
    <div className="Counter">
      {/* <LeftButton /> */}
      <span>Value {state.value}</span>
      <button onClick={() => dispatch(counterActionCreators.increment(1))}>
        Increment
      </button>
    </div>
  );
};

export default Counter;
