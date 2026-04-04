import { View, ScrollView, Image } from 'react-native';
import React from 'react';
import { H3, H4, P } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import Container from '@/components/Container';

const tip = 'mb-5 text-base leading-6 text-foreground web:select-text';

export default function MemorizationTips() {
  const router = useRouter();
  return (
    <Container>
      <View className='mb-6 flex-row items-center justify-between'>
        <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
          <ArrowLeftIcon />
        </Button>

        <Button size={'icon'} variant={'ghost'} onPress={() => null}>
          <ShareIcon />
        </Button>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='pb-10'>
          <H3 className='mb-4'>Bible Study and Memorization Tips</H3>

          <Image
            source={require('@/assets/images/bible-tips.png')}
            style={{ width: '100%', height: 200 }}
            className='mb-8 h-[170px] w-full rounded-xl object-contain'
          />

          <P className={`${tip} mb-8`}>
            Studying and memorizing scripture is a powerful way to deepen your
            faith, find guidance in daily life, and strengthen your relationship
            with God. However, it can sometimes feel overwhelming. Below are
            practical tips to help you engage more effectively with the Word of
            God and commit it to memory.
          </P>

          <H4 className='mb-4'>Bible Study Tips</H4>

          <P className={tip}>
            1. Pray Before You Begin: Start with a prayer asking God to open
            your heart and mind to His Word. Ask for wisdom and understanding as
            you study.
          </P>

          <P className={tip}>
            2. Choose a Study Plan: Structure helps with consistency. Consider a
            topical study, a book-by-book study, or a character study to gain
            deeper insights.
          </P>

          <P className={tip}>
            3. Read in Context: Avoid cherry-picking verses. Read surrounding
            passages to understand the full meaning of a scripture.
          </P>

          <P className={tip}>
            4. Take Notes & Highlight: Write down key insights, underline
            important verses, and use colour coding to categorize themes such as
            promises, commands, and teachings.
          </P>

          <P className={tip}>
            5. Ask Reflective Questions: What is God revealing to me in this
            passage? How does this apply to my life today? Is there a promise,
            command, or lesson I need to act on?
          </P>

          <P className={tip}>
            6. Use Different Translations: Reading multiple translations can
            provide clarity and deeper understanding of a verse.
          </P>

          <P className={tip}>
            7. Join a Study Group: Studying with others fosters discussion,
            accountability, and encouragement.
          </P>

          <P className={tip}>
            8. Apply What You Learn: Scripture is meant to transform our lives.
            Take practical steps to live out what you read.
          </P>

          <H4 className='mb-4 mt-10'>Memorization Tips</H4>

          <P className={tip}>
            Start Small: Begin with short verses and gradually work up to longer
            passages.
          </P>
          <P className={tip}>
            Repeat Out Loud: Reading and saying verses out loud reinforces
            retention.
          </P>
          <P className={tip}>
            Write It Down: Writing verses multiple times helps imprint them in
            your memory.
          </P>
          <P className={tip}>
            Use Flashcards: Write the verse on one side and the reference on the
            other. Quiz yourself daily.
          </P>
          <P className={tip}>
            Practice Fill-in-the-Blanks: Remove a few words and try recalling them
            to test your memory.
          </P>
          <P className={tip}>
            Use Sticky Notes: Place them where you frequently look—mirrors,
            desks, or refrigerators—to remind you throughout the day.
          </P>
          <P className={tip}>
            Break It Down: Divide longer verses into phrases and memorize them
            step by step.
          </P>
          <P className={tip}>
            Link It to Everyday Life: Associate a verse with a specific
            experience or situation to make it more meaningful and memorable.
          </P>
          <P className={tip}>
            Sing or Chant It: Turning verses into songs or rhythms can make them
            easier to recall.
          </P>
          <P className={tip}>
            Review Regularly: Repetition over time solidifies memory. Make
            scripture review part of your daily routine.
          </P>

          <H4 className='mb-4 mt-10'>Final Thoughts</H4>

          <P className={`${tip} mb-0`}>
            Bible study and memorization are not about checking off a task but
            about growing closer to God. Approach both with an open heart,
            persistence, and a desire to live out His Word. As you invest time in
            scripture, you will find that {"God's"} truth becomes a guiding light
            in every aspect of your life.
          </P>
        </View>
      </ScrollView>
    </Container>
  );
}
