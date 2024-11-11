import { React, useEffect } from "react";
import { Vibration } from "react-native";
import { Unity, useUnityContext } from "react-unity-webgl";

import { TonConnectUI } from "@tonconnect/ui-react";

import { OKXUniversalProvider } from "@okxconnect/universal-provider";
import { THEME } from "@okxconnect/ui";

const isDevMode = true;

const liveUrl = "https://d3c9jx2zokz1rn.cloudfront.net/web-build";
const devUrl = "https://lys-test.s3.ap-northeast-2.amazonaws.com";

const liveVersion = "banana-v19";
const devVersion = "Payment2";

const eth_mainNet = "eip155:1";
const eth_mainNet_Id = "1";

const eth_binance = "eip155:56";
const eth_binance_Id = "56";

const eth_scroll = "eip155:534352";
const eth_scroll_Id = "534352";

let current_chainId = eth_scroll;
let current_chainIdNum = eth_scroll_Id;

const tonConnectUi = new TonConnectUI({
  manifestUrl: "https://lys-test.s3.ap-northeast-2.amazonaws.com/tonconnect-manifest.json"
});

const okxProvider = OKXUniversalProvider.init({
  dappMetaData: {
    name: "BlockEducation",
    icon: "https://unitybuild-blockstreet.s3.ap-northeast-2.amazonaws.com/unity-component/Image/BlockStreet_Logo.png"
  },
  actionsConfiguration: {
    returnStrategy: "tg://resolve",
    modals: "all",
    tmaReturnUrl: "back"
  },
  language: "en_US",
  uiPreferences: {
    theme: THEME.LIGHT
  },
  restoreConnection: true
});



const App = () => {
  window.Telegram.WebApp.expand();

  const currentUrl = `${(isDevMode ? devUrl : liveUrl)}/${(isDevMode ? devVersion : liveVersion)}`

  const { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
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
  };

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

  const WalletConnect = () => {
    TryConnectOKXEthWallet().then(async () => {
      alert("Wallet connection started.");
    }).catch(error => {
      alert("Failed to connect wallet.");
      console.log(error);
    });
  };

  const handleCopyClipBoard = (text_s) => {
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

  // -- Internal functions

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

  async function TryConnectTonConnectWallet() {
    if (tonConnectUi.connected) {
      await tonConnectUi.disconnect().then(async () => {
        await ConnectTonConnectWallet();
      }).catch(error => {
        alert("Failed to disconnect TonConnect wallet.");
        console.log(error);
      });
    }
    else {
      await ConnectTonConnectWallet();
    }
  }

  async function ConnectTonConnectWallet() {
    await tonConnectUi.openModal();

    const unsubscribe = tonConnectUi.onModalStateChange(state => {
      sendMessage('SendReactManager', 'ReciveWalletAddr', tonConnectUi.account.address);
      tonConnectUi.closeModal();
      unsubscribe();
    });
  }

  async function TryConnectOKXEthWallet() {
    await okxProvider.then(async provider => {
      console.log(provider.connected());

      if (provider.connected()) {
        await provider.disconnect().then(async () => {
          alert("OKX Eth wallet disconnected.");
          await ConnectOKXEthWallet();
        }).catch(error => {
          alert("Failed to disconnect OKX Eth wallet.");
          console.log(error);
        });
      }
      else {
        await ConnectOKXEthWallet();
      }
    }).catch(error => {
      alert("Failed to connect OKX Eth wallet. Initialize Failed");
      console.log(error);
    });
  }

  async function ConnectOKXEthWallet() {
    await okxProvider.then(async provider => {
      await provider.connect({
        namespaces: {
          eip155: {
            chains: [eth_scroll, eth_binance],
            defaultChain: eth_scroll_Id,
          }
        },
        optionalNamespaces: {
          eip155: {
            chains: [eth_scroll]
          }
        },
        sessionConfig: {
          redirect: "tg://resolve"
        }
      }).then(async result => {
        provider.setDefaultChain(current_chainId);

        const address = result.namespaces.eip155.accounts[0].replace(current_chainId + ":", "");
        alert("Successfully connected OKX Eth wallet. Address: " + address);

        sendMessage('SendReactManager', 'ReciveWalletAddr', address);
      }).catch(error => {
        alert("An error occurred while connecting OKX Eth wallet.");
        console.log(error);
      });
    }).catch(error => {
      alert("Failed to connect OKX Eth wallet. Connector initialization Failed");
      console.log(error);
    });
  }

  // -- OKXConnectProvider event listeners

  okxProvider.then(async provider => {
    await provider.on("display_uri", async uri => {
      window.Telegram.WebApp.openLink(uri.toString());
    });
  });

  okxProvider.then(async provider => {
    await provider.on("session_update", async session => {
      console.log("Session has been updated.");
      console.log(session);
    });
  });

  okxProvider.then(async provider => {
    await provider.on("session_delete", ({topic}) => {
      console.log("Session has been deleted.");
      console.log(topic);
    });
  });

  // -- Unity relative functions

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
  ]);

  return (
      <div className="App">
        <Unity
          devicePixelRatio={2}
          style={{
            width: window.innerWidth || document.body.clientWidth,
            height: window.innerHeight || document.body.clientHeight ,
            justifySelf: 'center',
            alignSelf: 'center',
          }}
          unityProvider={unityProvider}/>
      </div>
  );
};

export default App;