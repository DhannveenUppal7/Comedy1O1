import { BackHandler, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ClubItem from '../components/ClubItem';
import { auth } from '../firebase';

const MyClubs = ({ clubs, mine, setMine }) => {
    const [filteredClubs, setFilteredClubs] = useState([]);
    console.log(clubs);
    useEffect(() => {
        clubs.map((obj) => {
            obj.users.map((user) => {
                if (user.uid === auth.currentUser.uid) {
                    setFilteredClubs(oldArray => [...oldArray, obj])
                }
            })
        })
    }, []);

    BackHandler.addEventListener('hardwareBackPress', function () {
        if (mine === true) {
            setMine(false);
            return true;
        }
        return false;
    });

    const renderItem = (club) => {
        // console.log("Post:", post.item.postDesc);
        return (
            // <Text>{post.item.postDesc}</Text>
            <>
                <ClubItem club={club.item} />
                {/* <ClubItem club={club.item} />
                <ClubItem club={club.item} />
                <ClubItem club={club.item} /> */}

                {/* <FeedPost post={post.item} setCommenting={setCommenting} setSelectedPost={setSelectedPost} setUsersi={setUsersi} setSelectedUser={setSelectedUser} /> */}
            </>
        )
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text className="text-3xl text-center mt-6 font-extrabold">My Clubs</Text>
            {filteredClubs.length > 0 ? <FlatList data={filteredClubs} keyExtractor={(item) => item.id} renderItem={renderItem} /> : <View>
                <Text className="font-bold text-xl mt-6 text-center">You are Not Part of any Comedy Clubs till now, why don't you join one now!</Text>
            </View>}

        </SafeAreaView>
    )
}

export default MyClubs

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "space-evenly",
        backgroundColor: '#FFFFFF'
    }
});