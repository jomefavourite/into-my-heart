import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { H2, H4, P } from '~/components/ui/typography';
import ThemedText from '~/components/ThemedText';

export default function MemorizationTips() {
  return (
    <ScrollView
      style={{ padding: 18 }}
      // contentContainerClassName='p-6 items-center'
      showsVerticalScrollIndicator={false}
    >
      <Text>MemorizationTips</Text>

      <H2>Bible Study and Memorization Tips</H2>
      <View className='p-3' />
      <P>
        Studying and memorizing scripture is a powerful way to deepen your
        faith, find guidance in daily life, and strengthen your relationship
        with God. However, it can sometimes feel overwhelming. Below are
        practical tips to help you engage more effectively with the Word of God
        and commit it to memory.
      </P>
      <View className='p-3' />
      <H4>Bible Study Tips</H4>
      <P>
        1. Pray Before You Begin: Start with a prayer asking God to open your
        heart and mind to His Word. Ask for wisdom and understanding as you
        study. Choose a Study Plan: Structure helps with consistency. Consider a
        topical study, a book-by-book study, or a character study to gain deeper
        insights. Read in Context: Avoid cherry-picking verses. Read surrounding
        passages to understand the full meaning of a scripture. Take Notes &
        Highlight: Write down key insights, underline important verses, and use
        colour coding to categorize themes such as promises, commands, and
        teachings.
      </P>
      <P>
        2. Ask Reflective Questions: What is God revealing to me in this
        passage? How does this apply to my life today? Is there a promise,
        command, or lesson I need to act on?
      </P>
      <P>
        Use Different Translations: Reading multiple translations can provide
        clarity and deeper understanding of a verse. Join a Study Group:
        Studying with others fosters discussion, accountability, and
        encouragement.
      </P>
      <P>
        Apply What You Learn: Scripture is meant to transform our lives. Take
        practical steps to live out what you read.
      </P>

      <H4>Memorization Tips</H4>
      <P>
        Start Small: Begin with short verses and gradually work up to longer
        passages.
      </P>
      <P>
        Repeat Out Loud: Reading and saying verses out loud reinforces
        retention.
      </P>
      <P>
        Write It Down: Writing verses multiple times helps imprint them in your
        memory.
      </P>
      <P>
        Use Flashcards: Write the verse on one side and the reference on the
        other. Quiz yourself daily.
      </P>
      <P>
        Practice Fill-in-the-Blanks: Remove a few words and try recalling them
        to test your memory.
      </P>
      <P>
        Use Sticky Notes: Place them where you frequently look—mirrors, desks,
        or refrigerators—to remind you throughout the day.
      </P>
      <P>
        Break It Down: Divide longer verses into phrases and memorize them step
        by step.
      </P>
      <P>
        Link It to Everyday Life: Associate a verse with a specific experience
        or situation to make it more meaningful and memorable.
      </P>
      <P>
        Sing or Chant It: Turning verses into songs or rhythms can make them
        easier to recall.
      </P>
      <P>
        Review Regularly: Repetition over time solidifies memory. Make scripture
        review part of your daily routine.
      </P>

      <H4>Final Thoughts</H4>
      <P>
        Bible study and memorization are not about checking off a task but about
        growing closer to God. Approach both with an open heart, persistence,
        and a desire to live out His Word. As you invest time in scripture,
        you'll find that God's truth becomes a guiding light in every aspect of
        your life.
      </P>
    </ScrollView>
  );
}
