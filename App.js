import React, { Component } from 'react';
import { View, Text, Button, Modal,Image,Animated,ImageBackground,StyleSheet,Easing,FlatList,TouchableOpacity} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  createStackNavigator } from '@react-navigation/stack';
import ViewPager from '@react-native-community/viewpager';
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';

const songs = ["A-Lin - 有一种悲伤.mp3","	胡彦斌 _ Jony J - 返老还童.mp3","汪苏泷 - 不服 (Live).mp3","	孙燕姿 - 开始懂了 (Live).mp3","	冰块先生 - 11862.mp3"]
const url = "http://123.56.28.23/music/"
const bcki_url = "http://123.56.28.23/photo/2.jpg"
const Drawer=createDrawerNavigator()
const Tab=createBottomTabNavigator()
const Stack=createStackNavigator()
var p = 0
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 100,
  }
});
export default class App extends Component {
  constructor(props){
    super(props)
    
    this.state={visible:true}
     
  }
  
  _hide=()=>{
      this.setState({visible:false})
  }
  
  render() {
    return (
      
      <NavigationContainer>
        <Modal visible={this.state.visible}>
        <ViewPager style={{flex:1}} initialPage={0}>
      <View key="1">
        {/* <Text>First page</Text> */}
        <ImageBackground style={{flex:1}}
              source={{uri: 'http://123.56.28.23/photo/10.jpg'}}>        
        </ImageBackground>
      </View>
      <View key="2">
        <ImageBackground style={{flex:1}}
              source={{uri: 'http://123.56.28.23/photo/11.jpg'}}>                   
        </ImageBackground>
        {/* <Text>Second page</Text> */}
        <Button title="关闭" onPress={this._hide}/>
      </View>
    </ViewPager>
        </Modal>
        <Drawer.Navigator>
            <Drawer.Screen name="Main" component={Main}/>
            <Drawer.Screen name="Setting" component={Setting}/>
        </Drawer.Navigator>
      </NavigationContainer>
    )
  }
}

class Main extends React.Component{

  render(){
    return <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused
            ? 'ios-information-circle'
            : 'ios-information-circle-outline';
        } else if (route.name === 'Music') {
          iconName = focused ? 'ios-list-box' : 'ios-list';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })} 
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}>
      <Tab.Screen name ="Home" component={Home}/>
      <Tab.Screen name ="Music" component={Music}/>
    </Tab.Navigator>
  }
}

class Music extends React.Component{

  render(){
    return<Stack.Navigator>
        <Stack.Screen name="ItemList" component={ItemList}/>
        <Stack.Screen name="ItemDetail" component={ItemDetail}/>
    </Stack.Navigator>
  }
}

class ItemList extends React.Component{
  constructor(props){
    super(props)
    this.url="http://123.56.28.23:8080/singe/findAll"
    this.max=4
    this.state={data:[],albums:[]}
   
}


componentDidMount(){
    fetch(this.url,{method:"GET"})
    .then(resp=>resp.json())
    .then(albums=>{
        console.log(albums)
        this.setState({albums:albums})
    })
}

_del=id=>{
    
    fetch(this.url+"/"+id,{method:"DELETE"})
    .then(resp=>resp.json())
    .then(obj=>{
        let data=this.state.albums.splice(0)
        let index=data.findIndex(album=>album.id===id)
        console.log(index,id)
        data.splice(index,1)
        this.setState({albums:data})
    })

   
}


_renderItem=({item})=>{
    return (
      <TouchableOpacity
      
    >
        <View style={{height:155,justifyContent:"space-between",flexWrap:"wrap",flexDirection:'row',alignItems:"center",marginTop:5}} >
            <View><Image style={{width:150,height:150}} source={{uri:item.img}}/></View>
            <View style={{height:10}}><Text style={{fontSize:20}}>{item.name}</Text></View>
            <View  ><Button style={{width:100,height:100,textAlign:"center",textAlignVertical:'center'}} title ="显示" onPress={()=>this.showDetails(item.id,item.name,item.singer,item.img)}/>
              </View>
            
            
        </View>
        </TouchableOpacity>
        
    )
}
_ItemSeparatorComponent=()=>{
    return <View style={{height:1,backgroundColor:"red"}}></View>
}

_refresh=()=>{
    let d=Math.floor(Math.random()*100+100)
    let data=this.state.data.splice(0)
    data.unshift(d)
    this.setState({data:data})
}
_reachEnd=()=>{
    let data=this.state.data.splice(0)
    data.push(++this.max)
    this.setState({data:data})
}
showDetails =(id,name,singer,img)=>{
  let params = {list_id:id,list_name:name,list_singer:singer,list_img:img}
  this.props.navigation.navigate("ItemDetail",params)

}
render() {

    return (

     <View>
            <FlatList
                ListEmptyComponent={<Text>数据是空的</Text>}
                keyExtractor={({item,index})=>index}
                ItemSeparatorComponent={this._ItemSeparatorComponent}
                data={this.state.albums} 
                renderItem={this._renderItem}
 
            />
        </View>  
    )
}
}

