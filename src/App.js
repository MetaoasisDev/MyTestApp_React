import React ,{Fragment , useEffect }from "react";
import logo from "./logo.svg";
import "./App.css";
import { Unity, useUnityContext } from "react-unity-webgl";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { View, Button, Vibration } from 'react-native';
import { TonConnect} from '@tonconnect/sdk';
import { TonConnectUI } from '@tonconnect/ui-react';


const connectorUi = new TonConnectUI({
  manifestUrl: 'https://lys-test.s3.ap-northeast-2.amazonaws.com/tonconnect-manifest.json'
});

export const App = () => {
  window.Telegram.WebView.initParams = 7.7;

  window.Telegram.WebApp.expand();

  const root = document.querySelector("#root");
 

  const { unityProvider ,sendMessage ,addEventListener ,removeEventListener } = useUnityContext({
    loaderUrl: "https://lys-test.s3.ap-northeast-2.amazonaws.com/Version37/Build.loader.js",
    dataUrl: "https://lys-test.s3.ap-northeast-2.amazonaws.com/Version37/Build.data",
    frameworkUrl: "https://lys-test.s3.ap-northeast-2.amazonaws.com/Version37/Build.framework.js",
    codeUrl: "https://lys-test.s3.ap-northeast-2.amazonaws.com/Version37/Build.wasm",
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
    generatePayment("5000902684:AAGJqOsbMv7F5IPVexyVAAjVcMwV1y2yeTA", true, "테스트 결제용 아이템 이름", "테스트 결제용 아이템 설명입니다.", 10, `{"buyItemId":1}`);
  };

  /**
   * Generate 'Telegram Stars' invoice link using Telegram API and send and receive invoice data to Telegram API Server
   * @param {string} token Telegram Bot Token
   * @param {boolean} isTest Is Telegram Test Server?
   * @param {string} productTitle Item Title
   * @param {string} productDescription Item Description
   * @param {number} price  Item Price (Currency: XTR(Telegram Stars))
   * @param {JSON} payload Item payload data (send to Telegram Bot with payload data)
   */
  function generatePayment(token, isTest, productTitle, productDescription, price, payload) {
    var urlParams = {
      "title": productTitle,
      "description": productDescription,
      "price": price,
      "payload": payload
    };

    window.Telegram.WebApp.invokeCustomMethod('generatePaymentUrl', JSON.stringify(urlParams), event => {
      console.log("봇 콜백 이벤트 실행됨: " + JSON.stringify(event));
    });

    /* var formatUrl = `https://api.telegram.org/bot${token}`;

    if (isTest) {
        formatUrl = formatUrl + "/test";
    }

    formatUrl = formatUrl + "/createInvoiceLink"
    formatUrl = formatUrl + `?title=${productTitle}`;
    formatUrl = formatUrl + `&description=${productDescription}`;
    formatUrl = formatUrl + `&payload=${payload}`;
    formatUrl = formatUrl + `&currency=XTR`;

    const labeledPrices = [{"label":productTitle, "amount": price}];
    formatUrl = formatUrl + `&prices=${JSON.stringify(labeledPrices)}`;

    fetch(formatUrl)
    .then(response => response.json())
    .then(data => {
      const result = data.result;
      window.Telegram.WebApp.openInvoice(result, (event) => {
        if (event.state !== 'paid') {
          // TODO 결제가 완료되지 않았을 때 이벤트
        }
      });

      window.Telegram.WebApp.onEvent('invoiceClosed', event => {
        // TODO 결제가 완료되었을 때 이벤트
        //console.log("event: " + JSON.stringify(event));
      });
    })
    .catch(error => {
      console.log(`An error occurred while purchasing in-game items: ${JSON.stringify(error)}`);
    }); */
  }

  async function GetWalletAddress() {
    await connectorUi.openModal();
    connectorUi.closeModal();

    const currentState = connectorUi.modalState;

    const unsubscribe = connectorUi.onModalStateChange(
      state => {
        alert(`[Modal (${currentState})]\nWallet Connected!\n- isConnected: ${connectorUi.connected}\n- wallet: ${connectorUi.wallet.provider}\n- account: ${connectorUi.account.address}\n- ${connectorUi.account.publicKey}`);
      }
    );

    unsubscribe();
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
    return () => {
      removeEventListener('TakeTokenFromReact',TestUnityMessage)
      removeEventListener('MobileVibrate',handleVibrate)
      removeEventListener('handleCopyClipBoard',handleCopyClipBoard)
      removeEventListener('OpenUrl',OpenUrl)
      removeEventListener('OpenUrl2',OpenUrl2)
      removeEventListener('OpenUrl3',OpenUrl3)
      removeEventListener('OpenUrl4',OpenUrl4)
      removeEventListener('OpenUrl5',OpenUrl5)
    }

  },[addEventListener,removeEventListener,TestUnityMessage,handleCopyClipBoard,OpenUrl])

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