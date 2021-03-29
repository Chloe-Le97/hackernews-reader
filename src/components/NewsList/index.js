import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import NewsItem from './NewsItem';
import { useDebouncedCallback } from 'use-debounce';

const styles = StyleSheet.create({
    separator: {
      height: 10,
    },
    flatlist:{
    //   marginBottom: 100,
      flexGrow:1, 
      height: Dimensions.get('window').height - 30
    },
    pageNumberContainer:{
        // marginTop: 20,
        width: 200,
        display: 'flex',
        flexDirection: 'row',
        // justifyContent:'space-around',
        // border: '1px solid black',
        padding: 5,
    },
    pageNumber:{
        backgroundColor:'orange',
        borderWidth: 1,
        width: 40,
        textAlign: 'center'
    },
    current:{
        borderWidth: 1,
        backgroundColor: 'white',
        width: 40,
    },
    searchBar:{
      padding: 10,

    }
  });

const ItemSeparator = () => <View style={styles.separator} />;

const NewsList = () => {

    const flatListRef = useRef()

    const [news, setNews] = useState([]);
    const [maxPage, setMaxPage] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true)

    const fetchApiNews = async () =>{
        let response;
        
        if(searchInput!=''){
          response = await fetch(`http://hn.algolia.com/api/v1/search?query=${searchInput}&page=${currentPage}&tags=story`);

          const json = await response.json();
          
          flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
          setNews(json.hits);
          setLoading(false)
          setMaxPage(json.nbPages);

        }else{

          response = await fetch(`https://hn.algolia.com/api/v1/search_by_date?page=${currentPage}&tags=story`);

          const json = await response.json();
          
          flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
          setNews(json.hits);
          setLoading(false)
          setMaxPage(json.nbPages);
        }
  
    }

    useEffect(()=>{
        fetchApiNews()
    },[currentPage])

    const searchNews = useDebouncedCallback(
      async (value)=>{
        const response = await fetch(`http://hn.algolia.com/api/v1/search?query=${value}&page=${currentPage}&tags=story`);
        const json = await response.json();

        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
        setNews(json.hits);
        setLoading(false)
        setMaxPage(json.nbPages);
      },500
    )

    if(loading==true){
      return(
        <Text>Loading...</Text>
      )
    }

    const setPage = (page) =>{
      setLoading(true); 
      setCurrentPage(page)
    }

    return(
        <View style={{marginBottom: 150, flexGrow:1, backgroundColor:'#F6F6EF'}}>
        <TextInput style={styles.searchBar} placeholder="Search" value={searchInput} onChangeText={(text) => {setSearchInput(text);searchNews(text)}}></TextInput>
        <FlatList
        data={news}
        ref={flatListRef}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ minHeight: `100%` }}
        scrollEnabled={true}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index, ItemSeparatorComponent })=>(
          <View key={item.objectID} style={{ flex: 1 }}>
            <NewsItem item={item}/> 
          </View>
        )}
      />
                <View style={styles.pageNumberContainer}>
                {currentPage<=1?(null):(<TouchableOpacity style={styles.pageNumber} onPress={()=> setPage(currentPage-1)}><Text style={{textAlign:'center'}}>{currentPage-1}</Text></TouchableOpacity>)}
                <TouchableOpacity disabled={true} style={styles.current}><Text style={{textAlign:'center'}}>{currentPage}</Text></TouchableOpacity>
                {currentPage>maxPage?(null):currentPage>=maxPage-3?(
                <>
                <TouchableOpacity style={styles.pageNumber} onPress={()=> setPage(currentPage+1)}><Text style={{textAlign:'center'}}>{currentPage+1}</Text></TouchableOpacity>
                {/* <TouchableOpacity style={styles.pageNumber} onPress={()=> {setCurrentPage(currentPage+2)}}><Text style={{textAlign:'center'}}>{currentPage+2}</Text></TouchableOpacity> */}
                </>)
                    :(
                    <>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setPage(currentPage+1)}><Text style={{textAlign:'center'}}>{currentPage+1}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setPage(currentPage+2)}><Text style={{textAlign:'center'}}>{currentPage+2}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setPage(currentPage+3)}><Text style={{textAlign:'center'}}>...</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setPage(maxPage-1)}><Text style={{textAlign:'center'}}>{maxPage-1}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setPage(maxPage)}><Text style={{textAlign:'center'}}>{maxPage}</Text></TouchableOpacity>
                </>)}
            </View>
      </View>
    )
}

export default NewsList;