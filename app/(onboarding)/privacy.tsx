import React from 'react';
import ThemedText from '@/components/ThemedText';
import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Learn what personal data Into My Heart collects, how we use it, and how you can manage or delete your account.',
};

export default function PrivacyPolicyScreen() {
  return (
    <LegalPageLayout
      title='Privacy Policy'
      description='This launch policy explains what Into My Heart collects for account access, profile setup, syncing, and Scripture memorization features.'
    >
      <Section title='Information we collect'>
        <Bullet>
          Account details you provide through Clerk, including your email
          address, first name, last name, and optional profile image.
        </Bullet>
        <Bullet>
          Content you create in the app, such as saved verses, collections,
          notes, affirmations, and practice history.
        </Bullet>
        <Bullet>
          Basic technical information needed to keep the app working, such as
          authentication and sync identifiers.
        </Bullet>
      </Section>

      <Section title='How we use this information'>
        <Bullet>
          To sign you in securely and keep your account available across
          devices.
        </Bullet>
        <Bullet>
          To save your Scripture memorization progress and sync your data with
          the app backend.
        </Bullet>
        <Bullet>
          To let you personalize your profile, including selecting a profile
          image from your photo library.
        </Bullet>
      </Section>

      <Section title='Storage and sharing'>
        <Bullet>
          Into My Heart stores app data locally on your device and syncs account
          data to Convex so your saved content can stay available when you sign
          back in.
        </Bullet>
        <Bullet>
          We use Clerk for authentication and account management. We do not sell
          your personal data.
        </Bullet>
        <Bullet>
          We only share your information with service providers that help us run
          the app, such as authentication and backend infrastructure.
        </Bullet>
      </Section>

      <Section title='Your choices'>
        <Bullet>
          You can update your profile details inside the app at any time.
        </Bullet>
        <Bullet>
          You can delete your account from the Profile screen inside the app.
        </Bullet>
        <Bullet>
          Deleting your account permanently removes your saved verses,
          collections, notes, affirmations, and practice history from the app
          backend.
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
