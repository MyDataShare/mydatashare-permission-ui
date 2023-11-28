import React, { ErrorInfo, ReactNode } from 'react';

import { Error as ErrorComponent } from 'components/common';

interface Props {
  logOutUser: boolean;
  children?: ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary for catching errors during the render phase.
 *
 * Displays an error page with the error message.
 *
 * If the prop `logOutUser` with value `true` is given, the user is logged out
 * after catching the error.
 */
class ErrorBoundary extends React.Component<Props, State> {
  logOutUser: boolean;

  constructor(props: Props) {
    super(props);
    this.logOutUser = !!props.logOutUser;
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <ErrorComponent
          message={this.state.error?.message}
          logOutUser={this.logOutUser}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
