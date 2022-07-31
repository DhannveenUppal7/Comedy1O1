import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import CreateClub from './CreateClub';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ClubItem from '../components/ClubItem';
import MyClubs from './MyClubs';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../components/Button';
import ModalComp from '../components/ModalComp';
import ClubChat from './ClubChat';
import ClUsrs from './ClUsrs';

const ComedyClubs = () => {
    const navigation = useNavigation();
    const [creating, setCreating] = useState(false);
    const [mine, setMine] = useState(false);
    const [clubs, setClubs] = useState([]);
    const [selID, setSelID] = useState("");
    const [openClub, setOpenClub] = useState(false);
    const [openSClub, setOpenSClub] = useState({});
    const [openUsrs, setOpenUsrs] = useState(false);
    const [topClubs, setTopClubs] = useState([]);
    const joinModal = useRef();

    useLayoutEffect(() => {
        if (!openUsrs) {
            if (!openClub) {
                if (!mine) {
                    if (creating) {
                        navigation.setOptions({
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity onPress={() => { setCreating(false) }}>
                                        <Ionicons size={30} name="arrow-back" color="white" style={{ marginLeft: 10 }} />
                                    </TouchableOpacity>
                                )
                            },
                            headerRight: () => {
                                return (
                                    null
                                )
                            }
                        })
                    }
                    else {
                        navigation.setOptions({
                            headerTitle: "Comedy Clubs",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity onPress={() => { setMine(true) }} style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 16, color: "white" }}>My Clubs</Text>
                                        {/* <Ionicons size={30} name="arrow-back" color="white" style={{ marginLeft: 10 }} /> */}
                                    </TouchableOpacity>
                                )
                            },
                            headerRight: () => {
                                return (
                                    <TouchableOpacity onPress={() => { setCreating(true) }}>
                                        <Ionicons size={30} name="add" color="white" style={{ marginRight: 10 }} />
                                    </TouchableOpacity>
                                )
                            }
                        })
                    }
                }
                else {
                    if (mine) {
                        navigation.setOptions({
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity onPress={() => { setMine(false) }}>
                                        {/* <Text>My Clubs</Text> */}
                                        <Ionicons size={30} name="arrow-back" color="white" style={{ marginLeft: 10 }} />
                                    </TouchableOpacity>
                                )
                            },
                            headerRight: () => {
                                return (
                                    null
                                )
                            }
                        })
                    }
                    else {
                        navigation.setOptions({
                            headerTitle: "Comedy Clubs",
                            headerLeft: () => {
                                return (
                                    null
                                )
                            }
                        })
                    }
                }
            }
            else {
                if (openClub === true) {
                    navigation.setOptions({
                        headerTitle: `${openSClub.name}`,
                        headerLeft: () => {
                            return (
                                <TouchableOpacity onPress={() => { setOpenClub(false) }}>
                                    <Ionicons size={30} name="arrow-back" color="white" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            )
                        },
                        headerRight: () => {
                            return (
                                <TouchableOpacity onPress={() => { setOpenUsrs(true) }}>
                                    <Ionicons size={30} name="people-circle-sharp" color="white" style={{ marginRight: 10 }} />
                                </TouchableOpacity>
                            )
                        }
                    })
                }

            else{
                navigation.setOptions({
                    headerTitle: `Comedy Clubs`,
                })
            }
            }
        }
        else {
            if (openUsrs === true) {
                navigation.setOptions({
                    headerTitle: 'Comedy Souls',
                    headerLeft: () => {
                        return (
                            <TouchableOpacity onPress={() => { setOpenUsrs(false) }}>
                                <Ionicons size={30} name="arrow-back" color="white" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        )
                    },
                    headerRight: () => {
                        return (
                            null
                        )
                    }
                })
            }
        }
    }, [creating, mine, openClub, openUsrs]);



    useEffect(() => {
        const clubsData = query(collection(db, "clubs"), orderBy("createdAt", "desc"), where("status", "==", true));
        onSnapshot(clubsData, (querySnapshot) => {
            setClubs(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            })));
            setTopClubs(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            })))
        });
    }, []);
    const renderItem = (club) => {
        // console.log("Post:", post.item.postDesc);
        const joinClub = (club) => {
            let results = club.item.users.filter(obj => {
                return obj.uid === auth.currentUser.uid;
            });
            if (results.length === 0) {
                setSelID(club.item.id);
                joinModal.current.open();
            }
            else {
                setOpenClub(true);
                setOpenSClub(club.item);
            }
        };
        return (
            <>
                <ClubItem club={club.item} joinClub={()=>{joinClub(club)}} />
            </>
        )
    };

    const joinClub = () => {

    }

    const sortingClubs = () => {
        clubs.sort((a, b) => {
            if (a.users.length > b.users.length)
                return -1;
            if (a.users.length < b.users.length)
                return 1;
            return 0;
        })
    };


    return (
        <>
            {!openUsrs ? !openClub ? !mine ? !creating ? <SafeAreaView style={styles.container}>
                {/* <Button title="OPEN BOTTOM SHEET" onPress={() => joinModal.current.open()} /> */}

                <RBSheet
                    ref={joinModal}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    customStyles={{
                        wrapper: {
                            flex: 1,
                        },
                        container: {
                            height: "40%"
                        },
                        draggableIcon: {
                            backgroundColor: "#000"
                        },
                    }}
                >
                    <ModalComp selectedID={selID} clubs={clubs} joinModalx={joinModal} />
                </RBSheet>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="p-6">
                        <Text className="text-3xl font-bold">Latest Clubs</Text>
                    </View>
                    <FlatList horizontal pagingEnabled={true} showsHorizontalScrollIndicator={false} legacyImplementation={false} data={clubs} keyExtractor={(item) => item.id} renderItem={renderItem} />
                    <View className="p-6">
                        <Text className="text-3xl font-bold">Most Visited Clubs</Text>
                    </View>
                    <FlatList horizontal pagingEnabled={true} showsHorizontalScrollIndicator={false} legacyImplementation={false} data={topClubs.sort((a, b) => {
                        if (a.users.length > b.users.length)
                            return -1;
                        if (a.users.length < b.users.length)
                            return 1;
                        return 0;
                    })} keyExtractor={(item) => item.id} renderItem={renderItem} />
                    {/* <View style={{ flexDirection: "row" }}>
                    <View className="bg-white ml-1 rounded-md h-36 w-1/3">
                        <Image source={{ uri: "https://images-na.ssl-images-amazon.com/images/I/91iUZ3FiAML.jpg" }} className="w-full h-full rounded-md" />
                    </View>
                    <View className="bg-white ml-1 rounded-md h-36 w-1/3">
                        <Image source={{ uri: "https://images-na.ssl-images-amazon.com/images/I/91iUZ3FiAML.jpg" }} className="w-full h-full rounded-md" />
                    </View>
                </View> */}


                </ScrollView>
            </SafeAreaView> : <CreateClub creating={creating} setCreating={setCreating} /> : <MyClubs clubs={clubs} mine={mine} setMine={setMine} /> : <ClubChat club={openSClub} openClub={openClub} setOpenClub={setOpenClub} /> : <ClUsrs openUsrs={openUsrs} setOpenUsrs={setOpenUsrs} club={openSClub} />}
        </>
    )
}

export default ComedyClubs

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "space-evenly",
        backgroundColor: '#FFFFFF'
    }
})