import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import ThemedText from '@/components/ThemedText';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  image: string;
  read: boolean;
};

const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Message from Sarah',
    description: 'Hey! Just checking in on the project...',
    time: '2 min ago',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    read: false,
  },
  {
    id: '2',
    title: 'Meeting Reminder',
    description: 'Team standup in 15 minutes',
    time: '15 min ago',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100',
    read: true,
  },
  {
    id: '3',
    title: 'Project Update',
    description: 'The design team has shared new assets',
    time: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
    read: false,
  },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Notifications'
        items={[{ label: 'Notification', href: '/notifications' }]}
      />

      <ScrollView style={styles.container}>
        <ThemedText>Hello Notification</ThemedText>
        {notifications.map(notification => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              notification.read && styles.readNotification,
            ]}
          >
            <Image source={{ uri: notification.image }} style={styles.avatar} />
            <View style={styles.content}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.description}>{notification.description}</Text>
              <Text style={styles.time}>{notification.time}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  readNotification: {
    backgroundColor: '#f8f8f8',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
});
