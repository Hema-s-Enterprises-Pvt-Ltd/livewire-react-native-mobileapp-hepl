import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { RFPercentage } from 'react-native-responsive-fontsize';
import GlobalStyles from '../../../core/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ion from 'react-native-vector-icons/Ionicons';

const PicUploadModal = (props) => {
    const {
        Modalvisible,
        modalswipe,
        btn_one_press,
        btn_two_press
    } = props
    return (
        <Modal
            isVisible={Modalvisible}
            style={{ flex: 1, justifyContent:'flex-end',margin:0}}
            onSwipeComplete={modalswipe}
            swipeDirection={['left', 'right', 'down', 'up']} >
            <View style={{  backgroundColor: '#f2f3f9',borderTopLeftRadius:5,borderTopRightRadius:5}} >
                <View style={{ marginLeft: 10, marginRight: 10,paddingTop: 10,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{ fontSize: RFPercentage(2.5), color: 'black',fontWeight:"600" }}>Upload your Image </Text>
                    <TouchableOpacity onPress={props.close_icon_click}>
                    <Icon name="close" size={20} color={GlobalStyles.colorSet.Grey}/>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row',marginLeft: 5, marginRight: 5, marginVertical: 10}}>
                   <View style={{flexDirection:"column"}}>
                   <TouchableOpacity onPress={btn_one_press}>
                        <View style={styles.button}>
                        <Ion name="camera-outline" size={20} color={GlobalStyles.colorSet.white}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center',color:GlobalStyles.colorSet.Grey}}>Camera</Text>
                   </View>
                  <View style={{flexDirection:'column'}}>
                  <TouchableOpacity onPress={btn_two_press}>
                        <View style={styles.button}>
                        <Icon name="image" size={20} color={GlobalStyles.colorSet.white}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center',color:GlobalStyles.colorSet.Grey}}>Gallery</Text>
                  </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    button: {
        width:50,
        height: 50,
        backgroundColor:GlobalStyles.colorSet.orange,
        borderColor:GlobalStyles.colorSet.orange,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        margin:10,
        marginHorizontal:20
    }
});

export default PicUploadModal;