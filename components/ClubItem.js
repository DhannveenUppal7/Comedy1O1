import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ClubItem = ({ club, joinClub }) => {
    const partClub = () => { };
    return (
        <TouchableOpacity className="mx-auto m-2 bg-white rounded-lg shadow-lg max-w-4xl p-6 mb-5 border-black" style={{ borderWidth: 0.3 }} onPress={joinClub}>
            {/* <TouchableOpacity onPress={openUser}>
                <Text className="mb-2 text-gray-700 font-bold">By {post.createdByName}</Text>
            </TouchableOpacity> */}
            <Image source={{ uri: club.clubImage }} className="w-full rounded-md" style={{ height: 300, width: 300 }} />
            <Text className="font-bold text-center mt-4 text-2xl">{club.name}</Text>
        </TouchableOpacity>
    )
}

export default ClubItem

const styles = StyleSheet.create({})