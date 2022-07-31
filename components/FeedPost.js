import { Image, Linking, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Hyperlink from 'react-native-hyperlink'


const FeedPost = ({ post, setCommenting, setSelectedPost, setUsersi, setSelectedUser }) => {
  const [likedByMe, setLikedByMe] = useState(false);
  const [totalLikes, setTotalLikes] = useState(post.likes.length);
  const navigation = useNavigation();

  const like = async () => {
    let aLikes = post.likes;
    if (aLikes.includes(auth.currentUser.uid) === false) {
      aLikes.push(auth.currentUser.uid);
      const docRef = updateDoc(doc(db, "posts", post.id), {
        likes: aLikes
      }).then(() => {
        setLikedByMe(true);
        setTotalLikes(totalLikes + 1);
      })
    }
  };

  const unlike = async () => {
    let aLikes = post.likes;
    if (aLikes.includes(auth.currentUser.uid) === true) {
      let myIndex = aLikes.indexOf(auth.currentUser.uid);
      aLikes.splice(myIndex, 1);
      const docRef = updateDoc(doc(db, "posts", post.id), {
        likes: aLikes
      }).then(() => {
        setLikedByMe(false);
        setTotalLikes(totalLikes - 1);
      })
    }
  };
  const comment = () => {
    setSelectedPost(post);
    setCommenting(true);
    // navigation.navigate("Comments")
  }
  const openUser = () => {
    setUsersi(true);
    setSelectedUser(post.createdByID);
  }
  return (
    <TouchableOpacity className="mx-auto m-2 bg-white rounded-lg shadow-lg max-w-4xl p-6 mb-5 border-black" style={{ borderWidth: 0.3 }} onPress={comment}>
      <TouchableOpacity onPress={openUser}>
        <Text className="mb-2 text-gray-700 font-bold">By {post.createdByName}</Text>
      </TouchableOpacity>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {/* <Image source={{ uri: "https://www.dhannveenuppal.com/profile.jpeg" }}  style={{ width: 300,height: 300 }} resizeMode="contain" /> */}

      </View>
      {post.postType === "text" ? <Hyperlink linkStyle={{ color: "blue" }} linkDefault={ true } onPress={Linking.openURL}>
        <Text className="text-lg mt-3">{post.postDesc}</Text>
        </Hyperlink> : <><View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image source={{ uri: post.postImage }} className="rounded-md w-full" style={{ height: 300 }} />
      </View>
      <Hyperlink linkStyle={{ color: "blue" }} linkDefault={ true } onPress={Linking.openURL}>
        <Text className="text-lg mt-3">{post.postDesc}</Text>
        </Hyperlink>
      </>}
      <View className=" bg-black w-full h-0.5 mt-2" style={{ opacity: 0.1 }}></View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {/* <FontAwesome5 size={30} name="heart" /> */}
        {likedByMe || post.likes.includes(auth.currentUser.uid) ? <TouchableOpacity onPress={unlike}>
          <Ionicons size={30} name="heart" color="red" />
        </TouchableOpacity> : <TouchableOpacity onPress={like}>
          <Ionicons size={30} name="heart-outline" color="red" />
        </TouchableOpacity>}
        <TouchableOpacity onPress={comment}>
          <FontAwesome5 size={25} name="comment" color="black" />
        </TouchableOpacity>
        <Text>{totalLikes} Likes</Text>
      </View>
    </TouchableOpacity>
  )
}

export default FeedPost

const styles = StyleSheet.create({})