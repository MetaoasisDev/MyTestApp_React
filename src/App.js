import React ,{Fragment , useEffect }from "react";
import logo from "./logo.svg";
import "./App.css";
import { Unity, useUnityContext } from "react-unity-webgl";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { View, Button, Vibration } from 'react-native';
import { TonConnectUI } from '@tonconnect/ui-react';

const isDev = true;
const liveVersion = "banana-v19";
const devVersion = "banana-v19" /*"Payment2"*/;

const liveUrl = "https://d3c9jx2zokz1rn.cloudfront.net/web-build";
const devUrl = "https://lys-test.s3.ap-northeast-2.amazonaws.com";

const connectorUi = new TonConnectUI({
  manifestUrl: 'https://lys-test.s3.ap-northeast-2.amazonaws.com/tonconnect-manifest.json'
});

const App = () => {

  window.Telegram.WebApp.expand();

  const currentUrl = `${(isDev ? devUrl : liveUrl)}/${(isDev ? devVersion : liveVersion)}`;
  const root = document.querySelector("#root");

  const { unityProvider ,sendMessage ,addEventListener ,removeEventListener } = useUnityContext({
    loaderUrl: `${currentUrl}/Build.loader.js`,
    dataUrl: `${currentUrl}/Build.data`,
    frameworkUrl: `${currentUrl}/Build.framework.js`,
    codeUrl: `${currentUrl}/Build.wasm`,
  });

  const TestUnityMessage = () => {
    sendMessage('SendReactManager' , 'ReciveUnity' , document.location.pathname)
  }


  const handleVibrate = () => {
    Vibration.vibrate(100);
  };

  const OpenUrl = () => {
    window.Telegram.WebApp.openLink("https://x.com/MetaOasisVR");
  };
  const OpenUrl2 = () => {
    window.Telegram.WebApp.openLink("https://x.com/Dicaprio_Eth");
  };
  const OpenUrl3 = () => {
    window.Telegram.WebApp.openLink("https://t.me/METAOASIS_CHAT");
  };
  const OpenUrl4 = () => {
    window.Telegram.WebApp.openLink("https://discord.com/invite/metaoasisvr");
  };
  const OpenUrl5 = () => {
    window.Telegram.WebApp.openLink("https://www.meoasis.com/");
  };

  const Shop_CoinParty =(str)=>{
    openInvoiceAndPayment(str, 2);
  };

  const Shop_Assistant = (str) =>{
    openInvoiceAndPayment(str, 3);
  };

  const Shop_Manager = (str) =>{
    openInvoiceAndPayment(str, 4);
  };

  const Shop_DieselTechnician = (str) =>{
    openInvoiceAndPayment(str, 5);
  };

  const Shop_HarvestHelp = (str) =>{
    openInvoiceAndPayment(str, 6);
  };

  const Shop_Farmer = (str) =>{
    openInvoiceAndPayment(str, 7);
  };

  function openInvoiceAndPayment(url, itemNum) {
    window.Telegram.WebApp.openInvoice(url, event => {
      if (event === 'cancelled' || event === 'failed') {
        sendMessage('SendReactManager', 'ReciveShopItem', -1);
      }

      if (event === 'paid') {
        sendMessage('SendReactManager', 'ReciveShopItem', itemNum);
      }
    });
  }

  const WalletConnect = () => {
    GetWaleltConnect();
  };

  async function GetWaleltConnect() {
    if(connectorUi.connected){
      connectorUi.disconnect();
    }

    await connectorUi.openModal();

    const unsubscribe = connectorUi.onModalStateChange(
        state => {

          sendMessage('SendReactManager' , 'ReciveWalletAddr' ,connectorUi.account.address);
          connectorUi.closeModal();
          unsubscribe();
        }
    );

  }



  const handleCopyClipBoard = (text_s) => {
    //   navigator.clipboard.writeText(text_s);
    //  document.execCommand('copy', true, text_s);

    const element = document.createElement('textarea');
    element.value = text_s;
    element.setAttribute('readonly', '');
    element.style.position = 'fixed';
    element.style.opacity = '0';
    document.body.appendChild(element);
    element.select();
    const copyValue = document.execCommand('copy');
    document.body.removeChild(element);

  };


  useEffect( () => {
    addEventListener('TakeTokenFromReact',TestUnityMessage);
    addEventListener('MobileVibrate',handleVibrate);
    addEventListener('handleCopyClipBoard',handleCopyClipBoard);
    addEventListener('OpenUrl',OpenUrl);
    addEventListener('OpenUrl2',OpenUrl2);
    addEventListener('OpenUrl3',OpenUrl3);
    addEventListener('OpenUrl4',OpenUrl4);
    addEventListener('OpenUrl5',OpenUrl5);
    addEventListener('WalletConnect',WalletConnect);

    addEventListener('Shop_Assistant',Shop_Assistant);
    addEventListener('Shop_Manager',Shop_Manager);
    addEventListener('Shop_DieselTechnician',Shop_DieselTechnician);
    addEventListener('Shop_HarvestHelp',Shop_HarvestHelp);
    addEventListener('Shop_Farmer',Shop_Farmer);
    addEventListener('Shop_CoinParty',Shop_CoinParty);

    return () => {
      removeEventListener('TakeTokenFromReact',TestUnityMessage)
      removeEventListener('MobileVibrate',handleVibrate)
      removeEventListener('handleCopyClipBoard',handleCopyClipBoard)
      removeEventListener('OpenUrl',OpenUrl)
      removeEventListener('OpenUrl2',OpenUrl2)
      removeEventListener('OpenUrl3',OpenUrl3)
      removeEventListener('OpenUrl4',OpenUrl4)
      removeEventListener('OpenUrl5',OpenUrl5)
      removeEventListener('WalletConnect',WalletConnect)

      removeEventListener('Shop_Assistant',Shop_Assistant)
      removeEventListener('Shop_Manager',Shop_Manager)
      removeEventListener('Shop_DieselTechnician',Shop_DieselTechnician)
      removeEventListener('Shop_HarvestHelp',Shop_HarvestHelp)
      removeEventListener('Shop_Farmer',Shop_Farmer)
      removeEventListener('Shop_CoinParty',Shop_CoinParty)

    }

  },[addEventListener,removeEventListener,TestUnityMessage,handleCopyClipBoard,OpenUrl,WalletConnect,
    Shop_Assistant,Shop_Manager,Shop_DieselTechnician,Shop_HarvestHelp,Shop_Farmer,Shop_CoinParty,
  ])

  return (

      <div className="App">

        <Unity
            devicePixelRatio={2}
            style={{
              width: window.innerWidth || document.body.clientWidth,
              height: window.innerHeight || document.body.clientHeight ,
              justifySelf: 'center',
              alignSelf: 'center',

            }} unityProvider={unityProvider}/>

      </div>

  ) ;

};

export default App; 