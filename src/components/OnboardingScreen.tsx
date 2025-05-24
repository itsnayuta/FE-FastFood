// components/OnboardingScreen.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, FlatList, Animated } from 'react-native';
import CustomButton from './CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Chào mừng đến với KFC',
    description: 'Khám phá thế giới ẩm thực tuyệt vời với những món ăn ngon nhất từ KFC',
    image: require('../assets/onboardings/onboarding-1.jpg'),
  },
  {
    id: '2',
    title: 'Đặt hàng dễ dàng',
    description: 'Chỉ với vài bước đơn giản, bạn có thể đặt món ăn yêu thích và nhận hàng nhanh chóng',
    image: require('../assets/onboardings/onboarding-2.png'),
  },
  {
    id: '3',
    title: 'Theo dõi đơn hàng',
    description: 'Theo dõi trạng thái đơn hàng của bạn và nhận thông báo khi đơn hàng được giao',
    image: require('../assets/onboardings/onboarding-3.jpg'),
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleComplete = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    navigation.replace('Login');
  };

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <Pagination />
      <View style={styles.buttonContainer}>
        <CustomButton
          title={currentIndex === slides.length - 1 ? "Bắt đầu" : "Tiếp tục"}
          onPress={scrollTo}
          primary
        />
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleComplete}
          >
            <Text style={styles.skipText}>Bỏ qua</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a51c30',
    marginHorizontal: 4,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipText: {
    color: '#666',
    fontSize: 16,
  },
});

export default OnboardingScreen;