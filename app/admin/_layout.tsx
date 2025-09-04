import { Stack } from 'expo-router';
import { withAdminAccess } from '../../components/AdminOnly';
import { AuthErrorBoundary } from '../../components/AuthErrorBoundary';

function AdminLayout() {
  return (
    <AuthErrorBoundary>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            title: 'Admin Panel',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#dc2626', // red-600
            },
            headerTintColor: '#ffffff',
          }}
        />
      </Stack>
    </AuthErrorBoundary>
  );
}

export default withAdminAccess(AdminLayout);
