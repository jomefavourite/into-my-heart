import React from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Platform } from 'react-native';
import Logo from '@/components/icons/logo/Logo';
import ThemedText from '@/components/ThemedText';

type LegalPageLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function LegalPageLayout({
  title,
  description,
  children,
}: LegalPageLayoutProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1 bg-white'>
      {Platform.OS === 'web' && (
        <>
          <title>{`${title} | Into My Heart`}</title>
          <meta name='description' content={description} />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:title' content={`${title} | Into My Heart`} />
          <meta property='og:description' content={description} />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
        </>
      )}

      <ScrollView
        className='flex-1 bg-white'
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className='mx-auto w-full max-w-4xl px-6 py-6 md:px-10 md:py-10'>
          <View className='flex-row items-center justify-between border-b border-[#e7e7e7] pb-5'>
            <Link href='/' className='flex-row items-center'>
              <Logo />
            </Link>

            <Link
              href='/onboard'
              className='rounded-full bg-[#313131] px-5 py-3'
            >
              <ThemedText className='text-sm font-medium text-white'>
                Open app
              </ThemedText>
            </Link>
          </View>

          <View className='max-w-3xl gap-6 py-8 md:py-10'>
            <View className='gap-3'>
              <ThemedText className='text-sm uppercase tracking-[1.6px] text-[#707070]'>
                Into My Heart
              </ThemedText>
              <ThemedText className='text-3xl font-semibold text-[#1c1c1c] md:text-[40px]'>
                {title}
              </ThemedText>
              <ThemedText className='text-base leading-7 text-[#5d5d5d]'>
                {description}
              </ThemedText>
            </View>

            <View className='gap-5'>{children}</View>

            <View className='gap-3 rounded-3xl bg-[#f6f4ef] p-5'>
              <ThemedText className='text-lg font-medium text-[#1c1c1c]'>
                Need the app?
              </ThemedText>
              <ThemedText className='leading-6 text-[#5d5d5d]'>
                You can create an account, manage your saved Scripture, and
                delete your account directly inside Into My Heart.
              </ThemedText>
              <View className='flex-row flex-wrap gap-3'>
                <Link
                  href='/onboard'
                  className='rounded-full bg-[#313131] px-5 py-3'
                >
                  <ThemedText className='text-sm font-medium text-white'>
                    Get started
                  </ThemedText>
                </Link>
                <Link href='/' className='rounded-full border border-[#d6d1c7] px-5 py-3'>
                  <ThemedText className='text-sm font-medium text-[#313131]'>
                    Back to home
                  </ThemedText>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
