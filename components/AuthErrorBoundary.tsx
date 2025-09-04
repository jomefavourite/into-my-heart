import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is an authentication error
    const isAuthError =
      error.message.includes('Authentication required') ||
      error.message.includes('User account not found') ||
      error.message.includes('Unauthorized');

    return {
      hasError: isAuthError,
      error: isAuthError ? error : undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className='flex-1 items-center justify-center p-6 bg-gray-50'>
          <View className='bg-white rounded-lg p-6 shadow-md max-w-sm w-full'>
            <Text className='text-xl font-bold text-red-600 mb-2 text-center'>
              Authentication Error
            </Text>
            <Text className='text-gray-600 mb-4 text-center'>
              {this.state.error?.message || 'Please sign in to continue.'}
            </Text>
            <TouchableOpacity
              onPress={this.handleRetry}
              className='bg-blue-600 py-3 px-4 rounded-md'
            >
              <Text className='text-white font-medium text-center'>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// HOC version for easier use
export function withAuthErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function AuthProtectedComponent(props: P) {
    return (
      <AuthErrorBoundary fallback={fallback}>
        <Component {...props} />
      </AuthErrorBoundary>
    );
  };
}
