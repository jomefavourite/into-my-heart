import React from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
// import { Separator } from "~/components/ui/separator";

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
    <footer className='flex flex-col py-9 px-6 md:px-[107px] gap-6 w-full'>
      <div className='flex flex-col md:flex-row items-start justify-between w-full gap-8'>
        {/* Brand and Social Media Section */}
        <div className='flex flex-col items-start gap-3.5'>
          <div className='flex flex-col items-start gap-2'>
            <h2 className="font-['Pacifico',Helvetica] font-normal text-[#313131] text-2xl">
              Into my heart
            </h2>
            <p className='text-[#707070] font-medium text-sm leading-5 max-w-[291px]'>
              Helping believers memorize Scripture and transform their lives
              through the power of God&#39;s Word.
            </p>
          </div>

          <div className='flex items-center gap-[23px]'>
            {socialIcons.map((icon, index) => (
              <div
                key={index}
                className={`relative w-10 h-10 ${icon.bgColor} rounded-[20px] flex items-center justify-center overflow-hidden`}
              >
                <img className='w-5 h-5' alt={icon.name} src={icon.src} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className='flex items-start gap-8 md:gap-[88px]'>
          {/* First Column */}
          <nav className='flex flex-col items-start gap-3.5'>
            {firstNavLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className='text-[#707070] font-medium text-sm leading-5 hover:text-[#313131] transition-colors'
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
                className='text-[#707070] font-medium text-sm leading-5 hover:text-[#313131] transition-colors'
              >
                {link.text}
              </a>
            ))}
          </nav>

          {/* Newsletter Section */}
          <div className='flex flex-col w-full md:w-[302px] items-start gap-3.5'>
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
          </div>
        </div>
      </div>

      {/* <Separator className="bg-[#707070]/20 w-full" /> */}

      {/* Footer Bottom Section */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full'>
        <p className='text-[#707070] font-medium text-sm'>
          2025 Into My Heart. All rights reserved.
        </p>

        <div className='flex items-center gap-3.5 flex-wrap'>
          {policyLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className='text-[#707070] font-medium text-sm hover:text-[#313131] transition-colors'
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
