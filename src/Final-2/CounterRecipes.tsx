import React from 'react';
import BaseCounter, { getTypedCounter } from './Counter';
import type {
  ICounterProps,
  ITypedCounterSubComponents,
  IConnectedCounterButtonProps,
} from './Counter';
import { counterActionCreators } from './CounterContext';
import type { ICounterReducer } from './CounterContext';

interface IBasicCounterProps<R extends ICounterReducer> extends ICounterProps<R> {
  incrementDisabled?: IConnectedCounterButtonProps<R>['disabled'];
  decrementDisabled?: IConnectedCounterButtonProps<R>['disabled'];
}

type IBasicCounter<R extends ICounterReducer> = ITypedCounterSubComponents<R> &
  React.FC<IBasicCounterProps<R>>;

export const BasicCounter: IBasicCounter<ICounterReducer> = <R extends ICounterReducer>(
  props: IBasicCounterProps<R>,
) => {
  const {
    initialState,
    reducer,
    children,
    incrementDisabled,
    decrementDisabled,
  }: IBasicCounterProps<R> = props;
  const Counter = React.useMemo(() => getTypedCounter<R>(BaseCounter), []);
  return (
    <Counter initialState={initialState} reducer={reducer}>
      <Counter.ConnectedCounterButton
        onClick={(dispatch) =>
          dispatch(counterActionCreators.decrement(1) as React.ReducerAction<R>)
        }
        text="decrement"
        disabled={decrementDisabled}
      />
      <Counter.ConnectedCounterLabel text={(s) => s.value.toString()} />
      <Counter.ConnectedCounterButton
        onClick={(dispatch) =>
          dispatch(counterActionCreators.increment(1) as React.ReducerAction<R>)
        }
        text="increment"
        disabled={incrementDisabled}
      />
      {children}
    </Counter>
  );
};
BasicCounter.CounterButton = BaseCounter.CounterButton;
BasicCounter.CounterLabel = BaseCounter.CounterLabel;
BasicCounter.ConnectedCounterButton = BaseCounter.ConnectedCounterButton;
BasicCounter.ConnectedCounterLabel = BaseCounter.ConnectedCounterLabel;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTypedBasicCounter = <R extends React.Reducer<any, any>>(
  basicCounter: IBasicCounter<ICounterReducer>,
): IBasicCounter<R> => getTypedCounter(basicCounter);
