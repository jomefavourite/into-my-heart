import React from 'react';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardFooter } from '~/components/ui/card';

const FeaturesSection = (): JSX.Element => {
  // Feature cards data
  const featureCards = [
    {
      id: 1,
      title: 'Individual & themed verses',
      description:
        "Whether you're focusing on peace, purpose, or promises, you can choose from themed verse packs or favourite scriptures.",
      imageContent: (
        <div className='relative w-[340px] h-[251px] mx-auto'>
          <div className='flex flex-col w-[302px] items-start justify-center p-4 absolute top-40 left-[18px] bg-[#fdfdfd] rounded-[10px] overflow-hidden shadow-[0px_4px_10px_-6px_#00000012]'>
            <div className='flex flex-col items-start gap-2 relative self-stretch w-full'>
              <div className="mt-[-0.89px] leading-[17.9px] relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#313131] text-xs tracking-[0] whitespace-nowrap">
                Genesis 1:1
              </div>
              <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#707070] text-[11px] tracking-[0] leading-[16.1px]">
                In the beginning, God created the heavens and the earth.
              </div>
            </div>
          </div>

          <div className='w-[302px] top-20 left-px -rotate-1 shadow-[0px_9.8px_17.65px_-5.88px_#00000012] flex flex-col items-start justify-center p-4 absolute bg-[#fdfdfd] rounded-[10px] overflow-hidden'>
            <div className='flex flex-col items-start gap-2 relative self-stretch w-full'>
              <div className="mt-[-0.89px] leading-[17.9px] relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#313131] text-xs tracking-[0] whitespace-nowrap">
                Genesis 1:1
              </div>
              <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#707070] text-[11px] tracking-[0] leading-[16.1px]">
                In the beginning, God created the heavens and the earth.
              </div>
            </div>
          </div>

          <div className='w-[302px] top-[18px] left-[34px] rotate-[7deg] shadow-[0px_9.8px_17.65px_-5.88px_#00000012] flex flex-col items-start justify-center p-4 absolute bg-[#fdfdfd] rounded-[10px] overflow-hidden'>
            <div className='flex flex-col items-start gap-2 relative self-stretch w-full'>
              <div className="mt-[-0.89px] leading-[17.9px] relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#313131] text-xs tracking-[0] whitespace-nowrap">
                Genesis 1:1
              </div>
              <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#707070] text-[11px] tracking-[0] leading-[16.1px]">
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
        <div className='relative w-[251px] h-[251px] mx-auto'>
          <div className='relative w-[282px] h-[251px] -left-4'>
            <div className='absolute w-[251px] h-[251px] top-0 left-4'>
              <div className='relative h-[251px] rounded-[125.5px]'>
                <div className='absolute w-[251px] h-[251px] top-0 left-0 rounded-[125.5px] border-2 border-solid border-[#f0f0f0]'>
                  <div className='inline-flex items-center justify-center p-2 relative top-[201px] left-[191px] bg-neutral-50 rounded-[30px] overflow-hidden border-[0.97px] border-solid border-[#e8e8e8]'>
                    <img
                      className='relative w-6 h-6'
                      alt='Mic'
                      src='/mic-02.svg'
                    />
                  </div>
                </div>

                <div className='absolute w-[193px] h-[193px] top-[29px] left-[29px] rounded-[96.54px] border-2 border-solid border-[#f0f0f0]'>
                  <div className='inline-flex items-center justify-center p-2 relative top-[133px] -left-0.5 bg-neutral-50 rounded-[30px] overflow-hidden border-[0.97px] border-solid border-[#e8e8e8]'>
                    <img
                      className='relative w-6 h-6'
                      alt='Cards'
                      src='/cards-01.svg'
                    />
                  </div>
                </div>

                <div className='absolute w-[135px] h-[135px] top-[58px] left-[58px] rounded-[67.58px] border-2 border-solid border-[#f0f0f0]'>
                  <div className='inline-flex items-center justify-center p-2 relative top-[-21px] left-[46px] bg-neutral-50 rounded-[30px] overflow-hidden border-[0.97px] border-solid border-[#e8e8e8]'>
                    <img
                      className='relative w-6 h-6'
                      alt='Puzzle'
                      src='/puzzle.svg'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='w-[282px] top-[84px] left-0 shadow-[0px_9.14px_16.45px_-5.48px_#00000012] flex flex-col items-start justify-center p-4 absolute bg-[#fdfdfd] rounded-[10px] overflow-hidden'>
              <div className='flex flex-col items-start gap-1.5 relative self-stretch w-full'>
                <div className="mt-[-0.83px] leading-[16.0px] relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#313131] text-xs tracking-[0] whitespace-nowrap">
                  Genesis 1:1
                </div>
                <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#707070] text-[11px] tracking-[0] leading-[14px]">
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
      title: 'Streak & progress tracking',
      description:
        'Stay on track with streak reminders, progress milestones, and a satisfying "you did it" after each session keep you going strong.',
      imageContent: (
        <div className='flex items-center justify-center h-[251px]'>
          <div className='relative w-[251px] h-[251px] bg-[url(/icon-set-regular-1.svg)] bg-[100%_100%]'>
            <img
              className='absolute w-[100px] h-[100px] top-[75px] left-[76px]'
              alt='Icon set regular'
              src='/icon-set-regular.svg'
            />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Set memorization goals',
      description:
        "Create goals that work for you—daily, weekly, or monthly. It's not about speed, it's about growing deeper in the Word.",
      imageContent: (
        <div className='relative h-[251px] flex items-center justify-center'>
          <div className='flex flex-col w-[352px] items-start gap-1 px-[18px] py-4 absolute top-[187px] left-[62px] bg-[#fdfdfd] rounded-[10px] overflow-hidden shadow-[0px_4px_10px_-6px_#00000012]'>
            <div className='flex items-center justify-between relative self-stretch w-full'>
              <div className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#313131] text-[13px] tracking-[0] leading-[18px] whitespace-nowrap">
                Memorize Psalm 91
              </div>
              <img
                className='relative w-6 h-6'
                alt='Icon set regular'
                src='/icon-set-regular-2.svg'
              />
            </div>
            <div className='flex items-center justify-between relative self-stretch w-full'>
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#707070] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                Daily
              </div>
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#707070] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                Completed
              </div>
            </div>
          </div>

          <div className='px-[18px] py-4 top-[105px] left-[60px] rotate-1 flex flex-col w-[352px] items-start gap-1 absolute bg-[#fdfdfd] rounded-[10px] overflow-hidden shadow-[0px_10px_17px_-6px_#00000012]'>
            <div className='flex items-center justify-between relative self-stretch w-full'>
              <div className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#313131] text-[13px] tracking-[0] leading-[18px] whitespace-nowrap">
                Memorize Psalm 91
              </div>
              <img
                className='relative w-[24.42px] h-[24.42px] mt-[-0.21px] mb-[-0.21px] mr-[-0.21px] -rotate-1'
                alt='Icon set regular'
                src='/icon-set-regular-3.svg'
              />
            </div>
            <div className='flex items-center justify-between relative self-stretch w-full'>
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#707070] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                Daily
              </div>
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#707070] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                Completed
              </div>
            </div>
          </div>

          <div className='p-[18px] top-6 left-[63px] -rotate-3 flex flex-col w-[352px] items-start gap-1 absolute bg-[#fdfdfd] rounded-[10px] overflow-hidden shadow-[0px_10px_17px_-6px_#00000012]'>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-[#313131] text-[13px] tracking-[0] leading-[18px] whitespace-nowrap">
              Memorize Psalm 91
            </div>
            <div className='flex items-center justify-between relative self-stretch w-full'>
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#707070] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                Daily
              </div>
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#707070] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                Due 17 Jan
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className='flex flex-col items-center gap-[50px] px-6 py-[50px] md:px-[107px] w-full'>
      <div className='flex flex-col items-center gap-3'>
        <Badge
          variant='outline'
          className='bg-neutral-50 rounded-[20px] px-3 py-1.5 flex items-center gap-1'
        >
          <div className='relative w-[24.06px] h-[18px] overflow-hidden'>
            <div className='bg-[url(/group-1.png)] absolute w-6 h-[5px] top-2.5 left-0 bg-[100%_100%]' />
            <img
              className='absolute w-4 h-1.5 top-[3px] left-1'
              alt='Light'
              src='/light.svg'
            />
          </div>
          <span className='font-medium text-[#313131] text-sm'>
            Key Features
          </span>
        </Badge>

        <div className='flex flex-col items-center justify-center gap-2 text-center'>
          <h2 className="[font-family:'Onest',Helvetica] font-semibold text-[#313131] text-[28px] leading-[34px]">
            Simple, fun, and interactive
          </h2>
          <p className="max-w-[502px] [font-family:'Inter',Helvetica] font-medium text-[#707070] text-base tracking-[0.16px] leading-6">
            Use fill-in-the-blanks, flashcards, and guided review to make
            scripture memorization simple and effective.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full'>
        {featureCards.map((card) => (
          <Card
            key={card.id}
            className='bg-neutral-50 rounded-[20px] overflow-hidden border border-solid border-[#e8e8e8]'
          >
            <CardContent className='p-0 h-[280px] flex items-center justify-center'>
              {card.imageContent}
            </CardContent>
            <CardFooter className='flex flex-col w-full items-start gap-[5px] p-[18px] bg-white'>
              <h3 className="self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-semibold text-[#313131] text-xl tracking-[-0.40px] leading-[26px]">
                {card.title}
              </h3>
              <p className="self-stretch [font-family:'Inter',Helvetica] font-normal text-[#707070] text-base tracking-[0.16px] leading-6">
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
