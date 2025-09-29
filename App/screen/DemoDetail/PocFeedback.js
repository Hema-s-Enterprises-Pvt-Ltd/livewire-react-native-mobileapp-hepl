import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import GlobalStyles from '../../core/GlobalStyles';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import TwoRadioButton from './component/TwoRadioButton';
import MultipleRadioButton from './component/MultipleRadioButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Images, Languages } from '../../common';

const PocFeedback = props => {
  const pocDetail=props.pocDetails;
  const SubrenderItem = ({item}) => (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 10,
      }}>
      <Image
        source={{uri: item}}
        resizeMode="contain"
        style={{width: 100, height: 100, resizeMode: 'stretch'}}
      />
    </View>
  );


const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5]; // Total number of stars

  return (
    <View style={{flexDirection:'row',margin:10,justifyContent:'space-around'}}>
      {stars.map((star) => (
        <Icon
          key={star}
          name={rating >= star ? 'star' : 'star-o'}
          size={30}
          color={rating >= star ? '#ffd700' : '#ccc'}
        />
      ))}
    </View>
  );
};
  return (
    <ScrollView style={{width: '100%', height: '90%'}}>
      {
        pocDetail?
        <View>
          <View style={styles.parentContainer}>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={styles.header}>{Languages.Product_Images}</Text>
        </View>
        <View style={{marginTop: 10}}>
          <FlatList
            horizontal
            nestedScrollEnabled={true}
            data={props.details[2].auditData.fileNames}
            renderItem={SubrenderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <View style={styles.parentContainer}>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={styles.header}>{Languages.Before_Picture_of_Model}</Text>
        </View>
        <View style={{marginTop: 10}}>
          <FlatList
            horizontal
            nestedScrollEnabled={true}
            data={props.details[5].auditData.fileNames}
            renderItem={SubrenderItem}
            keyExtractor={(item, index) => index.toString()}
          />

          <Text
            style={{
              fontSize: RFValue(14),
              fontWeight: '500',
              textAlign: 'left',
              color: '#454F5B',
              marginLeft: 10,
            }}>
            Notes
          </Text>
          <View style={styles.textinput}>
            <Text style={styles.textinput_txt}>
              {props.details[5].auditData.notes}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.parentContainer}>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={styles.header}>{Languages.After_Picture_of_Model}</Text>
        </View>
        <View style={{marginTop: 10}}>
          <FlatList
            horizontal
            nestedScrollEnabled={true}
            data={props.details[7].auditData.fileNames}
            renderItem={SubrenderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text
            style={{
              fontSize: RFValue(14),
              fontWeight: '500',
              textAlign: 'left',
              color: '#454F5B',
              marginLeft: 10,
            }}>
            {Languages.Notes}
          </Text>
          <View style={styles.textinput}>
            <Text style={styles.textinput_txt}>
              {props.details[7].auditData.notes}
            </Text>
          </View>
        </View>
      </View>
      <TwoRadioButton
        questionNumber={'1'}
        title={Languages.Question1}
        selectedValue={pocDetail.question1}
        comments={pocDetail.question1Comment}
      />
      <TwoRadioButton
        questionNumber={'2'}
        title={Languages.Question2}
        selectedValue={pocDetail.question2}
        comments={pocDetail.question2Comment}
      />
      <TwoRadioButton
        questionNumber={'3'}
        title={Languages.Question3}
        selectedValue={pocDetail.question3}
        comments={pocDetail.question3Comment}
      />
      <TwoRadioButton
        questionNumber={'4'}
        title={Languages.Question4}
        selectedValue={pocDetail.question4}
        comments={pocDetail.question4Comment}
      />
      <MultipleRadioButton
       questionNumber={'5'}
       title={Languages.Question5}
       selectedValue={pocDetail.question5}
       options={["Very Well","Well","Neutral","Poorly","Very Poorly"]}
      />
       <MultipleRadioButton
       questionNumber={'6'}
       title={Languages.Question6}
       selectedValue={pocDetail.question6}
       options={["Excellent","Very Good","Good","Fair","Poor"]}
      />
       <MultipleRadioButton
       questionNumber={'7'}
       title={Languages.Question7}
       selectedValue={pocDetail.question7}
       options={["Very Likely","Likely","Neutral","Unlikely","Very Unlikely"]}
      />
        <MultipleRadioButton
       questionNumber={'8'}
       title={Languages.Question8}
       selectedValue={pocDetail.question8}
       options={["Excellent","Very Good","Good","Fair","Poor"]}
      />
        <View style={{margin:10}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{
                fontSize:14,
                fontWeight: 'bold',
                textAlign: 'left',
                //  marginTop: 10,
                color: 'black',
              }}>
                9.
            </Text>
              <Text style={{
                fontSize:14,
                fontWeight: 'bold',
                textAlign: 'left',
                //  marginTop: 10,
                paddingLeft:5,
                color: 'black',
              }}>{Languages.Question9}</Text> 
          </View>
          <StarRating rating={pocDetail.ratings} />
        </View>
        </View>
        :
        <View style={{backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
         <Image source={Images.DecisionMakerStar} style={{width:"60%",height:300}}/>
       <Text style={{textAlign:'center',margin:10,fontSize:14,fontWeight:"500",color:"#919EAB"}}>
       Looks like POC doesn’t submitted his {'\n'}feedback yet
       </Text>
        </View>
      }
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: GlobalStyles.colorSet.white,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    paddingLeft: 10,
    color: 'black',
  },
  subHeader: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginTop: 5,
    marginLeft: 10,
  },
  stepText: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
    textAlign: 'center',
    color: GlobalStyles.colorSet.Grey,
  },
  addressText: {
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'left',
    color: '#666687',
  },
  Image: {
    borderWidth: 2,
    borderColor: 'white',
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 2,
  },
  textinput: {
    backgroundColor: 'white',
    borderColor: '#E4E5E73D',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
  },
  textinput_txt: {
    fontSize: RFValue(14),
    fontWeight: 'semibold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
  },
});
export default PocFeedback;
