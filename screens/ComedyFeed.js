import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth, db } from '../firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import FeedPost from '../components/FeedPost';
import CommentsScreen from './CommentsScreen';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import UserScreen from './UserScreen';


const ComedyFeed = ({ route }) => {
  const [posts, setPosts] = useState([]);
  // const { posts } = route.params;
  const [commenting, setCommenting] = useState(false);
  const [usersi, setUsersi] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  useEffect(() => {
    const postsData = query(collection(db, "posts"), orderBy("createdAt", "desc"), where("status", "==", true));
    onSnapshot(postsData, (querySnapshot) => {
      setPosts(querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })))
    });
  }, []);
  const renderItem = (post) => {
    // console.log("Post:", post.item.postDesc);
    return (
      // <Text>{post.item.postDesc}</Text>
      <>
        <FeedPost post={post.item} setCommenting={setCommenting} setSelectedPost={setSelectedPost} setUsersi={setUsersi} setSelectedUser={setSelectedUser} />
      </>
    )
  };
  const navigation = useNavigation();
  useLayoutEffect(() => {
    if (!usersi) {
      if (commenting) {
        navigation.setOptions({
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => { setCommenting(false) }}>
                <Ionicons size={30} name="arrow-back" color="white" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )
          }
        })
      }
      else {
        navigation.setOptions({
          headerLeft: () => {
            return (
              null
            )
          }
        })
      }
    }
    else {
      if (usersi) {
        navigation.setOptions({
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => { setUsersi(false) }}>
                <Ionicons size={30} name="arrow-back" color="white" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )
          }
        })
      }
      else {
        navigation.setOptions({
          headerLeft: () => {
            return (
              null
            )
          }
        })
      }
    }
  }, [commenting, usersi]);
  return (
    <>
      {!usersi ? !commenting ? <SafeAreaView style={styles.container}>
        <View className="pr-6 pt-6 pl-6">
          <Text className="text-3xl font-bold">Hello {auth.currentUser.displayName}</Text>
          <Text className="text-lg font-bold text-gray-600">Here's your Comedy Feed For Today!</Text>
        </View>
        <View className="ml-6 mt-3 bg-black w-full h-0.5"></View>
        {/* <View> */}
        <FlatList

          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        {/* </View> */}
      </SafeAreaView> : <CommentsScreen setCommenting={setCommenting} post={selectedPost} setUsersi={setUsersi} commenting={commenting} setSelectedUser={setSelectedUser} /> : <UserScreen setUsersi={setUsersi} usersi={usersi} user={selectedUser} />}
    </>
  )
}

export default ComedyFeed

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    backgroundColor: '#FFFFFF'
  }
})