class ItemDetail extends React.Component{
  constructor(props) {
    super(props);
    

    this.state = {
        
    };
  }
  render() {
    return (
        <View>
          <View style={{alignItems:'center',marginTop:30}}><Image style={{width:160,height:160}} source={{uri:this.props.route.params.list_img}}/></View>
          <View><Text style={{fontSize:20,textAlign:'center',marginTop:30}}>歌名：{this.props.route.params.list_name}</Text></View>
          <View><Text style={{fontSize:20,textAlign:'center',marginTop:30}}>歌手：{this.props.route.params.list_singer}</Text></View>
        </View>
    );
  }
}

class Home extends React.Component{
  constructor(props){
    super(props);
    this.player=null
    this.state={paused:true,song:songs[p],source:{uri:url+songs[p]},
  duration:1,currentTime:0,
  bounceValue: new Animated.Value(1), 
  rotateValue: new Animated.Value(0),
  w_time:0,
}   
  }
  componentDidMount(){
    this.startAnimation()
  }
  startAnimation() {
    this.state.bounceValue.setValue(1);

    this.state.rotateValue.setValue(0);
    Animated.parallel([
        
        Animated.spring(this.state.bounceValue, {
            toValue: 1,      
            friction: 20,    
        }),
        Animated.timing(this.state.rotateValue, {
            toValue: 1,  
            duration: 15000,  
            
            easing: Easing.out(Easing.linear),
        }),
        
    ]).start(()=>this.startAnimation());
}
  _playController=()=>{
    let paused=this.state.paused
    this.setState({paused:!paused})
  }
  _next=()=>{
    p++
    this.setState({source:{uri:url+songs[p]},song:songs[p]})
  }
  _prev=()=>{
    p--
    this.setState({source:{uri:url+songs[p]},song:songs[p]})
  }
  _loadHandler=({duration})=>{
    this.setState({duration})
  }
  _progressHandler=({currentTime})=>{
    this.setState({currentTime})
  }
  _seekHandler=value=>{
    this._player.seek(value)
  }
  _endHandler=()=>{
    this._next()
  }
  render(){
    return(
    
    <View style={{flex:1,justifyContent:'flex-end'}}>
    <View style={styles.container}>
             
             <Animated.Image source={{uri:'http://123.56.28.23/photo/4.jpg'}}
                style={{width:200,
                height: 200,borderRadius:100, 
                transform: [
                                                
                {scale: this.state.bounceValue},
                                                
                {rotateZ: this.state.rotateValue.interpolate({
                inputRange: [0,1],
                outputRange: ['0deg', '360deg'],
                })},
                ]}}>
             </Animated.Image>

     </View>
    
            <Video source={this.state.source}
            ref={ref=>this._player=ref}
             paused={this.state.paused}
             onLoad={this._loadHandler}
             onProgress={this._progressHandler}
            onEnd={this._endHandler}
             />
             <Text style={{fontSize:20,marginBottom:20,textAlign:'center'}}>{this.state.song}</Text>

            <Slider style={{height:30}} minimumValue={0} 
            onSlidingComplete={this._seekHandler}
            maximumValue={this.state.duration} 
            value={this.state.currentTime}/>

             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Button title="上一首" onPress={this._prev}/>
                <Button title="播放/暂停" onPress={this._playController}/>
                <Button title="下一首" onPress={this._next}/>
             </View>
             
        
    </View>
    )
  }
}

class Setting extends React.Component{

  render(){
    return(
      <View>
        <Text style={{fontSize:40,textAlign:'center',marginTop:50}}>
       
        MADE BY FRANK
        </Text>
        <Text style={{fontSize:20,marginTop:15}}>
        非常抱歉这个小项目写的这么简陋，因为之前一直在忙着写学校里给的项目，
        加之一开始其他组员和我说只要我负责上传的任务，所以我也没怎么管，一直
        到昨天才得知其他人阿里云服务器都没有，reactnative也连不上模拟器之后
        在匆匆忙忙熬夜写的。之前没和这些组员组过小组，所以不是很了解。总之
        很抱歉。
        </Text>
  
      </View>
      

     )  
  }
}