import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import OpenBookSVG from '../icons/onboarding/open-book.svg';
import { Image } from 'react-native';
// import PhoneMockupSVG from '../icons/onboarding/phone-mock.svg';

// Data for the steps to make the code more maintainable
const steps = [
  {
    number: 1,
    title: 'Save Verses and Collections',
    description:
      'Choose from curated collections or search for specific passages that resonate with you.',
  },
  {
    number: 2,
    title: 'Memorize the Word and track your progress',
    description:
      'Memorize the Word and track your progress with fill-in-the-blanks, flashcards, and recitation techniques.',
  },
  {
    number: 3,
    title: 'Set goals and meet your expectations ',
    description:
      'Achieve your memorization targets through personalized goals, with daily reminders and progress tracking.',
  },
  {
    number: 4,
    title: 'Save notes for further study',
    description: 'Access your saved notes for further study and reference.',
  },
];

const HowItWorksSection = (): JSX.Element => {
  return (
    <>
      <section
        id='approach'
        className='flex w-full flex-col items-center gap-[50px] px-6 py-[50px] md:px-[107px]'
      >
        {/* Header section */}
        <div className='flex flex-col items-center gap-3'>
          <Badge
            variant='secondary'
            className='flex flex-row items-center gap-1 rounded-[20px] bg-neutral-50 px-3 py-1.5'
          >
            <OpenBookSVG />
            <span className='text-sm font-medium text-[#313131]'>
              How It Works
            </span>
          </Badge>

          <div className='flex flex-col items-center justify-center gap-2 text-center'>
            <h2 className="text-[28px] font-semibold leading-[34px] text-[#313131] [font-family:'Onest',Helvetica]">
              Simple, fun, and interactive
            </h2>
            <p className="max-w-[460px] text-base font-medium leading-6 tracking-[0.16px] text-[#707070] [font-family:'Inter',Helvetica]">
              Our simple 4-step process makes Scripture memorization accessible
              and effective for everyone.
            </p>
          </div>
        </div>

        {/* Main content section */}
        <div className='flex flex-col items-center justify-center gap-[50px] lg:flex-row'>
          {/* Phone mockup card */}
          <Card className='h-[470px] w-full overflow-hidden rounded-[20px] border-none bg-neutral-50 md:w-[460px]'>
            <div className='relative top-[43px] h-[427px] w-full'>
              <Image
                className='mx-auto w-full object-center'
                alt='iPhone showing app interface'
                source={require('../../assets/images/phone-mock.png')}
              />
              <div className='[background:linear-gradient(0deg, #F0F0F0 37.23%, rgba(255, 255, 255, 0.00) 109.02%)] absolute bottom-0 left-0 h-[61px] w-full backdrop-blur-[5px]' />
            </div>
          </Card>

          {/* Steps section */}
          <div className='flex items-start justify-center gap-2.5'>
            {/* Numbers column */}
            <div className='relative flex flex-col items-center gap-[72px]'>
              {/* <img
                className='absolute w-px h-[350px] top-[17px] left-5 object-cover'
                alt='Vertical line connecting steps'
                src='/line-4.svg'
              /> */}
              <div className='absolute left-5 top-[17px] -z-10 h-[350px] w-px bg-[#e8e8e8] object-cover'></div>

              {steps.map(step => (
                <div
                  key={step.number}
                  className='flex w-[42px] items-center justify-center overflow-hidden rounded-[100px] border-2 border-solid border-[#e8e8e8] bg-neutral-50 px-[7px] py-[9px]'
                >
                  <div className="mt-[-2.00px] text-center text-base font-medium leading-6 text-[#707070] [font-family:'Inter',Helvetica]">
                    {step.number}
                  </div>
                </div>
              ))}
            </div>

            {/* Steps content column */}
            <div className='flex flex-col items-start gap-[50px]'>
              {steps.map(step => (
                <div key={step.number} className='flex items-start gap-2.5'>
                  <div className='flex flex-col items-start justify-center gap-1'>
                    <h3 className="text-sm font-medium leading-5 text-[#313131] [font-family:'Inter',Helvetica]">
                      {step.title}
                    </h3>
                    <p className="w-full max-w-[400px] text-sm font-normal leading-5 text-[#707070] [font-family:'Inter',Helvetica]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksSection;
