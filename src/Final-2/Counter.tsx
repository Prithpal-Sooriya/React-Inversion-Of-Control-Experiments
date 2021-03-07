import React from 'react';
import {
  CounterProvider,
  ICounterReducer,
  ReducerDispatch,
  useCounterDispatch,
  useCounterState,
} from './CounterContext';

type IConnectedCounterStateProp<R extends ICounterReducer, T> =
  | T
  | ((state: React.ReducerState<R>) => T);
type IConnectedCounterDispatchProp<R extends ICounterReducer, T> = T extends () => infer Return
  ? (dispatch: ReducerDispatch<R>, state: React.ReducerState<R>) => Return
  : never;

interface ICounterLabelProps {
  className?: string;
  text: string;
}
const CounterLabel: React.FC<ICounterLabelProps> = ({ text, className }: ICounterLabelProps) => (
  <span className={className}>{text}</span>
);

interface IConnectedCounterLabelProps<R extends ICounterReducer> {
  className?: IConnectedCounterStateProp<R, ICounterLabelProps['className']>;
  text: IConnectedCounterStateProp<R, ICounterLabelProps['text']>;
}
const ConnectedCounterLabel = <R extends ICounterReducer>({
  className,
  text,
}: IConnectedCounterLabelProps<R>) => {
  const state = useCounterState<R>();
  const _className = React.useMemo(
    () => (typeof className === 'function' ? className(state) : className),
    [className, state],
  );
  const _text = React.useMemo(() => (typeof text === 'function' ? text(state) : text), [
    state,
    text,
  ]);
  return <CounterLabel className={_className} text={_text} />;
};

interface ICounterButtonProps {
  className?: string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}
const CounterButton: React.FC<ICounterButtonProps> = ({
  className,
  onClick,
  text,
  disabled,
}: ICounterButtonProps) => (
  <button className={className} onClick={onClick} disabled={disabled}>
    {text}
  </button>
);

export interface IConnectedCounterButtonProps<R extends ICounterReducer> {
  className?: IConnectedCounterStateProp<R, ICounterButtonProps['className']>;
  text: IConnectedCounterStateProp<R, ICounterButtonProps['text']>;
  onClick: IConnectedCounterDispatchProp<R, ICounterButtonProps['onClick']>;
  disabled?: IConnectedCounterStateProp<R, ICounterButtonProps['disabled']>;
}

export const ConnectedCounterButton = <R extends ICounterReducer>({
  className,
  text,
  onClick,
  disabled,
}: IConnectedCounterButtonProps<R>): JSX.Element => {
  const state = useCounterState<R>();
  const dispatch = useCounterDispatch<R>();
  const _className = React.useMemo(
    () => (typeof className === 'function' ? className(state) : className),
    [className, state],
  );
  const _text = React.useMemo(() => (typeof text === 'function' ? text(state) : text), [
    state,
    text,
  ]);
  const _onClick = React.useCallback(() => onClick(dispatch, state), [onClick, dispatch, state]);
  const _disabled = React.useMemo(
    () => (typeof disabled === 'function' ? disabled(state) : disabled),
    [disabled, state],
  );
  return (
    <CounterButton className={_className} text={_text} onClick={_onClick} disabled={_disabled} />
  );
};

export interface ICounterProps<R extends ICounterReducer> {
  initialState?: React.ReducerState<R>;
  reducer?: R;
  children?: React.ReactNode;
}

export interface ITypedCounterSubComponents<R extends ICounterReducer> {
  CounterLabel: React.FC<ICounterLabelProps>;
  ConnectedCounterLabel: React.FC<IConnectedCounterLabelProps<R>>;
  CounterButton: React.FC<ICounterButtonProps>;
  ConnectedCounterButton: React.FC<IConnectedCounterButtonProps<R>>;
}
export type ITypedCounter<R extends ICounterReducer> = ITypedCounterSubComponents<R> &
  React.FC<ICounterProps<R>>;

const Counter: ITypedCounter<ICounterReducer> = <R extends ICounterReducer>(
  props: ICounterProps<R>,
): JSX.Element => {
  return (
    <CounterProvider initialState={props.initialState} reducer={props.reducer}>
      <div className="Counter">{props.children}</div>
    </CounterProvider>
  );
};
Counter.displayName = 'Counter';
Counter.CounterLabel = CounterLabel;
Counter.ConnectedCounterLabel = ConnectedCounterLabel;
Counter.CounterButton = CounterButton;
Counter.ConnectedCounterButton = ConnectedCounterButton;

export default Counter;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTypedCounter = <R extends React.Reducer<any, any>>(
  counter: ITypedCounter<ICounterReducer>,
): ITypedCounter<R> => (counter as unknown) as ITypedCounter<R>;
