import React from 'react';
import ThemedText from '@/components/ThemedText';
import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Terms of Service',
  description:
    'Read the basic launch terms for using Into My Heart and creating an account.',
};

export default function TermsOfServiceScreen() {
  return (
    <LegalPageLayout
      title='Terms of Service'
      description='These launch terms describe the basic rules for using Into My Heart and the responsibilities that come with creating an account.'
    >
      <Section title='Using the app'>
        <Bullet>
          Into My Heart is provided to help you memorize and practice Scripture.
        </Bullet>
        <Bullet>
          You are responsible for keeping your sign-in credentials secure and
          for activity that happens under your account.
        </Bullet>
        <Bullet>
          You agree not to misuse the app, interfere with the service, or try
          to access data that does not belong to you.
        </Bullet>
      </Section>

      <Section title='Your content'>
        <Bullet>
          You keep responsibility for the notes, affirmations, collections, and
          other content you create in the app.
        </Bullet>
        <Bullet>
          You give Into My Heart permission to store and process that content so
          the app can sync, display, and restore it for your use.
        </Bullet>
      </Section>

      <Section title='Availability'>
        <Bullet>
          We may update, improve, or remove parts of the app as the product
          evolves.
        </Bullet>
        <Bullet>
          We do our best to keep the service available, but we cannot guarantee
          uninterrupted access at all times.
        </Bullet>
      </Section>

      <Section title='Account closure'>
        <Bullet>
          You can stop using the app at any time.
        </Bullet>
        <Bullet>
          You can permanently delete your account from the Profile screen inside
          the app.
        </Bullet>
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
