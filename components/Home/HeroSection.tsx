import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Logo from '../icons/logo/Logo';
import { Onest_400Regular } from '@expo-google-fonts/onest';
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

const HeroSection = (): JSX.Element => {
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
          <nav className='hidden md:flex items-center space-x-8'>
            {navigationLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className='text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className='hidden md:flex items-center space-x-3'>
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
              <div className='flex flex-col space-y-4 mt-6'>
                {/* Mobile Navigation Links */}
                <nav className='flex flex-col space-y-4'>
                  {navigationLinks.map(link => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className='text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors py-2'
                      // onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Action Buttons */}
                <div className='flex flex-col space-y-3 pt-6 border-t'>
                  <Button variant='outline' className='w-full bg-transparent'>
                    Sign In
                  </Button>
                  <Button className='w-full bg-gray-900 hover:bg-gray-800'>
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className=' grid gap-6 lg:grid-cols-2 max-w-screen-2xl mx-auto  px-6 py-[50px] lg:px-[107px]'>
        <div className=' flex flex-col justify-center gap-7'>
          <div className='flex flex-col w-full text-center md:text-left gap-3'>
            <h1 className='font-onest text-[44px] leading-[53px] tracking-[-0.44px] font-semibold text-[#313131]'>
              The Engaging Way To Keep{' '}
              <span className='text-[#1c1c1c]'>God&apos;s Word</span> In Your
              Heart
            </h1>

            <p className=' font-medium text-[#707070] text-base tracking-[0.16px] leading-6'>
              Build a daily habit of engaging with God&#39;s Word. Our app helps
              you memorize Bible verses with proven techniques, track your
              progress, and grow spiritually.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className='flex gap-3 mx-auto md:ml-0'>
            <CustomButton
              onPress={() => router.push('/onboard')}
              className='w-full flex-1'
            >
              Get Started
            </CustomButton>

            <CustomButton
              variant='outline'
              innerElement={
                <span className='text-secondary-text text-xs'>Coming soon</span>
              }
              disabled
              className='flex-col gap-0'
            >
              Download the App
            </CustomButton>
          </div>
        </div>

        <div>
          {/* Phone mockup card */}
          <Card className='w-full md:w-[460px] h-[470px] bg-neutral-50 rounded-[20px] overflow-hidden border-none'>
            <div className='relative w-full h-[427px] top-[43px]'>
              <Image
                className='object-center w-full mx-auto'
                alt='iPhone showing app interface'
                source={require('/assets/images/hero-phone.png')}
              />
              <div className='absolute w-full h-[61px] bottom-0 left-0 backdrop-blur-[5px] [background:linear-gradient(0deg, #F0F0F0 37.23%, rgba(255, 255, 255, 0.00) 109.02%)]' />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
