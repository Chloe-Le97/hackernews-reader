import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, TouchableWithoutFeedback, useWindowDimensions} from 'react-native';
import {useParams} from 'react-router-native';
import * as Linking from 'expo-linking';
import HTML from "react-native-render-html";

const styles = StyleSheet.create({
    separator: {
      height: 10,
    },
    flatlist:{
      marginBottom: 1000,
      flexGrow:1, 
      height: Dimensions.get('window').height - 30
    },
    p:{
        fontWeight: '300',
        color: '#FF3366'
    },
    commentAuthor:{
        fontSize: 12,
        fontWeight: '400',
    }
  });

const ItemSeparator = () => <View style={styles.separator} />;

const CommentRender = (props) => {
    let item = props.item;
    const contentWidth = useWindowDimensions().width;

    return(
    <View>
        <Text style={styles.commentAuthor}>{item.author} on {item.created_at.split("T")[0]}</Text>
        <HTML containerStyle={{marginTop: -15, padding: 0}} source={{ html: item.text }} contentWidth={contentWidth} />
        {item.children.length>0?(
        <>
            {item.children.map((child) => 
            (<CommentRender key={child.id} item={child}/>))}
        </>)
        :(null)}
    </View>)
}


const SingleView = () =>{

    const id = useParams().id;

    console.log(id)

    const [comments, setComments] = useState([]);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    const fetchAPI = async () =>{

        const response = await fetch(`https://hn.algolia.com/api/v1/items/${id}`)
        const json = await response.json();

        setComments(json.children)
        setTitle(json.title)
        setUrl(json.url)

        console.log(json.children);
    }

    useEffect(()=>{
        fetchAPI();
    },[])

    if(title==''){return (<View><Text>Loading...</Text></View>)}

    const timeConverter = (date) =>{
        const newDate =  date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()
        return newDate
    }

    return(
        <View>
            <View>
                <Text>{title}</Text>
                <TouchableWithoutFeedback onPress={()=> Linking.openURL(`${url}`)}><Text>({url})</Text></TouchableWithoutFeedback>
            </View>
            <View style={{marginTop: 25}}>
            <FlatList
            data={comments}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={{ minHeight: `100%` }}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            renderItem={({ item, index, ItemSeparatorComponent })=>(
            <View key={item.objectID} style={{ flex: 1 }}>
                <View>
                    <CommentRender item={item}/>
                </View> 
            </View>
            )}
            />
            </View>
         </View>
    )

}

export default SingleView