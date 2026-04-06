import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import OpenBookSVG from '../icons/onboarding/open-book.svg';
import MicSVG from '../../assets/images/home/mic.svg';
import FlashcardSVG from '../../assets/images/home/flashcard.svg';
import PuzzleSVG from '../../assets/images/home/puzzle.svg';

// Feature cards data
const featureCards = [
  {
    id: 1,
    title: 'Individual & themed verses',
    description:
      "Whether you're focusing on peace, purpose, or promises, you can choose from themed verse packs or favourite scriptures.",
    imageContent: (
      <div className='relative mx-auto h-[251px] w-[340px]'>
        <div className='absolute left-[18px] top-40 flex w-[302px] flex-col items-start justify-center overflow-hidden rounded-[10px] bg-[#fdfdfd] p-4 shadow-[0px_4px_10px_-6px_#00000012]'>
          <div className='relative flex w-full flex-col items-start gap-2 self-stretch'>
            <div className="relative mt-[-0.89px] w-fit whitespace-nowrap text-xs font-medium leading-[17.9px] tracking-[0] text-[#313131] [font-family:'Inter',Helvetica]">
              Genesis 1:1
            </div>
            <div className="relative self-stretch text-[11px] font-normal leading-[16.1px] tracking-[0] text-[#707070] [font-family:'Inter',Helvetica]">
              In the beginning, God created the heavens and the earth.
            </div>
          </div>
        </div>

        <div className='absolute left-px top-20 flex w-[302px] -rotate-1 flex-col items-start justify-center overflow-hidden rounded-[10px] bg-[#fdfdfd] p-4 shadow-[0px_9.8px_17.65px_-5.88px_#00000012]'>
          <div className='relative flex w-full flex-col items-start gap-2 self-stretch'>
            <div className="relative mt-[-0.89px] w-fit whitespace-nowrap text-xs font-medium leading-[17.9px] tracking-[0] text-[#313131] [font-family:'Inter',Helvetica]">
              Genesis 1:1
            </div>
            <div className="relative self-stretch text-[11px] font-normal leading-[16.1px] tracking-[0] text-[#707070] [font-family:'Inter',Helvetica]">
              In the beginning, God created the heavens and the earth.
            </div>
          </div>
        </div>

        <div className='absolute left-[34px] top-[18px] flex w-[302px] rotate-[7deg] flex-col items-start justify-center overflow-hidden rounded-[10px] bg-[#fdfdfd] p-4 shadow-[0px_9.8px_17.65px_-5.88px_#00000012]'>
          <div className='relative flex w-full flex-col items-start gap-2 self-stretch'>
            <div className="relative mt-[-0.89px] w-fit whitespace-nowrap text-xs font-medium leading-[17.9px] tracking-[0] text-[#313131] [font-family:'Inter',Helvetica]">
              Genesis 1:1
            </div>
            <div className="relative self-stretch text-[11px] font-normal leading-[16.1px] tracking-[0] text-[#707070] [font-family:'Inter',Helvetica]">
              In the beginning, God created the heavens and the earth.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Research proven practice techniques',
    description:
      "With flashcards, fill-in-the-blanks, and recitation drills, you'll stay engaged memorizing much more than you imagined.",
    imageContent: (
      <div className='relative mx-auto h-[251px] w-[251px]'>
        <div className='relative -left-4 h-[251px] w-[282px]'>
          <div className='absolute left-4 top-0 h-[251px] w-[251px]'>
            <div className='relative h-[251px] rounded-[125.5px]'>
              <div className='absolute left-0 top-0 h-[251px] w-[251px] rounded-[125.5px] border-2 border-solid border-[#f0f0f0]'>
                <div className='relative left-[191px] top-[201px] inline-flex items-center justify-center overflow-hidden rounded-[30px] border-[0.97px] border-solid border-[#e8e8e8] bg-neutral-50 p-2'>
                  <MicSVG className='relative h-6 w-6' />
                </div>
              </div>

              <div className='absolute left-[29px] top-[29px] h-[193px] w-[193px] rounded-[96.54px] border-2 border-solid border-[#f0f0f0]'>
                <div className='relative -left-0.5 top-[133px] inline-flex items-center justify-center overflow-hidden rounded-[30px] border-[0.97px] border-solid border-[#e8e8e8] bg-neutral-50 p-2'>
                  <FlashcardSVG className='relative h-6 w-6' />
                </div>
              </div>

              <div className='absolute left-[58px] top-[58px] h-[135px] w-[135px] rounded-[67.58px] border-2 border-solid border-[#f0f0f0]'>
                <div className='relative left-[46px] top-[-21px] inline-flex items-center justify-center overflow-hidden rounded-[30px] border-[0.97px] border-solid border-[#e8e8e8] bg-neutral-50 p-2'>
                  <PuzzleSVG className='relative h-6 w-6' />
                </div>
              </div>
            </div>
          </div>

          <div className='absolute left-0 top-[84px] flex w-[282px] flex-col items-start justify-center overflow-hidden rounded-[10px] bg-[#fdfdfd] p-4 shadow-[0px_9.14px_16.45px_-5.48px_#00000012]'>
            <div className='relative flex w-full flex-col items-start gap-1.5 self-stretch'>
              <div className="relative mt-[-0.83px] w-fit whitespace-nowrap text-xs font-medium leading-[16.0px] tracking-[0] text-[#313131] [font-family:'Inter',Helvetica]">
                Genesis 1:1
              </div>
              <div className="relative self-stretch text-[11px] font-normal leading-[14px] tracking-[0] text-[#707070] [font-family:'Inter',Helvetica]">
                In the beginning, God created the heavens and the earth.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Offline-ready sync',
    description:
      "Keep adding verses, notes, affirmations, and collections locally, then sync your updates when you're back online.",
    imageContent: (
      <div className='relative mx-auto flex h-[251px] w-[251px] items-center justify-center'>
        <div className='w-full rounded-[24px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_9px_18px_-6px_#00000012]'>
          <div className='rounded-2xl bg-neutral-50 p-4'>
            <div className="text-sm font-semibold text-[#313131] [font-family:'Inter',Helvetica]">
              Sync Status
            </div>
            <div className="mt-2 text-xs text-[#707070] [font-family:'Inter',Helvetica]">
              Your saved verses and recent changes stay ready across sessions.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Verse notes and affirmations',
    description:
      "Capture reflections, prayers, and encouragement alongside the verses you're hiding in your heart.",
    imageContent: (
      <div className='relative flex h-[251px] items-center justify-center'>
        <div className='w-[352px] rounded-[20px] border border-[#e8e8e8] bg-white p-[18px] shadow-[0px_10px_17px_-6px_#00000012]'>
          <div className="text-[13px] font-medium text-[#313131] [font-family:'Inter',Helvetica]">
            Notes and Affirmations
          </div>
          <div className="mt-2 text-xs leading-[18px] text-[#707070] [font-family:'Inter',Helvetica]">
            Save the truth you&apos;re practicing, what you&apos;re learning, and
            the encouragement you want to revisit later.
          </div>
        </div>
      </div>
    ),
  },
];

const FeaturesSection = () => {
  return (
    <section
      id='key-features'
      className='flex w-full flex-col items-center gap-[50px] px-6 py-[50px] md:px-[107px]'
    >
      <div className='flex flex-col items-center gap-3'>
        <Badge
          variant='outline'
          className='flex items-center gap-1 rounded-[20px] bg-neutral-50 px-3 py-1.5'
        >
          <OpenBookSVG />
          <span className='text-sm font-medium text-[#313131]'>
            Key Features
          </span>
        </Badge>

        <div className='flex flex-col items-center justify-center gap-2 text-center'>
          <h2 className="text-[28px] font-semibold leading-[34px] text-[#313131] [font-family:'Onest',Helvetica]">
            Simple, fun, and interactive
          </h2>
          <p className="max-w-[502px] text-base font-medium leading-6 tracking-[0.16px] text-[#707070] [font-family:'Inter',Helvetica]">
            Use fill-in-the-blanks, flashcards, and guided review to make
            scripture memorization simple and effective.
          </p>
        </div>
      </div>

      <div className='grid w-full grid-cols-1 gap-5 md:grid-cols-2'>
        {featureCards.map(card => (
          <Card
            key={card.id}
            className='relative overflow-hidden rounded-[20px] border border-solid border-[#e8e8e8] bg-neutral-50 py-0'
          >
            <CardContent className='flex h-[280px] items-center justify-center p-0'>
              {card.imageContent}
            </CardContent>
            <CardFooter className='flex w-full flex-col items-start gap-[5px] bg-white p-[18px]'>
              <h3 className="mt-[-1.00px] self-stretch text-xl font-semibold leading-[26px] tracking-[-0.40px] text-[#313131] [font-family:'Inter',Helvetica]">
                {card.title}
              </h3>
              <p className="self-stretch text-base font-normal leading-6 tracking-[0.16px] text-[#707070] [font-family:'Inter',Helvetica]">
                {card.description}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
