import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Button = ({ title, onClick, checkFor }) => {
    return (
        <View>
            {checkFor ? <TouchableOpacity onPress={onClick} className="bg-indigo-500 p-3 text-center rounded-md mt-6" style={styles.activeButton}>
                <Text className="text-xl text-white">{title}</Text>
            </TouchableOpacity> :  <TouchableOpacity className="bg-gray-500 p-3 text-center rounded-md mt-6" style={styles.activeButton}>
                <Text className="text-xl text-white">{title}</Text>
            </TouchableOpacity>}
        </View>
    )
}

export default Button

const styles = StyleSheet.create({
    activeButton: {
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center"
    }
})