import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import Button from './Button'


const route = {
  type: 'push',
  route: {
    key: 'about',
    title: 'About'
  }
}


class Home extends React.Component{
  constructor (props) {
    super(props);
  }


  baba(){
    
      debugger;
      var x = "fsdfsd";
  }

 

  render(){
    return(  <View style={styles.container}>
    <Text style={styles.title}>Home</Text>
    <Button onPress={() => this.props._handleNavigate(route)} label='Go To About' />
  </View>

    )
   
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    fontSize: 22,
    textAlign: 'center'
  },
  container: {
    paddingTop: 60
  }
})
export default Home;
//module.exports =Home;
