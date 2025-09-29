import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import {styles} from './DemoDetailStyles';
import Header from './component/Header';
import DetailItem from './component/DetailItem';
import {RFValue} from 'react-native-responsive-fontsize';
import { Images, Languages } from '../../common';

const DemoCompletedScreen = props => {
  const {auditDetails} = props.route.params;
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
  getTitle = stage => {
    switch (stage) {
      case 2:
        return Languages.Grooming_Check;
        break;
      case 3:
        return Languages.Product_Picture;
        break;
      case 4:
        return Languages.Client_Place_Picture;
        break;
      case 6:
        return Languages.Before_Picture_of_Model;
        break;
      case 7:
        return Languages.Steps_of_Procedure;
        break;
      case 8:
        return  Languages.After_Picture_of_Model;
        break;
      case 9:
        return  Languages.Service_and_product_detail;
        break;
      case 10:
        return  Languages.Participants;
        break;
      case 11:
        return Languages.Feedback_Generation;
        break;
      default:
        break;
    }
  };
  const serviceItem = ({item, index}) => {
    return (
      <View>
        <Text style={[styles.header, {marginTop: 20}]}>
          Product {index + 1}
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 10,
          }}>
          <View
            style={{
              backgroundColor: '#00AEEF1A',
              padding: 10,
              borderRadius: 10,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
            <Text style={{color: 'grey', fontWeight: '700'}}>
              {item.name} {item.code}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              marginTop: 10,
              borderRadius: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#E6F2E680',
            }}>
            <View style={{width: '45%'}}>
              <Text
                style={{
                  color: '#666687',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {Languages.Demo_Capacity}
              </Text>
            </View>
            <View
              style={{
                width: '20%',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                height: 40,
                backgroundColor: '#81BE8333',
                borderWidth: 1,
                borderColor: '#81BE8333',
              }}>
              <Text style={{textAlign: 'center'}}>{item.qtyConsumed}</Text>
            </View>
            <View
              style={{
                width: '20%',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                height: 40,
                backgroundColor: '#81BE8333',
                borderWidth: 1,
                borderColor: '#81BE8333',
              }}>
              <Text>{item.unit}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const participantItems = ({item, index}) => {
    return (
      <View>
        <Text style={[styles.header, {marginTop: 10}]}>
          Participants {index + 1}
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 10,
          }}>
          <View
            style={{
              borderRadius: 10,
            }}>
            <View
              style={{
                width: '100%',
                borderRadius: 5,
                padding: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                height: 43,
                backgroundColor: '#00AEEF1A',
                borderWidth: 1,
                borderColor: '#00AEEF1A',
              }}>
              <Text
                style={{
                  color: '#666687',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {item.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              // padding: 10,
              marginTop: 10,
              borderRadius: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '48%',
                borderRadius: 5,

                padding: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                height: 43,
                backgroundColor: '#E6F2E680',
                borderWidth: 1,
                borderColor: '#E6F2E680',
              }}>
              <Text
                style={{
                  color: '#666687',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {item.mobileNumber}
              </Text>
            </View>
            <View
              style={{
                width: '48%',
                borderRadius: 5,

                padding: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                height: 43,
                backgroundColor: '#E6F2E680',
                borderWidth: 1,
                borderColor: '#E6F2E680',
              }}>
              <Text
                style={{
                  color: '#666687',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {item.role}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const renderItem = ({item}) =>
    item.stage === 1 || item.stage === 12 ? (
      <View style={styles.parentContainer}>
        <Header
          title={item.stage === 1 ? 'Check In' : 'Check Out'}
          stepNo={item.stage}
        />
        <View style={{marginTop: 10}}>
          <View
            style={{
              backgroundColor: '#E6F2E6',
              padding: 10,
              borderRadius: 5,
            }}>
            <Text style={styles.header}>{item.auditData.clientName}</Text>
          </View>
          <View style={styles.detailChildContainer}>
            <View
              style={{
                flexDirection: 'row',
                height: 'auto',
                flexWrap: 'wrap',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View style={{width: '5%', alignItems: 'flex-start'}}>
                <Image
                  source={Images.LocationGrey}
                  resizeMode="contain"
                  style={styles.locationImage}
                />
              </View>

              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  marginLeft: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '100%',
                    height: 'auto',
                  }}>
                  <Text style={styles.addressText}>
                    {item.auditData.trainerLocation}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#E6F2E680',
                borderRadius: 5,
                paddingLeft: 10,
              }}>
              <DetailItem
                image={'Maticon-gps'}
                title={
                  item.auditData.latitude + ', ' + item.auditData.longitude
                }
                isheader={false}
              />
            </View>
            {item.stage === 12 && (
              <View>
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
                    {item.auditData.notes}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    ) : item.stage == 5 ? (
      <View style={styles.parentContainer}>
        <Header title={Languages.Theory_explained} stepNo={item.stage} />
        <View style={{marginTop: 10}}>
          <View style={styles.textinput}>
            <Text style={styles.textinput_txt}>
              {item.auditData.theoryExplained ? Languages.Yes : Languages.No}
            </Text>
          </View>
        </View>
      </View>
    ) : item.stage === 11 ? (
      <View/>
    ) : item.stage === 9 ? (
      <View style={styles.parentContainer}>
        <Header title={getTitle(item.stage)} stepNo={item.stage} />
        <Text style={styles.header}>{Languages.Given_Service}</Text>
        <View>
        <View style={styles.additionalTextinput}>
                {item.auditData.givenService&&
                item.auditData.givenService.map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: '#00AEEF1A',
                      marginLeft: 10,
                      padding: 5,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.name}
                  </Text>
                ))}
              </View>
        </View>
        <Text style={styles.header}>{Languages.No_of_Products}</Text>
        <View>
          <View style={styles.textinput}>
            <Text style={styles.textinput_txt}>
              {item.auditData.productsCount}
            </Text>
          </View>
        </View>
        <View>
          <FlatList
            nestedScrollEnabled={true}
            data={item.auditData.products}
            renderItem={serviceItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        {item.auditData.additionalServices&& (
          <View>
            <Text style={styles.header}>{Languages.Additional_Service_Provided}</Text>
            <View>
              <View style={styles.additionalTextinput}>
                {item.auditData.additionalServices&&
                item.auditData.additionalServices.map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: '#00AEEF1A',
                      marginLeft: 10,
                      padding: 5,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.name}
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.header}>{Languages.No_of_Products}</Text>
            <View>
              <View style={styles.textinput}>
                <Text style={styles.textinput_txt}>
                  {item.auditData.additionalProductsCount}
                </Text>
              </View>
            </View>
            <View>
              <FlatList
                nestedScrollEnabled={true}
                data={item.auditData.additionalProducts}
                renderItem={serviceItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        )}
      </View>
    ) : item.stage === 10 ? (
      <View style={styles.parentContainer}>
        <Header title={getTitle(item.stage)} stepNo={item.stage} />
        <Text style={[styles.header, {marginTop: 10}]}>{Languages.No_of_Participants}</Text>
        <View>
          <View style={styles.textinput}>
            <Text style={styles.textinput_txt}>
              {item.auditData.participantsCount}
            </Text>
          </View>
        </View>
        <View>
          <FlatList
            nestedScrollEnabled={true}
            data={item.auditData.participants}
            renderItem={participantItems}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    ) : (
      <View style={styles.parentContainer}>
        <Header title={getTitle(item.stage)} stepNo={item.stage} />
        <View style={{marginTop: 10}}>
          <FlatList
            horizontal
            nestedScrollEnabled={true}
            data={item.auditData.fileNames}
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
            <Text style={styles.textinput_txt}>{item.auditData.notes}</Text>
          </View>
        </View>
      </View>
    );
  const renderHeader = () => (
    <CustomAppBar
      title={auditDetails[0].demo.generatedDemoId}
      showImage={true}
    />
  );
  return (
    <SafeAreaView>
      <View style={styles.viewContainer}>
        <View style={styles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            data={auditDetails}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default DemoCompletedScreen;
