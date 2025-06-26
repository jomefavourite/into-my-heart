import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import Logo from '../icons/logo/Logo';
import { Onest_400Regular } from '@expo-google-fonts/onest';
import { Link, useRouter } from 'expo-router';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import { Menu } from 'lucide-react-native';

// Navigation links data
const navigationLinks = [
  { name: 'Home', href: '/' },
  { name: 'Our Approach', href: '/approach' },
  { name: 'About Us', href: '/about' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Donate', href: '/donate' },
];

const HeroSection = (): JSX.Element => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className='relative w-full'>
      {/* Navigation Bar */}

      <header className='w-full border-b bg-white'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4 md:px-6'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {navigationLinks.map((link) => (
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
            <Button
              className='bg-[#656565] hover:bg-[#555555] text-white rounded-[999px] px-6 py-3.5'
              variant='default'
            >
              <span className='font-label-medium-medium text-[length:var(--label-medium-medium-font-size)] tracking-[var(--label-medium-medium-letter-spacing)] leading-[var(--label-medium-medium-line-height)]'>
                Sign In
              </span>
            </Button>

            <Button
              className='bg-[#3d3d3d] hover:bg-[#2d2d2d] text-white rounded-[999px] px-6 py-3.5'
              variant='default'
            >
              <span className='font-label-medium-medium text-[length:var(--label-medium-medium-font-size)] tracking-[var(--label-medium-medium-letter-spacing)] leading-[var(--label-medium-medium-line-height)]'>
                Get Started
              </span>
            </Button>
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
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className='text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors py-2'
                      onClick={() => setIsOpen(false)}
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

      <div className='grid md:grid-cols-2 max-w-screen-2xl mx-auto  px-20 py-40'>
        <div className=' flex flex-col items-start gap-7'>
          <div className='flex flex-col w-full items-start text-center md:text-left gap-3'>
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
          <div className='flex-col md:flex-row items-start gap-3'>
            <Button
              onPress={() => router.push('/onboard')}
              className='!w-full md:w-[172px] bg-[#3d3d3d] hover:bg-[#2d2d2d] text-white rounded-[999px] px-6 py-3.5'
              variant='default'
            >
              <span className='font-label-medium-medium text-[length:var(--label-medium-medium-font-size)] tracking-[var(--label-medium-medium-letter-spacing)] leading-[var(--label-medium-medium-line-height)]'>
                Get Started
              </span>
            </Button>

            <Button
              className='w-full md:w-[172px] bg-[#656565] hover:bg-[#555555] text-white rounded-[999px] px-6 py-3.5'
              variant='default'
            >
              <span className='font-label-medium-medium text-[length:var(--label-medium-medium-font-size)] tracking-[var(--label-medium-medium-letter-spacing)] leading-[var(--label-medium-medium-line-height)]'>
                Download the App
              </span>
            </Button>
          </div>
        </div>

        <div></div>
      </div>
    </section>
  );
};

export default HeroSection;
