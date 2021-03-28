import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import NewsItem from './NewsItem'

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
        width: 200,
        display: 'flex',
        flexDirection: 'row',
        // justifyContent:'space-around',
        // border: '1px solid black',
        padding: 5,
    },
    pageNumber:{
        borderWidth: 1,
        width: 40,
        textAlign: 'center'
    },
    current:{
        borderWidth: 1,
        backgroundColor: '#f0ece6',
        width: 40,
    }
  });

const ItemSeparator = () => <View style={styles.separator} />;

const NewsList = () => {

    const flatListRef = useRef()

    const [news, setNews] = useState([]);
    const [maxPage, setMaxPage] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchApiNews = async () =>{
        const response = await fetch(`https://hn.algolia.com/api/v1/search_by_date?page=${currentPage}&tags=story`);
        const json = await response.json();

        flatListRef.current.scrollToOffset({ animated: false, offset: 0 })
        console.log(flatListRef.current)
        console.log(json);
        setNews(json.hits);
        setMaxPage(json.nbPages);
        
    }

    useEffect(()=>{
        fetchApiNews()
    },[currentPage])


    return(
        <View style={{marginBottom: 100, flexGrow:1}}>
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
        ListFooterComponent={()=>(
            <View style={styles.pageNumberContainer}>
                {currentPage<=1?(null):(<TouchableOpacity style={styles.pageNumber} onPress={()=> setCurrentPage(currentPage-1)}><Text style={{textAlign:'center'}}>{currentPage-1}</Text></TouchableOpacity>)}
                <TouchableOpacity disabled={true} style={styles.current}><Text style={{textAlign:'center'}}>{currentPage}</Text></TouchableOpacity>
                {currentPage>=50?(null):(<>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setCurrentPage(currentPage+1)}><Text style={{textAlign:'center'}}>{currentPage+1}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> {setCurrentPage(currentPage+2)}}><Text style={{textAlign:'center'}}>{currentPage+2}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setCurrentPage(currentPage+3)}><Text style={{textAlign:'center'}}>...</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setCurrentPage(maxPage-1)}><Text style={{textAlign:'center'}}>{maxPage-1}</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pageNumber} onPress={()=> setCurrentPage(maxPage)}><Text style={{textAlign:'center'}}>{maxPage}</Text></TouchableOpacity>
                </>)}
            </View>
        )}
      />
      </View>
    )
}

export default NewsList;