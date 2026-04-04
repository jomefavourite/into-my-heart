import React from 'react';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import SettingsIcon from '@/components/icons/SettingsIcon';

export default function PracticeSettingsButton() {
  const router = useRouter();

  return (
    <Button
      size='icon'
      variant='ghost'
      onPress={() => router.push('/memorize/settings')}
    >
      <SettingsIcon />
    </Button>
  );
}
