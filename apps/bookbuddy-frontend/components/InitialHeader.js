import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const InitialHeader = () => {


    <View style={styles.header}>
       <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      /> 
        <Text style={styles.title}>BookBuddy</Text>
        <Text style={styles.subtitle}>Your next chapter begins here</Text>
      </View>

}


const styles = StyleSheet.create({

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333'
    },
    header:{
        width: '100%',
        alignItems: 'center',
        height: 100,
        marginBottom: 10,
    },

});

export default InitialHeader;