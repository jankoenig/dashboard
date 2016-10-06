// Help with this pattern from http://www.mattgreer.org/articles/typescript-react-and-redux/
// and this thread https://github.com/reactjs/redux/issues/992

interface Action<T> {
  type: string;
  payload: T;
  error?: boolean;
  meta?: any;
}

export default Action;
