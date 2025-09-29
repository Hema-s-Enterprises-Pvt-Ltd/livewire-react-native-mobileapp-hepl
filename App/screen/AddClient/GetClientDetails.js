import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Pressable,SafeAreaView 
} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import {styles} from './AddClientStyles';
import Input from '../../component/Input';
import CustomButton from '../../component/CustomButton';
import PicUploadModal from './component/PicUploadModal';
import ImageCropPicker from 'react-native-image-crop-picker';
import MultiSelect from '../../component/CustomMultiSelect/MultiSelect';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Images } from '../../common';

const GetClientDetails = props => {
  const [modalvisible, setmodalvisible] = useState(false);
  const [clientLogoImage, setclientLogoImage] = useState('');
  const [saloonImage, setsaloonImage] = useState('');
  const [imageSelected, setImageSelected] = useState('');
  const [productSelected, setproductSelected] = useState([]);
  const data = [
    {label: 'Item 1', value: '1'},
    {label: 'Item 2', value: '2'},
    {label: 'Item 3', value: '3'},
  ];
  const Modalopen = type => {
    setmodalvisible(!modalvisible);
    setImageSelected(type);
  };
  const launchcamera = async () => {
    setmodalvisible(false);
    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Example App Camera Permission',
          message: 'Example App needs access to your camera',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImageCropPicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        }).then(image => {
          if (imageSelected == 'Client_Logo') {
            setclientLogoImage(image.path);
          } else {
            setsaloonImage(image.path);
          }
        });
      } else {
        // Permission Denied
        alert('CAMERA Permission Denied');
      }
    } else {
    }
  };
  const opengallery = () => {
    setmodalvisible(false);
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      if (imageSelected == 'Client_Logo') {
        setclientLogoImage(image.path);
      } else {
        setsaloonImage(image.path);
      }
    });
  };
  const renderItem = item => {
    return (
      <View style={styles.item}>
       <View style={{width:30,height:30,borderRadius:40,backgroundColor:'#00AEEF1A',alignItems:'center',marginRight:10,justifyContent:'center'}}>
       <Image source={Images.Shampoo} style={{width:15,height:15,resizeMode:'contain'}}/>
       </View>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView>
          <ScrollView
      style={styles.viewContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <CustomAppBar title="Add Client" showImage={true} navigation={props.navigation}/>
        <View style={{height: 20}} />
        <Text style={styles.textinput_txt}>Client Name</Text>
        <Input
          placeholder="Enter name"
          onChangeText={text => {}}
          Ref={input => {}}
          keyboardType="name"
          maxLength={10}
        />
        <View style={{height: 10}} />
        <Text style={styles.textinput_txt}>Client Logo</Text>
        <View style={styles.textinput}>
          <Text>Attach Image</Text>
          <TouchableOpacity onPress={() => Modalopen('Client_Logo')}>
            <Image
              source={Images.PaperClip}
              style={{
                width: 15,
                height: 15,
                resizeMode: 'contain',
                marginRight: 10,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{height: 10}} />
        <Text style={styles.textinput_txt}>Location</Text>
        <Input
          placeholder="Enter Location"
          onChangeText={text => {}}
          Ref={input => {}}
          keyboardType="name"
          maxLength={10}
        />
        <View style={{height: 10}} />
        <Text style={styles.textinput_txt}>POC</Text>
        <Input
          placeholder="Enter POC"
          onChangeText={text => {}}
          Ref={input => {}}
          keyboardType="name"
          maxLength={10}
        />
        <View style={{height: 10}} />
        <Text style={styles.textinput_txt}>POC Mobile Number</Text>
        <Input
          placeholder="Enter"
          onChangeText={text => {}}
          Ref={input => {}}
          keyboardType="name"
          maxLength={10}
        />
        <Text style={styles.textinput_txt}>Target Product</Text>
        <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Select here"
                value={productSelected}
                search
                searchPlaceholder="Search..."
                onChange={item => {
                  setproductSelected(item);
                }}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                  <Pressable onPress={() => unSelect && unSelect(item)}>
                    <View style={styles.selectedStyle}>
                      <Text style={styles.textSelectedStyle}>{item.label}</Text>
                      <Icon color="black" name="close" size={14} />
                    </View>
                  </Pressable>
                )}
              />
        <Text style={styles.textinput_txt}>Upload Saloon Image</Text>
        <View style={styles.textinput}>
          <Text>Attach Image</Text>
          <TouchableOpacity onPress={() => Modalopen('Saloon_Image')}>
            <Image
              source={Images.PaperClip}
              style={{
                width: 15,
                height: 15,
                resizeMode: 'contain',
                marginRight: 10,
              }}
            />
          </TouchableOpacity>
        </View>
        <CustomButton text="Add Client" />
        <PicUploadModal
          Modalvisible={modalvisible}
          modalswipe={() => Modalopen(imageSelected)}
          close_icon_click={() => {
            setmodalvisible(false);
          }}
          btn_one_press={() => launchcamera()}
          btn_two_press={() => opengallery()}
        />
      </View>
    </ScrollView>
    </SafeAreaView> 
  
  );
};
export default GetClientDetails;
