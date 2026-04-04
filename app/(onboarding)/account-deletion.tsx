import React from 'react';
import { Link } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Account Deletion',
  description:
    'Learn how to permanently delete your Into My Heart account and what data is removed during deletion.',
};

export default function AccountDeletionScreen() {
  return (
    <LegalPageLayout
      title='Account Deletion'
      description='Into My Heart supports permanent account deletion inside the app. This page explains how deletion works and what data is removed.'
    >
      <Section title='How to delete your account'>
        <Bullet>Sign in to Into My Heart.</Bullet>
        <Bullet>Open the Profile tab.</Bullet>
        <Bullet>Select Delete account and confirm the deletion prompt.</Bullet>
      </Section>

      <Section title='What happens when you delete'>
        <Bullet>
          Your saved verses, collections, notes, affirmations, and practice
          history are permanently removed from the app backend.
        </Bullet>
        <Bullet>
          Your local offline app data is cleared from the device during the
          deletion flow.
        </Bullet>
        <Bullet>
          Your Clerk account is deleted after app data removal completes.
        </Bullet>
      </Section>

      <Section title='Before you continue'>
        <Bullet>
          Account deletion is permanent and cannot be undone.
        </Bullet>
        <Bullet>
          If you only want to stop using the app for now, you can sign out
          instead of deleting your account.
        </Bullet>
      </Section>

      <Section title='Open the app'>
        <ThemedText className='leading-7 text-[#4d4d4d]'>
          Use the app to delete your account immediately:
        </ThemedText>
        <Link href='/onboard' className='pt-1'>
          <ThemedText className='text-base font-medium text-[#313131] underline'>
            Sign in to Into My Heart
          </ThemedText>
        </Link>
      </Section>

      <Section title='Last updated'>
        <ThemedText className='leading-7 text-[#4d4d4d]'>
          April 2, 2026
        </ThemedText>
      </Section>
    </LegalPageLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <ThemedText className='text-xl font-semibold text-[#1c1c1c]'>
        {title}
      </ThemedText>
      {children}
    </React.Fragment>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <ThemedText className='leading-7 text-[#4d4d4d]'>
      {'\u2022'} {children}
    </ThemedText>
  );
}
