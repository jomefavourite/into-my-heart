import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's an authentication error
    if (
      error.message.includes('Authentication required') ||
      error.message.includes('Please sign in') ||
      error.message.includes('User account not found')
    ) {
      return { hasError: true, error };
    }

    // For other errors, don't catch them
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className='flex-1 items-center justify-center p-4'>
          <Text className='mb-2 text-lg font-semibold text-red-600'>
            Authentication Error
          </Text>
          <Text className='mb-4 text-center text-gray-600'>
            Please sign in to continue using the app.
          </Text>
          <Button
            title='Go to Sign In'
            onPress={() => {
              this.setState({ hasError: false });
              // This will be handled by the router in the parent component
            }}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
