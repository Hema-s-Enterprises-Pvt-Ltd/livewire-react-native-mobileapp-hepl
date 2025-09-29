import {Dimensions, Platform} from 'react-native'

const {width, height} = Dimensions.get('window')

const Constants = {
    width: width,
    height: height,
    fontFamily: "Satoshi-Regular",
    fontHeader: "Satoshi-Bold",
    fontFamilyBold: "Satoshi-Bold",

    getMethod: 'GET',
    headMethod: 'HEAD',

    docPDF: 'pdf',
    docWord: 'word',
    filePDF: 'PDF',
    fileDoc: 'DOC/DOCX',

    firebaseConfig: {
        apiKey: Platform.OS == 'ios' ? "AIzaSyDgCntZUXFCnM6ATieYk4CtV1l3OpImBsc" : "AIzaSyBWR5N0vsD_HU6UYyLkU72uco1E4eknCNY",
        authDomain: "livewire-7bf7f.firebaseapp.com",
        projectId: "livewire-7bf7f",
        storageBucket: "livewire-7bf7f.appspot.com",
        messagingSenderId: "1008678627699",
        appId: "1:1008678627699:ios:7357c1aeeed1efb6667d06"
    },
    GoogleMapAPI: 'AIzaSyBoKfU1Zy5-dHw0ngjrdcDAJ6wRK6kH95o',
    googleDocUrl: 'https://docs.google.com/gview?embedded=true&url='
}

export default Constants;
