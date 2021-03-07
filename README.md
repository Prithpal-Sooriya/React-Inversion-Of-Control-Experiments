# React - Inversion of Control tricks.

This was a quick experiment for testing mechanisms that use Inversion of Control.
You can use `npm start` to start a local dev server on `http://localhost:8080/`

Things that sparked my interest:
Original Kent C Dodds post: https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks
Focuses on IoC to decouple and make a components state and logic more extensible

- Using Inversion of control to simplify components and allow more flexibility for users (engineers) using our components.
- We can use IoC to:

  - reduce the number of props on our components
  - Modify and expand logic for the components (making them more extensible)
  - Making it easier to test our component states & actions (reducers are easy to test in isolation & we can inject custom state/reducers)
  - Separation of logic from UI.

- Reducers are also nice as we can easily convert the useReducer to a Context/useContext pattern - or even move to an external state management library (e.g. redux).

Dylan Widjaja's talk about IoC from further investigation
Focuses on IoC to decouple our UI itself - to build a more extensible design system.

- Kent also covers this briefly - and you can see this pattern with other external UI Libraries.

Inversion of Control for component logic can vary depending on needs.

1. Simple component that is not shared frequently = no need to use IoC. Can be overkill.
2. If we want new logic but no extension to the state/actions (e.g. Counter Bounds/Counter increment) = Pass in Reducer Prop

- One of my favorites - state still exists in child component so will not re-render!

3. Add new state/actions (e.g. new reset action and reset button)

   1. Pass state & reducer up to parent (using hook to construct the reducer & props used for the child) = this is good, but re-renders will occur on parent instead of child.


   2. Pass Custom Reducer & State to child, but encapsulate other components as children - using render props to pass dispatch?

      - A tad ugly, and not as user friendly for users (other engineers).

   3. Similar to above - but encapsulate other components with other child components (UI IoC)?
      - Not sure how the typescripts types would work (especially for passing the dispatch) - but would be an awesome API!
      - Example Below

```tsx
return (
  <Counter reducer={customReducer} initalState={customInitialState}>
    <Counter.Button
      // dispatch will accept the new actions on the custom reducer & is typed correctly!
      onClick={(dispatch) => dispatch(NewCounterActionsEnum.Reset)}
    >
      reset
    </Counter.Button>
  </Counter>
);
```

TODO:
- Create Doc for levels of inversion (for UI and UI logic)
