import React from 'react';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';
import OpenBookSVG from '../icons/onboarding/open-book.svg';
import { Image } from 'react-native';
// import PhoneMockupSVG from '../icons/onboarding/phone-mock.svg';

// Data for the steps to make the code more maintainable
const steps = [
  {
    number: 1,
    title: 'Select Verses',
    description:
      'Choose from curated collections or search for specific passages that resonate with you.',
  },
  {
    number: 2,
    title: 'Listen, reflect, and take notes',
    description:
      'Our simple 4-step process makes Scripture memorization accessible and effective for everyone.',
  },
  {
    number: 3,
    title: 'Practice to memorize and track your progress',
    description:
      'Our simple 4-step process makes Scripture memorization accessible and effective for everyone.',
  },
  {
    number: 4,
    title: 'Practice to memorize and track your progress',
    description:
      'Our simple 4-step process makes Scripture memorization accessible and effective for everyone.',
  },
];

const HowItWorksSection = (): JSX.Element => {
  return (
    <>
      <section className='flex flex-col items-center gap-[50px] py-[50px] px-6 md:px-[107px] w-full'>
        {/* Header section */}
        <div className='flex flex-col items-center gap-3'>
          <Badge
            variant='secondary'
            className='flex flex-row items-center gap-1 px-3 py-1.5 bg-neutral-50 rounded-[20px]'
          >
            <OpenBookSVG />
            <span className='font-medium text-[#313131] text-sm'>
              How It Works
            </span>
          </Badge>

          <div className='flex flex-col items-center justify-center gap-2 text-center'>
            <h2 className="[font-family:'Onest',Helvetica] font-semibold text-[#313131] text-[28px] leading-[34px]">
              Simple, fun, and interactive
            </h2>
            <p className="max-w-[460px] [font-family:'Inter',Helvetica] font-medium text-[#707070] text-base tracking-[0.16px] leading-6">
              Our simple 4-step process makes Scripture memorization accessible
              and effective for everyone.
            </p>
          </div>
        </div>

        {/* Main content section */}
        <div className='flex flex-col md:flex-row items-center justify-center gap-[50px]'>
          {/* Phone mockup card */}
          <Card className='w-full md:w-[460px] h-[470px] bg-neutral-50 rounded-[20px] overflow-hidden border-none'>
            <div className='relative w-full h-[427px] top-[43px]'>
              <Image
                className='object-center w-full mx-auto'
                alt='iPhone showing app interface'
                source={require('/assets/images/phone-mock.png')}
              />
              <div className='absolute w-full h-[61px] bottom-0 left-0 backdrop-blur-[5px] [background:linear-gradient(0deg, #F0F0F0 37.23%, rgba(255, 255, 255, 0.00) 109.02%)]' />
            </div>
          </Card>

          {/* Steps section */}
          <div className='flex items-start justify-center gap-2.5'>
            {/* Numbers column */}
            <div className='flex flex-col items-center gap-[72px] relative'>
              {/* <img
                className='absolute w-px h-[350px] top-[17px] left-5 object-cover'
                alt='Vertical line connecting steps'
                src='/line-4.svg'
              /> */}
              <div className='absolute w-px h-[350px] bg-[#e8e8e8] top-[17px] left-5 object-cover -z-10'></div>

              {steps.map((step) => (
                <div
                  key={step.number}
                  className='flex w-[42px] items-center justify-center px-[7px] py-[9px] bg-neutral-50 rounded-[100px] overflow-hidden border-2 border-solid border-[#e8e8e8]'
                >
                  <div className="mt-[-2.00px] [font-family:'Inter',Helvetica] font-medium text-[#707070] text-base text-center leading-6">
                    {step.number}
                  </div>
                </div>
              ))}
            </div>

            {/* Steps content column */}
            <div className='flex flex-col items-start gap-[50px]'>
              {steps.map((step) => (
                <div key={step.number} className='flex items-start gap-2.5'>
                  <div className='flex flex-col items-start justify-center gap-1'>
                    <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#313131] text-sm leading-5">
                      {step.title}
                    </h3>
                    <p className="w-full max-w-[400px] [font-family:'Inter',Helvetica] font-normal text-[#707070] text-sm leading-5">
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
