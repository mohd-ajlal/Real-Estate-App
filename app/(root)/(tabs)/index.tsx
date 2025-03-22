import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
// import seed from "@/lib/seed";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Button, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

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

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {data:latestProperties, loading:latestPropertiesLoading}= useAppwrite({
    fn:getLatestProperties
  })

  const {data:properties, loading, refetch} = useAppwrite({
    fn:getProperties,
    params: {
      query: params.query!,
      filter: params.filter!,
      limit:6,
    },
    skip:true
  })

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  useEffect(()=>{
    refetch({
      query: params.query!,
      filter: params.filter!,
      limit:6,
    })
  },[params.query, params.filter])

  return (
    <SafeAreaView className="bg-white h-full">
      {/* <Button title="Seed" onPress={seed}/> */}
      <FlatList
        data={properties}
        renderItem={({item})=><Card item={item} onPress={()=>handleCardPress(item.$id)}/>}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={<View className="px-5"
        >
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

          {latestPropertiesLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !latestProperties || latestProperties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={latestProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
  
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
