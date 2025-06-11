import React from 'react';
import { Button } from '~/components/ui/button';
import Logo from '../icons/logo/Logo';
import { Onest_400Regular } from '@expo-google-fonts/onest';

const HeroSection = (): JSX.Element => {
  // Navigation links data
  const navLinks = [
    { text: 'Home', active: true },
    { text: 'Our Approach', active: false },
    { text: 'About Us', active: false },
    { text: 'FAQs', active: false },
    { text: 'Donate', active: false },
  ];

  return (
    <section className='relative w-full'>
      {/* Navigation Bar */}
      <header className=' bg-white shadow-[0px_0px_15px_#0000000d]'>
        <div className='max-w-screen-2xl mx-auto flex w-full items-center justify-between px-20 py-[18px]'>
          {/* Logo */}
          <Logo />

          {/* Navigation Links */}
          <nav className='flex items-center gap-7'>
            {navLinks.map((link, index) => (
              <a
                key={index}
                href='#'
                className={`[font-family:'Inter',Helvetica] text-sm leading-5 ${
                  link.active
                    ? 'font-semibold text-[#313131]'
                    : 'font-medium text-[#010000]'
                }`}
              >
                {link.text}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className='flex items-center gap-3'>
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
        </div>
      </header>

      <div className='grid md:grid-cols-2 max-w-screen-2xl mx-auto  px-20 py-40'>
        <div className=' flex flex-col items-start gap-7'>
          <div className='flex flex-col w-full items-start gap-3'>
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
          <div className='flex items-start gap-3'>
            <Button
              className='w-[172px] bg-[#3d3d3d] hover:bg-[#2d2d2d] text-white rounded-[999px] px-6 py-3.5'
              variant='default'
            >
              <span className='font-label-medium-medium text-[length:var(--label-medium-medium-font-size)] tracking-[var(--label-medium-medium-letter-spacing)] leading-[var(--label-medium-medium-line-height)]'>
                Get Started
              </span>
            </Button>

            <Button
              className='bg-[#656565] hover:bg-[#555555] text-white rounded-[999px] px-6 py-3.5'
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
