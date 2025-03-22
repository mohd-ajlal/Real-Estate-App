import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useGlobalContext } from "@/lib/global-provider";
// import seed from "@/lib/seed";
import { Link } from "expo-router";
import { Button, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  // Function to get current time in HH:MM format
  const getTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Function to get appropriate greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning!";
    if (hours < 18) return "Good Afternoon!";
    return "Good Evening!";
  };


  const {user} = useGlobalContext();

  return (
    <SafeAreaView className="bg-white h-full">
      {/* <Button title="Seed" onPress={seed}/> */}
      <FlatList
        data={[1,2,3,4]}
        renderItem={({item})=><Card/>}
        keyExtractor={(item)=>item.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View className="px-5">
          <View className="flex flex-row items-center justify-between mt-5">
            <View className="flex flex-row">
              <Image source={{uri: user?.avatar}} className="size-12 rounded-full" />
              <View className="flex flex-col items-start ml-2 justify-center">
                <Text className="text-xs font-rubik text-black-100">{getGreeting()}</Text>
                <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
              </View>
            </View>
  
            <Image source={icons.bell} className="size-6"/>
          </View>
        <Search/>
        <View className="my-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={[1,2,3]}
            renderItem={({item})=><FeaturedCard/>}
            keyExtractor={(item)=>item.toString()}
            horizontal
            bounces={false} 
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="mflex gap-5 mt-5"
          />
  
          {/* <View className="flex flex-row gap-5 mt-5">
  
        <FeaturedCard/>
        <FeaturedCard/>
        <FeaturedCard/>
  
  
          </View> */}
        </View>
  
        <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation </Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
            </TouchableOpacity>
          </View>
  
        <Filters/>
          {/* <View className="flex flex-row gap-5 mt-5">
            <Card/>
            <Card/>
  
          </View> */}
        {/* <FeaturedCard/>
        <Card/> */}
        </View>}
      />
      

    </SafeAreaView>
  );
}
