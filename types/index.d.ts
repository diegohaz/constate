declare interface ReduxDevtoolsExtension {
  connect: (
    options: { name: string }
  ) => {
    init: (initialState: any) => void;
    send: (type: string, state: any) => void;
    subscribe: (
      callback: (message: { type: string; state: string }) => void
    ) => void;
    unsubscribe: () => void;
  };
  disconnect: () => void;
}

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: ReduxDevtoolsExtension;
}
