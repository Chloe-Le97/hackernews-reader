import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Link, useHistory } from "react-router-native";
import Constants from 'expo-constants';
import LinkButton from '../LinkButton'


// import Text from './Text';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'orange',
    flexDirection: 'row',
    height: 75,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text:{
    color: 'black',
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const AppBar = () => {
    const history = useHistory();

    return (
        <View style={styles.container}>
        <ScrollView horizontal>

            <TouchableOpacity onPress={() => history.push('/')}>
                <Text style={styles.text}>News</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => history.push('/saved')}>
                <Text style={styles.text}>Saved posts</Text>
            </TouchableOpacity>




        </ScrollView>
        </View>);
};

export default AppBar;