import React ,{Fragment , useEffect }from "react";
import logo from "./logo.svg";
import "./App.css";
import { Unity, useUnityContext } from "react-unity-webgl";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { View, Button, Vibration } from 'react-native';
import { TonConnectUI } from '@tonconnect/ui-react';
import {OKXUniversalConnectUI, THEME} from "@okxconnect/ui";
import {OKXUniversalProvider} from "@okxconnect/universal-provider";

const isDev = true;
const liveVersion = "banana-v19";
const devVersion = "Payment2";

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
    let initData = window.Telegram.WebApp.initDataUnsafe;
    const userData = `/${initData.user.id}/${initData.user.username}/undefined/${initData.start_param}`;

    console.log(userData);
    console.log(document.location.search);

    sendMessage('SendReactManager' , 'ReciveUnity' , userData);
  }

  const okxProvider = OKXUniversalProvider.init({
    dappMetaData: {
      name: "BlockEducation",
      icon: "https://golden-goblin.s3.ap-northeast-2.amazonaws.com/Icon.png"
    },
    actionsConfiguration: {
      returnStrategy: 'tg://resolve',
      modals: 'all',
      tmaReturnUrl: 'back'
    },
    language: 'en_US',
    uiPreferences: {
      theme: THEME.LIGHT
    },
    restoreConnection: true,
  });

  const okxUi = OKXUniversalConnectUI.init({
    dappMetaData: {
      name: "BlockEducation",
      icon: "https://golden-goblin.s3.ap-northeast-2.amazonaws.com/Icon.png"
    },
    actionsConfiguration: {
      returnStrategy: 'tg://resolve',
      modals: 'all',
      tmaReturnUrl: 'back'
    },
    language: 'en_US',
    uiPreferences: {
      theme: THEME.LIGHT
    },
    restoreConnection: true,
  });

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

  okxProvider.then(provider => {
    provider.on('display_uri', uri => {
      console.log('[Url] ' + uri.toString());
      window.Telegram.WebApp.openLink(uri.toString());
    });
  });

  okxProvider.then(provider => {
    provider.on('session_update', session => {
      alert("session has been updated.");
      console.log(session);
    });
  });


  okxProvider.then(provider => {
    provider.on('session_delete', ({topic}) => {
      alert("session has been deleted.");
      console.log(topic);
    });
  });

  const WalletConnect = () => {
    alert("connection started");

    okxProvider.then(provider => {
      provider.setDefaultChain("eip155:1");

      if (provider.connected) {
        alert("already connected. disconnecting");
        provider.disconnect().then(r => {
          alert("successfully disconnected");
          console.log(r);
        }).catch(error => {
          alert("an error occurred while disconnecting");
          console.log(error);
        });
      }

      provider.connect({
        namespaces: {
          eip155: {
            chains: ["eip155:1"],
            defaultChain: "1"
          }
        }
      }).then(r => {
        alert("successfully connected");
        console.log(r);
      }).catch(error => {
        alert("an error occurred while connecting");
        console.log(error);
      });
    });
    //connectOkxWithoutAsync();
    //GetWaleltConnect();
    /*connectOkxWalletInEthereum().then(async (session) => {
      console.log("[지갑연결] 실행 완료");
      console.log(session);
    }).catch(error => {
      console.log("[지갑연결] 에러 발생");
      console.log(error);
    });*/
    //window.Telegram.WebApp.openLink("https://www.okx.com/download?deeplink=okx%3A%2F%2Fweb3%2Fwallet%2Fconnect%3Fparam%3DeyJwcm90b2NvbFZlciI6MSwidG9waWMiOiJlNTMzYTQ1NmYxNTZiNmY5NTZiMDY5MzY3N2RmZTdlMjBmODdiYzYyMTgxNWM2OTIzMDYzN2VkMjcyM2M2MTQ0IiwiY2xpZW50SWQiOiJjNzExYWNkNzE2OTRmMGYwODliOWFmMjg3M2Y2ZTU0MzY2N2Q4OTUwZTBlN2EzODgwOTcyMGRiMzE0NDkzNTE2IiwicmVxdWVzdElkIjoiMTczMTA1NjQ1NTc2MiIsImRBcHBJbmZvIjp7InVybCI6Im1haW4uZDFtbHc1Y2Z5bmIwbmUuYW1wbGlmeWFwcC5jb20iLCJvcmlnaW4iOiJodHRwczovL21haW4uZDFtbHc1Y2Z5bmIwbmUuYW1wbGlmeWFwcC5jb20iLCJuYW1lIjoiQmxvY2tFZHVjYXRpb24iLCJpY29uIjoiaHR0cHM6Ly9nb2xkZW4tZ29ibGluLnMzLmFwLW5vcnRoZWFzdC0yLmFtYXpvbmF3cy5jb20vSWNvbi5wbmcifSwicmVxdWVzdHMiOlt7Im5hbWUiOiJyZXF1ZXN0QWNjb3VudHMiLCJyZXF1aXJlZE5hbWVzcGFjZXMiOlt7Im5hbWVzcGFjZSI6ImVpcDE1NSIsImNoYWlucyI6WyJlaXAxNTU6MSJdfV0sIm9wdGlvbmFsTmFtZXNwYWNlcyI6W119XSwicmVkaXJlY3QiOiJ0ZzovL3Jlc29sdmUifQ%3D%3D");
  };

  function connectOkxWithoutAsync() {
    okxUi.then(okxUi => {
      if (okxUi.connected()) {
        okxUi.disconnect().then(() => {
          alert("연결 해제 완료");
          console.log("[연결 해제] 연결 해제 성공");
          reconnectOkx();
        }).catch(error => {
          alert("에러 발생");
          console.log("[연결 해제] 연결 해제 실패");
          console.log(error);
        });
      }
      else {
        console.log("[연결 해제] 할 필요 없어서 연결함");
        reconnectOkx();
      }
    }).catch(error => {
      console.log("무슨 일이 생김 1");
      alert("공습 경보 1");
      console.log(error);
    });
  }

  function reconnectOkx() {
    console.log("[진짜 연결] 연결 시도");

    okxUi.then(okxUi => {
      okxUi.openModal({
        namespaces: {
          eip155: {
            chains: ["eip155:1"],
            defaultChain: "1"
          }
        }
      }).then(session => {
        alert("연결 완료: " + session.namespaces.eip155.accounts[0].replace('eip155:1:', ''));
        console.log("[진짜 연결] 연결 완료");
        console.log(session);
      }).catch(error => {
        alert("연결 실패");
        console.log("[진짜 연결] 연결 실패");
        console.log(error);
      });
    }).catch(error => {
      alert("공습 경보 2");
      console.log("[진짜 연결] 연결 시도 실패");
      console.log(error);
    });
  }

  /*async function connectOkxWalletInEthereum() {
    await okxUi.then(async (okxUi) => {
      if (okxUi.connected()) {
        await okxUi.disconnect().then(() => {
          alert("연결 해제 완료");
          realConnectOkxWalletInEthereum();
        }).catch(error => {
          alert("에러 발생");
        });
      }
      else {
        await realConnectOkxWalletInEthereum();
      }
    }).catch(error => {
      alert("뭔가 문제가 생김 1");
      console.log(error);
    });
  }

  async function realConnectOkxWalletInEthereum() {
    await okxUi.then(async (okxUi) => {
      console.log(`[모달 열기 전] 딥링크: ${okxUi.deepLink}, 유니버셜 링크: ${okxUi.universalLink}`);

      await okxUi.openModal({
        namespaces: {
          eip155: {
            chains: ["eip155:1"],
            defaultChain: "1"
          }
        }
      }).then(async (session) => {
        console.log(`[모달 연 후] 딥링크: ${okxUi.deepLink}, 유니버셜 링크: ${okxUi.universalLink}`);

        alert("연결 완료: " + (await session).namespaces.eip155.accounts[0].replace('eip155:1', ''));
      }).catch(async error => {
        alert("오류 발생!");
        console.log("[진짜 연결] 오류 발생");
        console.log(error);
      });
    }).catch(error => {
      alert("뭔가 문제가 생김 2");
      console.log(error);
    });
  }*/


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