import React from 'react';
import Container from '~/components/Container';
import VersesTab from './versesTab';
import { Animated, StyleSheet, View } from 'react-native';
import Title from '~/components/Title';
import CustomButton from '~/components/CustomButton';
import CollectionsTab from './CollectionsTab';
import { useTabStore } from '~/store/tab-store';

export default function VersesHomeScreen() {
  const { activeTab, setActiveTab } = useTabStore();
  return (
    <Container>
      <View>
      <Title text='Verses & Collections' />
      <View className='flex flex-row gap-3 py-3'>
          <CustomButton 
            className={activeTab === 'verses' ? 'w-fit' : 'bg-white w-fit'} 
            textClassName={activeTab === 'verses' ? 'text-white' : 'text-gray-600'}
            onPress={() => setActiveTab('verses')}
          >
            Verses
          </CustomButton>
          <CustomButton 
            className={activeTab === 'collections' ? 'w-fit' : 'bg-white w-fit'}
            textClassName={activeTab === 'collections' ? 'text-white' : 'text-gray-600'}  
            onPress={() => setActiveTab('collections')}
          >
            Collections
          </CustomButton>
        </View>

        <Animated.View style={{ opacity: activeTab === 'verses' ? 1 : 0 }}>
          {activeTab === 'verses' && <VersesTab />}
        </Animated.View>
        <Animated.View style={{ opacity: activeTab === 'collections' ? 1 : 0 }}>
          {activeTab === 'collections' && <CollectionsTab />}
        </Animated.View>
    </View>
    </Container>
  );
}

const styles = StyleSheet.create({

});
