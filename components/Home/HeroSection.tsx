import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Logo from '../icons/logo/Logo';
import { Href, Link, useRouter } from 'expo-router';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react-native';
import CustomButton from '../CustomButton';
import { Card } from '../ui/card';
import { Image } from 'react-native';

// Navigation links data
const navigationLinks: { name: string; href: Href }[] = [
  // { name: 'Home', href: '/' },
  { name: 'Our Approach', href: '/#approach' },
  { name: 'Key Features', href: '/#key-features' },
  // { name: 'Donate', href: '/donate' },
];

const HeroSection = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative w-full'>
      {/* Navigation Bar */}

      <header className='w-full border-b bg-white'>
        <div className='container mx-auto flex items-center justify-between px-4 py-3 md:px-6'>
          <Link href='/' className='flex items-center'>
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden items-center space-x-8 md:flex'>
            {navigationLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className='text-sm font-medium text-gray-700 transition-colors hover:text-gray-900'
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className='hidden items-center space-x-3 md:flex'>
            <CustomButton onPress={() => router.push('/onboard')}>
              Get Started
            </CustomButton>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
              <div className='mt-6 flex flex-col space-y-4'>
                {/* Mobile Navigation Links */}
                <nav className='flex flex-col space-y-4'>
                  {navigationLinks.map(link => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className='py-2 text-lg font-medium text-gray-700 transition-colors hover:text-gray-900'
                      // onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Action Buttons */}
                <div className='flex flex-col space-y-3 border-t pt-6'>
                  <Button
                    variant='outline'
                    className='w-full bg-transparent'
                    onPress={() => router.push('/onboard')}
                  >
                    Sign In
                  </Button>
                  <Button
                    className='w-full bg-gray-900 hover:bg-gray-800'
                    onPress={() => router.push('/onboard')}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className='container mx-auto grid gap-6 px-6 py-[50px] lg:grid-cols-2 lg:px-[107px]'>
        <div className='flex flex-col justify-center gap-7'>
          <div className='mx-auto flex w-full flex-col items-center justify-center gap-3 lg:mx-0 lg:items-start lg:text-left'>
            <h1 className='max-w-2xl text-center font-onest text-[32px] font-semibold text-[#313131] md:text-[44px] md:leading-[53px] md:tracking-[-0.44px] lg:text-left'>
              The Engaging Way To Keep{' '}
              <span className='text-[#1c1c1c]'>God&apos;s Word</span> In Your
              Heart
            </h1>

            <p className='max-w-xl text-center text-base font-medium leading-6 tracking-[0.16px] text-[#707070] lg:ml-0 lg:text-left'>
              Build a daily habit of engaging with God&#39;s Word. Our app helps
              you memorize Bible verses in KJV with proven techniques, save
              notes, and return to guided practice whenever you&apos;re ready.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className='mx-auto flex gap-3 lg:ml-0'>
            <CustomButton
              onPress={() => router.push('/onboard')}
              className='w-full flex-1'
            >
              Get Started
            </CustomButton>
          </div>
        </div>
        {/* Move to the right */}
        <div className='mx-auto w-full lg:ml-auto lg:justify-end'>
          {/* Phone mockup card */}
          <Card className='mx-auto w-full overflow-hidden rounded-[20px] border-none bg-neutral-50 md:w-[460px]'>
            <div className='relative w-full'>
              <Image
                className='mx-auto hidden h-auto w-full object-contain md:block'
                alt='iPhone showing app interface'
                source={require('../../assets/images/hero-phone.png')}
                resizeMode='contain'
              />
              <Image
                className='mx-auto block h-auto w-full object-contain md:hidden'
                alt='iPhone showing app interface'
                source={require('../../assets/images/hero-phone-mobile.png')}
                resizeMode='contain'
              />
              <div className='[background:linear-gradient(0deg, #F0F0F0 37.23%, rgba(255, 255, 255, 0.00) 109.02%)] absolute bottom-0 left-0 h-[61px] w-full backdrop-blur-[5px]' />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
