import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Icon } from '../ui/icon';
import { Instagram } from 'lucide-react-native';

// Define navigation links data for reusability
const firstNavLinks = [
  { text: 'Home', href: '#' },
  { text: 'Our Approach', href: '#' },
  { text: 'About Us', href: '#' },
  { text: 'Contact', href: '#' },
];

const secondNavLinks = [
  { text: 'Donate', href: '#' },
  { text: 'FAQs', href: '#' },
  { text: 'Community', href: '#' },
  { text: 'Help Center', href: '#' },
];

// Define social media icons data
const socialIcons = [
  {
    name: 'Instagram',
    src: '/instagram.svg',
    bgColor: 'bg-[#1c1b1a]',
    href: 'https://www.instagram.com/intomyheart.life/',
  },
  // { name: 'Mail', src: '/mail-01.svg', bgColor: 'bg-[#313131]' },
  // { name: 'New twitter', src: '/new-twitter.svg', bgColor: 'bg-[#1c1b1a]' },
  { name: 'Youtube', src: '/youtube.svg', bgColor: 'bg-[#1c1b1a]' },
  { name: 'Facebook', src: '/facebook-02.svg', bgColor: 'bg-[#1c1b1a]' },
];

// Define footer policy links
const policyLinks = [
  { text: 'Privacy Policy', href: '#' },
  { text: 'Terms of Service', href: '#' },
  { text: 'Cookie Policy', href: '#' },
];

const FooterSection = (): JSX.Element => {
  return (
    <footer className='flex w-full flex-col gap-6 px-6 py-9 md:px-[107px]'>
      <div className='flex w-full flex-col items-start justify-between gap-8 md:flex-row'>
        {/* Brand and Social Media Section */}
        <div className='flex flex-col items-start gap-3.5'>
          <div className='flex flex-col items-start gap-2'>
            <h2 className="font-['Pacifico',Helvetica] text-2xl font-normal text-[#313131]">
              Into my heart
            </h2>
            <p className='max-w-[291px] text-sm font-medium leading-5 text-[#707070]'>
              Helping believers memorize Scripture and transform their lives
              through the power of God&#39;s Word.
            </p>
          </div>

          <div className='flex items-center gap-[23px]'>
            {socialIcons.map((icon, index) => (
              <div
                key={index}
                className={`relative h-10 w-10 ${icon.bgColor} flex items-center justify-center overflow-hidden rounded-[20px]`}
              >
                {/* <img className='h-5 w-5' alt={icon.name} src={icon.src} /> */}
                <Icon as={Instagram} className='h-5 w-5' />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className='flex w-full items-start justify-between gap-8 md:justify-end md:gap-[88px]'>
          {/* First Column */}
          <nav className='flex flex-col items-start gap-3.5'>
            {firstNavLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className='text-sm font-medium leading-5 text-[#707070] transition-colors hover:text-[#313131]'
              >
                {link.text}
              </a>
            ))}
          </nav>

          {/* Second Column */}
          <nav className='flex flex-col items-start gap-3.5'>
            {secondNavLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className='text-sm font-medium leading-5 text-[#707070] transition-colors hover:text-[#313131]'
              >
                {link.text}
              </a>
            ))}
          </nav>

          {/* Newsletter Section */}
          {/* <div className='flex flex-col w-full md:w-[302px] items-start gap-3.5'>
            <p className='text-[#707070] font-medium text-sm leading-5'>
              Subscribe to our newsletter for tips, new features, and updates.
            </p>
            <div className='flex w-full items-center gap-2 bg-neutral-50 rounded-[40px] overflow-hidden pl-3'>
              <Input
                type='email'
                placeholder='Email address'
                className='border-0 bg-transparent text-[#707070] text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-2'
              />
              <Button className='bg-[#3d3d3d] hover:bg-[#313131] text-white rounded-[999px] px-6 py-3.5'>
                Subscribe
              </Button>
            </div>
          </div> */}
        </div>
      </div>

      <Separator className='w-full bg-[#707070]/20' />

      {/* Footer Bottom Section */}
      <div className='flex w-full flex-col items-center justify-between gap-4 md:flex-row md:items-center'>
        <p className='text-sm font-medium text-[#707070]'>
          2025 Into My Heart. All rights reserved.
        </p>

        <div className='flex flex-wrap items-center gap-3.5'>
          {policyLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className='text-sm font-medium text-[#707070] transition-colors hover:text-[#313131]'
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
