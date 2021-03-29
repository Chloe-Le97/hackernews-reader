import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import FavoriteItem from './FavoriteItem'

const styles = StyleSheet.create({
    separator: {
      height: 10,
    },
  });

const ItemSeparator = () => <View style={styles.separator} />;

const SavedPost = () =>{

    const [savedPosts, setSavedPosts]= useState([])

    const getNews = async () =>{
        let jsonValue = await AsyncStorage.getItem('POSTS');
        let raw = JSON.parse(jsonValue);

        setSavedPosts(raw)
    }

    useEffect(()=>{
        getNews()
    },[])

    return(
        <View style={{marginBottom: 100, flexGrow:1, backgroundColor:'#F6F6EF'}}>
        <FlatList
        data={savedPosts}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ minHeight: `100%` }}
        scrollEnabled={true}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index, ItemSeparatorComponent })=>(
          <View key={item.objectID} style={{ flex: 1 }}>
            <FavoriteItem item={item}/> 
          </View>
        )}
      />
      </View>
    )

}

export default SavedPost;