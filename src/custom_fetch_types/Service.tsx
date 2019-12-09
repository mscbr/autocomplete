// custom type interfaces for API fetch

// custom hook initialization
interface ServiceInit {
    status: 'init';
  }
// data fetching in progress
interface ServiceLoading {
  status: 'loading';
}
// fetching successfully finished
interface ServiceLoaded<T> {
  status: 'loaded';
  payload: T;
}
// request error
interface ServiceError {
  status: 'error';
  error: Error;
}
// wrapping all types together
export type Service<T> =
  | ServiceInit
  | ServiceLoading
  | ServiceLoaded<T>
  | ServiceError;
