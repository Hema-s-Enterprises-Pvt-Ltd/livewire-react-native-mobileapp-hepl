import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert, SafeAreaView, Platform, PermissionsAndroid, ActivityIndicator, View } from 'react-native';
//import PDFView from 'react-native-view-pdf';
import GlobalStyles from '../core/GlobalStyles';
import {WebView} from 'react-native-webview';
import axios from 'react-native-axios';
import { Appbar,Provider,Menu } from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import {Languages, Constants, Colors} from '../common'
import crashlytics from '@react-native-firebase/crashlytics';

const PDFViewer = ({route, navigation}) => {
  const {uri} = route.params;
  const [fileType, setFileType] = useState();
  const [menuVisible,setMenuVisible] = useState(false);
  const [docFilePath, setFilePath] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Force reload the WebView when coming back to the screen
    const unsubscribe = navigation.addListener('focus', () => {
      setKey((prevKey) => prevKey + 1); // Update the key to force re-render
    });

    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('pdfViewer mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('pdfViewer unmounted');
    };
  }, []);
  useEffect(() => {
    getMimeTypeFromUrl(uri).then(fileType => {
      setFileType(fileType);
    });
  });

  const requestPermission = (uri, fileName) => {
    handleDownload();
    if (Platform.OS === 'android' && Platform.Version < 33) {
      PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ])
      .then(result=>{
          if(result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'){
            //downloadPDF(uri, fileName)
          }else{
            Alert.alert(Languages.PermissionDenied, Languages.StoragePermission);
          }
      })
    }else {

      downloadPDF(uri, fileName)
    }
  }



  const downloadPDF = async (uri, fileName) => {
    try {
    const url = uri;
    const dirs = RNFetchBlob.fs.dirs;
    const dtSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configAndr = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mime: 'application/pdf',
      mediaScannable: true,
      title: fileName + '.pdf',
      path: `${dtSave}/${fileName}.pdf`,
    };

    const configIOS = {
        fileCache: true,
        title: fileName + '.pdf',
        path: `${dtSave}/${fileName}.pdf`,
        appendExt: 'pdf',
    };

    const configOption = Platform.select({
        ios: configIOS,
        android: configAndr,
    });

    RNFetchBlob.config(configOption)
      .fetch(Constants.getMethod, url, {
          // Insert any headers here if needed
      })
      .then((res) => {
        setFilePath(res.path());
        if (Platform.OS === 'ios') {
          //RNFetchBlob.fs.writeFile(configIOS.path, res.data, 'base64');
          // No need to write the file again, it's already downloaded
          //setFilePath(res.path());
          RNFetchBlob.ios.previewDocument(res.path());
        } else if (Platform.OS === 'android') {
            Alert.alert('Success', Languages.DownloadComplete);
        }
      })
      .catch((e) => {
        
      });
    } catch (error) {
      Alert.alert(Languages.Error, `${Languages.FailedDownload}: ${error.message}`);
    }
  };

  const getMimeTypeFromUrl = async url => {
    try {
      const response = await axios(url, {method: Constants.headMethod});
      const contentType = response.headers.get('content-type');

      if (contentType) {
        if (contentType.includes(Constants.docPDF)) {
          return Constants.filePDF;
        } else if (contentType.includes(Constants.docWord)) {
          return Constants.fileDoc;
        } else {
          return 'Unknown';
        }
      }
    } catch (error) {
      Alert.alert(Languages.ErrorFetching, error.message);
    }
    return 'Unknown';
  };

  const handleLoadStart = () => {
    setIsLoading(true) 
  };

  const handleLoadEnd = () => {
    setIsLoading(false)
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);
  const handleDownload = () => setMenuVisible(!menuVisible);
  const handleError = error => {
    Alert.alert(Languages.ErrorLoadPage, error.message);
  };
 
  return (
    <>
      <Provider>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title={route?.params?.name ?? Languages.DocmentViewer}
          />
        </Appbar.Header>
        <SafeAreaView style={styles.container}>
          {/* {fileType === Constants.filePDF ? ( */}
          {/* <WebView
         style={{width: Constants.width}}
         source={{
          uri: `${Constants.googleDocUrl}${encodeURIComponent(
            uri,
          )}`
         }}
         onLoadStart={handleLoadStart}
         onLoadEnd={handleLoadEnd}
         onError={handleError}
       /> */}
          <WebView
            key={key}
            style={{width: Constants.width}}
            source={{
              uri: `${Constants.googleDocUrl}${encodeURIComponent(uri)}`,
            }}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode="always"
            onHttpError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.warn('WebView received an HTTP error: ', nativeEvent);
              Alert.alert('An error in viewing document');
            }}
            onShouldStartLoadWithRequest={request => {
              console.log('Request URL:', request.url);
              return true;
            }}
          />
          {/* ) : (
        <WebView
          style={{width: Constants.width}}
          source={{
            uri: `${Constants.googleDocUrl}${encodeURIComponent(
              uri,
            )}`,
          }}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      )} */}
          {isLoading == true && (
            <View style={styles.loader}>
              <ActivityIndicator size={'large'} color={Colors.loaderColor} />
            </View>
          )}
        </SafeAreaView>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colorSet.app_bg,
  },
  pdf: {
    flex: 1,
    width: Constants.width,
    height: Constants.height,
  },
  loader: {
    height: Constants.height - 50,
    width: Constants.width,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.loaderBackground
},
});

export default PDFViewer;
