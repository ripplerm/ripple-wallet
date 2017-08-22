var walletApp = angular.module('walletApp', ['ui.bootstrap', 'jsonFormatter', 'ngStorage', 'monospaced.qrcode']);

var Remote = ripple.Remote;
var Seed = ripple.Seed;
var KeyPair = ripple.KeyPair;
var Utils = ripple.utils;
var UInt160 = ripple.UInt160;
var Amount = ripple.Amount;
var Currency = ripple.Currency;
var sjcl = ripple.utils.sjcl;
var base58 = ripple.Base;
var OrderBookUtils = ripple.OrderBookUtils;

// ================= configuration & Global constant  ==================

var CLIENT_VERSION = "rm-1.2.4"
var INSERT_CLIENT_INFO = true;

var DEFAULT_ACCOUNT = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
var DEFAULT_SECRET = "snoPBrXtMeMyMHUVTgbuqAfg1SUTb";
var HISTORY_MAX = 10;

var PATHFIND_MAX = 10; // stop pathfinding after reaching PATHFIND_MAX
var SLIPAGE = 1;  // 1%, for calculating sendMax

var RIPPLE_DATA_URL = 'https://data.ripple.com'; 
var CHART_INTERVAL = '1hour'; // 1minute, 15minute, 30minute, 1hour, 1day...
var CHART_MAX_PAGE = 1; // max pages for repeated queries to data.ripple.com;
var CHART_LIMIT = 1000; // limit number for single query;

var DEVIATION_ALERT = 0.20;  // alert when offerCreate price deviate >20% from market.
var APPLY_INTEREST = false; // false: showing raw amount instead of demuraged figure.

var SERVERS_MAINNET = [
                      {
                          host:    's1.ripple.com'
                          , port:    443
                          , secure:  true
                          , primary: true
                      },
                      {
                          host:    's-east.ripple.com'
                          , port:    443
                          , secure:  true
                      },
                      {
                          host:    's-west.ripple.com'
                          , port:    443
                          , secure:  true
                      }                    
                   ];

var SERVERS_TESTNET = [{
                          host: 's.altnet.rippletest.net'
                          , port: 51233
                          , secure: true
                      }];

var GATEWAYS = [
      {
        name: "BitStamp",
        address: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        currencies: ['USD', 'BTC'] 
      },
      {
        name: "SnapSwap",
        address: "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        currencies: ['USD', 'BTC', 'EUR'] 
      },
      {
        name: "RippleChina",
        address: "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
        currencies: ['CNY', 'BTC', 'LTC']   
      },
      {
        name: "RippleCN",
        address: "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
        currencies: ['CNY', 'BTC']  
      },
      {
        name: "RippleFox",
        address: "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
        currencies: ['CNY', 'FMM', 'STR', 'XLM']  
      },
      {
        name: "TheRock",
        address: "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
        currencies: ['BTC', 'LTC','NMC', 'PPC', 'DOG', 'USD ', 'EUR', 'GBP']  
      },
      {
        name: "DividendRippler",
        address: "rfYv1TXnwgDDK4WQNbFALykYuEBnrR4pDX",
        currencies: ['BTC', 'LTC', 'NMC', 'TRC', 'STR']      
      },
      {
        name: "PayRoutes",
        address: "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
        currencies: ['USD', 'ILS', 'BTC', 'LTC', 'NMC', 'PPC']  
      },
      {
        name: "RippleUnion",
        address: "r3ADD8kXSUKHd6zTCKfnKT3zV9EZHjzp1S",
        currencies: ['CAD']    
      },
      {
        name: "Bitso",
        address: "rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn",
        currencies: ['BTC', 'MXN']      
      },
      {
        name: "RippleTradeJapan",
        address: "rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6",
        currencies: ['JPY']      
      },
      {
        name: "RippleExchangeTokyo",
        address: "r9ZFPSb1TFdnJwbTMYHvVwFK1bQPUCVNfJ",
        currencies: ['JPY']
      },
      {
        name: "DigitalGateJP",
        address: "rJRi8WW24gt9X85PHAxfWNPCizMMhqUQwg",
        currencies: ['JPY'] 
      },
      {
        name: "TokyoJPY",
        address: "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN",
        currencies: ['JPY']  
      },
      {
        name: "Ripula",
        address: "rBycsjqxD8RVZP5zrrndiVtJwht7Z457A8",
        currencies: ['BTC', 'EUR', 'GBP', 'USD']  
      },     
      {
        name: "Gatehub",
        address: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
        currencies: ['EUR', 'USD']  
      },
      {
        name: "GatehubFifthBTC",
        address: "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL",
        currencies: ['BTC']  
      },
      {
        name: "GatehubFifthETH",
        address: "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
        currencies: ['ETH']  
      },
      {
        name: "GatehubFifthETC",
        address: "rDAN8tzydyNfnNf2bfUQY6iR96UbpvNsze",
        currencies: ['ETC']  
      },
      {
        name: "GatehubFifthREP",
        address: "rckzVpTnKpP4TJ1puQe827bV3X4oYtdTP",
        currencies: ['REP']  
      },
      {
        name: "BPG",
        address: "rcoef87SYMJ58NAFx7fNM5frVknmvHsvJ",
        currencies: ['XAU']  
      },
      {
        name: "Bluzelle",
        address: "raBDVR7JFq3Yho2jf7mcx36sjTwpRJJrGU",
        currencies: ['CAD']  
      },
      {
        name: "eXRP",
        address: "rPxU6acYni7FcXzPCMeaPSwKcuS2GTtNVN",
        currencies: ['KRW']    
      },
      {
        name: "Rippex",
        address: "rfNZPxoZ5Uaamdp339U9dCLWz2T73nZJZH",
        currencies: ['BRL']  
      },
      {
        name: "RippexBridge",
        address: "rKxKhXZCeSDsbkyB8DVgxpjy5AHubFkMFe",
        currencies: ['BTC']  
      },
      {
        name: "MrRipple",
        address: "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
        currencies: ['JPY', 'USD', 'BTC', 'LTC', 'DOG', 'STR']
      },
      {
        name: "Steemiex",
        address: "rKYyUDK7N4Wd685xjfMeXM9G8xEe5ciVkC",
        currencies: ['STM', 'SBD']
      },
    ];

var TRADE_PAIRS = [
  'USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/XRP',
  'BTC.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/XRP',
  'CNY.rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/XRP',
  'JPY.r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN/XRP',
  'KRW.rPxU6acYni7FcXzPCMeaPSwKcuS2GTtNVN/XRP',
  'BRL.rfNZPxoZ5Uaamdp339U9dCLWz2T73nZJZH/XRP',
  'MXN.rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn/XRP',
  'EUR.rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/XRP',
  'ETH.rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h/XRP',
  'STM.rKYyUDK7N4Wd685xjfMeXM9G8xEe5ciVkC/XRP',
]

var GATEWAYS_TEST = [
      {
        name: "GateOne",
        address: "r9U9DDht72oMx7nrqsS7uELXNvfsYL4USm",
        currencies: ['USD', 'BTC'] 
      },
      {
        name: "GateTwo",
        address: "rH6C28kDJURagNz1Mt6oX9PEyFtJqxyTwo",
        currencies: ['CNY', 'JPY'] 
      },
    ];

var TRADE_PAIRS_TEST = [
  'USD.r9U9DDht72oMx7nrqsS7uELXNvfsYL4USm/XRP',
  'BTC.r9U9DDht72oMx7nrqsS7uELXNvfsYL4USm/XRP',
  'CNY.rH6C28kDJURagNz1Mt6oX9PEyFtJqxyTwo/XRP',
  'JPY.rH6C28kDJURagNz1Mt6oX9PEyFtJqxyTwo/XRP',
  'BTC.r9U9DDht72oMx7nrqsS7uELXNvfsYL4USm/USD.r9U9DDht72oMx7nrqsS7uELXNvfsYL4USm',
  'USD.r9U9DDht72oMx7nrqsS7uELXNvfsYL4USm/CNY.rH6C28kDJURagNz1Mt6oX9PEyFtJqxyTwo',
  'USD.r9U9DDht72oMx7nrqsS7uELXNvfsYL4USm/JPY.rH6C28kDJURagNz1Mt6oX9PEyFtJqxyTwo',
]

var DEFAULT = {
  account: {
    address: DEFAULT_ACCOUNT,
    secret: DEFAULT_SECRET
  },
  accounts: [],
  slipage: SLIPAGE,
  max_fee: 120,
  fee_cushion: 1.2,
  orderbook_limit: 50,
  last_ledger_offset: 3,
  servers: SERVERS_MAINNET,
  gateways: GATEWAYS,
  tradepairs: TRADE_PAIRS,
  servers_test: SERVERS_TESTNET,
  gateways_test: GATEWAYS_TEST,
  tradepairs_test: TRADE_PAIRS_TEST,
  contacts: [],
  contacts_test: []
}
// ========= main controller ====================================


walletApp.controller('walletCtrl', ['$scope', '$http', '$uibModal', '$localStorage', function($scope, $http, $uibModal, $localStorage) {
  $scope.$storage = $localStorage.$default(DEFAULT);

  var remote = new Remote({
      trusted:        false,
      local_signing:  true,
      local_fee:      true,
      fee_cushion:    $localStorage.fee_cushion,
      max_fee:        $localStorage.max_fee,
      servers:        $localStorage.servers,
      orderbook_limit: $localStorage.orderbook_limit,
      last_ledger_offset: $localStorage.last_ledger_offset,
  });
  $scope.gateways = $localStorage.gateways;
  $scope.tradepairs = $localStorage.tradepairs;
  $scope.servers = $localStorage.servers;
  $scope.accountHistory = $localStorage.accounts;
  $scope.contacts = $localStorage.contacts;

  $scope.accountBalances = {};
  $scope.Payment = {
    slipage: $localStorage.slipage
  };

  $scope.trading = { 
                      pair: $scope.tradepairs[0]
                   };                    

  $scope.flags = Remote.flags;
  $scope.txFlags = ripple.Transaction.flags;
  $scope.scFlags = ripple.Transaction.set_clear_flags.AccountSet;

  $scope.remote = remote;
  
  remote.on('state', function(state){
    $scope.state = state;
  })
  remote.on('ledger_closed', function(msg, server){
    $scope.ledgerIndex = msg.ledger_index; 
    var server = remote.getServer();
    if (!server) return;
    $scope.server = server._opts.host;
    $scope.fee = server._fee;
    try {$scope.$apply();} catch (e) {};
  })
  remote.connect();

  $scope.tabs = [
                  {title: 'Info', templete:'templetes/tab-info.html', select: function () {$scope.infoPageLoad();}},
                  {title: 'Trustlines', templete:'templetes/tab-trustlines.html', select: function () {$scope.trustlinesPageLoad();} },
                  {title: 'Payment', templete:'templetes/tab-payment.html', select: function () {$scope.paymentReset();}},
                  {title: 'Trading', templete:'templetes/tab-trading.html', select: function () {$scope.tradingPageLoad();} },
                  {title: 'Offers', templete:'templetes/tab-offers.html', select: function () {$scope.offerPageLoad();} },
                  {title: 'History', templete:'templetes/tab-history.html', select: function () {$scope.historyPageLoad();} },
                  {title: 'Settings', templete:'templetes/tab-settings.html', select: function () {} },
                  {title: 'Tools', templete:'templetes/tab-tools.html', select: function () {} },
                ]
  $scope.tabActive = {Info: true};

  $scope.alerts = {
    account: [],
    trustline: [],
    payment: [],
    trading: [],
    offer: [],
  }

  $scope.networks = ['MAIN', 'TEST'];
  $scope.network = 'MAIN';
  $scope.state = 'offline'

  $scope.tools = [ 
    {title: 'Raw Txn', templete:'templetes/tab-transaction.html'},
    {title: 'Submit', templete:'templetes/tab-submit.html'},
    {title: 'Account-Generator', templete:'templetes/tab-keys.html', select: function () {$scope.keysReset();} },
    {title: 'Message', templete:'templetes/tab-message.html', select: function () {$scope.messageReset();} },
    {title: 'Inbox', templete:'templetes/tab-inbox.html', select: function () {} },
  ];

  $scope.keys = {};
  $scope.gkeys = {}

  $scope.keysReset = function () {
    $scope.keys = {
      from: 'seed',
      priformat: 'base58',
      seedformat: 'base58',
    }
  }
  $scope.keysRandom = function () {
    switch ($scope.keys.from) {
      case 'seed': 
        $scope.keys.secret = Seed.getRandom().to_json();
        break;
      case 'private':
        $scope.keys.secret = KeyPair.getRandom().to_pri_string();
    }
    $scope.keys.index = 0;
    $scope.generateKeys();
  }
  $scope.generateKeys = function () {
    if (!$scope.keys.index && $scope.keys.from != 'private') $scope.keys.index = 0;
    $scope.gkeys = {};
    $scope.keys.error = '';
    var seed, g, key;
    var index = $scope.keys.index;
    switch ($scope.keys.from) {
      case 'passphrase':
        seed = new Seed().parse_passphrase($scope.keys.secret);
        break;
      case 'seed':
        seed = Seed.from_json($scope.keys.secret);
        if (!seed.is_valid()) $scope.keys.error = 'Invalid Secret!'
        break;
      case 'private':
        key = KeyPair.from_json($scope.keys.secret);
        if (!key.is_valid()) $scope.keys.error = 'Invalid PrivateKey!'
    }

    if (seed && seed.is_valid()) {
      $scope.gkeys.seed = {
        base58: seed.to_json(),
        hex: seed.to_hex(),
        rfc1751: seed.to_human(),
      }
      g = seed.get_generator();
      $scope.gkeys.generator = {
        pri_node: g.to_pri_node(),
        pub_node: g.to_pub_node(),
      }
      key = g.get_child(index);
    }
  
    if (key && key.is_valid()) {
      $scope.gkeys.account = {
        index: index,
        prikey_hex: key.to_pri_hex(),
        prikey_base58: key.to_pri_string(),
        prikey_bitcoin: key.to_wif_bitcoin(),
        prikey_rfc1751: key.to_human(),
        pubkey_hex: key.to_pub_hex(),
        address: key.to_address_string(),
      }
    }
  }
  $scope.generateChild = function () {
    if (! $scope.gkeys.childIndex) $scope.gkeys.childIndex = 0;
    var index = $scope.gkeys.childIndex;
    var hardened = $scope.gkeys.childHardened;
    var childkey = KeyPair.from_json($scope.gkeys.account.prikey_hex).get_child(index, hardened);
    if (childkey.is_valid()) {
      $scope.gkeys.child = {
        index: index + (hardened? Math.pow(2,32) : 0),
        prikey_hex: childkey.to_pri_hex(),
        prikey_base58: childkey.to_pri_string(),
        prikey_bitcoin: childkey.to_wif_bitcoin(),
        prikey_rfc1751: childkey.to_human(),
        pubkey_hex: childkey.to_pub_hex(),
        address: childkey.to_address_string(),
      }
    }
  }

  $scope.messageReset = function () {
    $scope.message = {
      to: '',
      data: '',
      dtag: undefined,
    };
  };

  $scope.setMessageRecipient = function (contact) {
    $scope.message.dtag = undefined;
    if (contact && typeof contact.dtag == 'number') $scope.message.dtag = contact.dtag;
  };

  $scope.sendMessage = function () {
    var transaction = remote.transaction();
    transaction.payment({
      to: $scope.message.to,
      from: $scope.activeAccount,
      amount: '1',
    });
    var memo = {
      memoType: 'message',
      memoFormat: 'text',
      memoData: $scope.message.data,
    }
    transaction.addMemo(memo);
    if (typeof $scope.message.dtag == 'number') {
      transaction.tx_json.DestinationTag = $scope.message.dtag;
    }
    $scope.messageLog = {};
    $scope.submitTransaction({transaction:transaction, log: $scope.messageLog});
  };

  $scope.inboxFilter = function (tx) {
    if (! tx.memos) return false;
    if (tx.raw.TransactionType == 'Payment'){
      if (! $scope.messageSettings.Payment) return false;
      if (tx.raw.Destination != $scope.activeAccount) return false;
    }
    if (tx.raw.TransactionType == 'TrustSet'){
      if (! $scope.messageSettings.TrustSet) return false;
      if (tx.raw.LimitAmount.issuer != $scope.activeAccount) return false;
    }
    var gotMessage = false;
    tx.memos.forEach(function (m) {
      if ($scope.messageFilter(m) && m.memoData) gotMessage = true;;
    })
    return gotMessage;
  }

  $scope.messageFilter = function (m) {
    if (m.memoType && $scope.messageSettings.ignoreTypes.indexOf(m.memoType) >= 0) return false;
    return true;
  }

  $scope.messageSettings = {
    Payment: true,
    TrustSet: true,
    ignoreTypes: ['client'],
  };

  $scope.transactions = [ 
    { type: 'AccountSet', templete: 'templetes/tx-accountSet.html'},
    { type: 'SetRegularKey', templete: 'templetes/tx-setRegularKey.html'},
    { type: 'SignerListSet', templete: 'templetes/tx-signerListSet.html'},
    { type: 'TrustSet', templete: 'templetes/tx-trustSet.html'},
    { type: 'Payment', templete: 'templetes/tx-payment.html'},
    { type: 'OfferCreate', templete: 'templetes/tx-offerCreate.html'},
    { type: 'OfferCancel', templete: 'templetes/tx-offerCancel.html'},
  ];
  $scope.txActive = {AccountSet: true};

  $scope.txSetSigners = function () {
    function formatSignerEntry (signer) {
      return {
        SignerEntry: {
          Account: signer.address,
          SignerWeight: signer.weight
        }      
      }      
    }
    $scope.prepareSetSignerList(function (options){
      $scope.txJson.SignerQuorum = options.quorum;
      if (options.quorum) {
        $scope.txJson.SignerEntries = options.signers.map(formatSignerEntry);
      } else {
        delete $scope.txJson.SignerEntries; 
      }
    })
  };
  $scope.txSetAccount = function () {
    $scope.txJson.Account = $scope.activeAccount;
  };
  $scope.txSetSequence = function () {
    $scope.txJson.Sequence = $scope.accountData.Sequence;
  };
  $scope.txLastLedgerSequence = function () {
    $scope.txJson.LastLedgerSequence = $scope.ledgerIndex;
  };
  $scope.txSetSecret = function () {
    $scope.txOptions.secret = remote.secrets[$scope.activeAccount];
  };
  $scope.txSetSignAs = function () {
    $scope.txOptions.signAs = $scope.activeAccount;
  };
  $scope.txSetExpirationNow = function () {
    var now = Date.now();
    $scope.txJson.Expiration = Utils.time.toRipple(now);
  };
  $scope.txExpirationAddHour = function () {
    $scope.txJson.Expiration += 3600;
  };
  $scope.txExpirationAddDay = function () {
    $scope.txJson.Expiration += (24 * 3600);
  };

  $scope.txJsonReset = function () {
    if (!$scope.txJson) $scope.txJson = {};
    var newJson = {};
    newJson.Flags = 0x80000000;
    ['Account', 'Sequence', 'Fee', 'LastLedgerSequence', 'SourceTag', 'AccountTxnID'].forEach(function (field) {
      if ($scope.txJson[field]) newJson[field] = $scope.txJson[field];
    })
    $scope.txJson = newJson;

    if (!$scope.txOptions) $scope.txOptions = {};
    var newOptions = {};
    ['LastLedgerSequence', 'SourceTag', 'AccountTxnID', 'secret', 'signAs', 'isMultiSign'].forEach(function (field) {
      if ($scope.txOptions[field]) newOptions[field] = $scope.txOptions[field];
    });
    $scope.txOptions = newOptions;
    $scope.txBlob = '';
  }
  $scope.txJsonRemove = function (field) {
    delete $scope.txJson[field];
  }
  $scope.txSetFlag = function (flag) {
    var flagValue = ripple.Transaction.flags[$scope.txJson.TransactionType][flag];
    if (!flagValue) return;
    $scope.txJson.Flags |= flagValue;
    $scope.txJson.Flags = $scope.txJson.Flags >>> 0;
  }
  $scope.txClearFlag = function (flag) {
    var flagValue = ripple.Transaction.flags[$scope.txJson.TransactionType][flag];
    if (!flagValue) return;
    $scope.txJson.Flags &= (~flagValue);
    $scope.txJson.Flags = $scope.txJson.Flags >>> 0;
  }
  $scope.txSign = function () {
    $scope.txError = '';

    var tx = remote.transaction();
    tx.on('error', function (e) {
      if (e && e.result) $scope.txError = e.result;
    })
    tx._setFixedFee = true;
    tx.tx_json = $scope.txJson;

    $scope.setSecret({
      account: $scope.txOptions.isMultiSign ? $scope.txOptions.signAs : $scope.txJson.Account,
      secret: $scope.txOptions.secret
    })

    // Removing existing signature    
    delete tx.tx_json.SigningPubKey;
    delete tx.tx_json.TxnSignature;

    var signAs = $scope.txOptions.signAs;
    if ($scope.txOptions.isMultiSign) {
      tx._multiSign = true;
      if (Array.isArray(tx.tx_json.Signers)) {
        var signers = tx.tx_json.Signers;
        for (var i=signers.length - 1; i>=0; i--) {
          if (signers[i].Signer.Account === signAs) signers.splice(i,1);
        }
      }
    } else {
      delete tx.tx_json.Signers;
    }

    if (! tx.complete())  return; 

    if (! tx._multiSign) tx.sign();
    else tx.multiSignFor(signAs);

    $scope.txBlob = tx.serialize().to_hex();
  }
  $scope.txBlobSave = function () {
    var blob = new Blob([$scope.txBlob], {type: "text/json;charset=utf-8"});
    saveAs(blob, 'tx-blob.txt');
  }
  $scope.txImport = function (element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var tx = new ripple.SerializedObject(reader.result).to_json();
        $scope.txJson = tx;
        $scope.txActive[tx.TransactionType] = true;
      } catch (e) {};
      $scope.$apply();
    };
    reader.readAsText(file);
  }
  $scope.txSubmitBlob = {};
  $scope.txSubmitImport = function (element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      $scope.txSubmitBlob = {blob: reader.result};
      $scope.txSubmitResponse = '';
      $scope.$apply();
    };
    reader.readAsText(file);
  }
  $scope.txSubmit = function () {
    $scope.txSubmitResponse = 'submitting...';
    var submitRequest = remote.requestSubmit();
    submitRequest.tx_blob($scope.txSubmitBlob.blob);
    submitRequest.once('success', function (res) {
      $scope.txSubmitResponse = res.engine_result + ': ' + res.engine_result_message;
    });
    submitRequest.broadcast().request();
  }

  $scope.filename = 'ripple-wallet-profile.txt';
  $scope.exportProfile = function () {
    var data = JSON.stringify($scope.$storage, null, 2);
    var blob = new Blob([data], {type: "text/json;charset=utf-8"});
    saveAs(blob, $scope.filename);
  }

  $scope.fileNameChanged = function (element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var result;
      try {result = JSON.parse(reader.result)} catch (e) {};
      $scope.uploaded = result ? 'Load Success, please refresh the browser.' : 'Failed parsing data.';
      Object.assign($localStorage, result); 
      $scope.$apply();
    };
    reader.readAsText(file);
  }

  $scope.switchNetwork = function (network) {
    if (network == $scope.network) return;

    //disconnect and remove all servers and accounts;
    remote._servers.forEach(function (server) {
      server.disconnect();
    });
    remote._servers = [];
    remote._accounts = [];

    //reconfigure and reconnect;
    if (network == 'MAIN') {
      remote.servers = $scope.servers = $localStorage.servers;
      $scope.gateways = $localStorage.gateways;
      $scope.tradepairs = $localStorage.tradepairs;
      $scope.contacts = $localStorage.contacts;
    } else if (network == 'TEST') {
      remote.servers = $scope.servers = $localStorage.servers_test;
      $scope.gateways = $localStorage.gateways_test;
      $scope.tradepairs = $localStorage.tradepairs_test;
      $scope.contacts = $localStorage.contacts_test;
    }
    remote._ledger_current_index = undefined;
    remote.servers.forEach(function (serverOptions) {
      var server = remote.addServer(serverOptions);
      server.setMaxListeners(remote.max_listeners);
    });
    remote.connect();

    $scope.network = network;
    $scope.ledgerIndex;
    $scope.walletAccount = null;
    $scope.setWalletAccount({address: $scope.activeAccount});
    $scope.setTradePair($scope.tradepairs[0]);
    $scope.orderBooksReset();
  }

  $scope.closeAlert = function(type, index) {
    if (!type) return;
    $scope.alerts[type].splice(index, 1);
  };

  $scope.getFullContacts = function () {
    return $scope.contacts.concat($scope.gateways);
  }

  $scope.inGatewayList = function (account) {
    if (!account)  return false;

    var gateways = $scope.gateways;
    for (var i=0; i < gateways.length; i++) {
      if (account == gateways[i].address) return true;
    } 
    return false;   
  }

  $scope.gatewayName = function (account, sliced) {
    if (!account) { return ''; }
    var gateways = $scope.gateways;
    for (var i=0; i < gateways.length; i++) {
      if (account == gateways[i].address) return gateways[i].name;
    } 

    return sliced ? [account.slice(0,4), account.slice(-4)].join('....') : account;
  }

  $scope.contactName = function (account, dtag) {
    if (!account) { return ''; }
    var contacts = $scope.contacts;
    for (var i=0, l=contacts.length; i<l; i++) {
      if (account === contacts[i].address && dtag === contacts[i].dtag) return contacts[i].name;
    } 
    return '';
  }

  $scope.parseAddress = function (account, dtag) {
    return $scope.contactName(account, dtag) || $scope.gatewayName(account);
  }

  $scope.accountInfoReset = function () {
      $scope.accountData = null;
      $scope.accountBalances.XRP = null;
      $scope.accountInfoStatus = '';
  }

  $scope.updateAccountInfo = function (entry, ledger_index) {
    $scope.accountInfoStatus = 'Updated @ Ledger:' + ledger_index;
    var accountData = $scope.walletAccount._entry;

    accountData.domain = accountData.Domain? Utils.hexToString(accountData.Domain) : '';
    accountData.xrpBalance = accountData.Balance / 1000000;
    accountData.xrpReserved = remote.reserve(accountData.OwnerCount).to_human();

    accountData.settings = {};

    var flags = Remote.flags['account_root'];
    for (var flag in flags) {
      accountData.settings[flag] = accountData.Flags & flags[flag] ? true : false;
      accountData.settings['AccountTxnID'] = accountData.hasOwnProperty('AccountTxnID') ? true : false;
    }

    if (accountData.signer_lists && accountData.signer_lists[0]) {
      var slist = accountData.signer_lists[0];
      accountData.quorum = slist.SignerQuorum;  
      accountData.signers = slist.SignerEntries.map(function (signer) {
        return {
          address: signer.SignerEntry.Account,
          weight: signer.SignerEntry.SignerWeight,
        }
      });      
    } else {
      accountData.signers = [];
      accountData.quorum = 0;
    }

    $scope.accountData = accountData;
    $scope.accountBalances.XRP = accountData.xrpBalance;
    $scope.accountBalances.reserved = accountData.xrpReserved;

    $scope.$apply();
  }

  $scope.accountInfo = function () {
    if (!$scope.walletAccount) return;

    $scope.accountInfoStatus = 'requesting...';

    $scope.walletAccount.entry(function (err, res){
      if (err) {
        if (err.remote) {
          var account = err.remote.account || err.remote.request.account;
          if (account != $scope.walletAccount._account_id) return;
          if (err.remote.error) $scope.accountInfoStatus = err.remote.error; 
        } else { $scope.accountInfoStatus = err.error;}
      }
    })
  }

  $scope.infoPageLoad = function (){
    if (!$scope.walletAccount) {
      if ($localStorage.account) $scope.setWalletAccount($localStorage.account);
    }
    if (!$scope.walletAccount._entry.Account) $scope.accountInfo();
  }

  $scope.trustlinesReset = function () {
    $scope.accountBalances.IOU = {};
    $scope.trustlines = null;
    $scope.trustlinesStats = null;    
    $scope.totalTrustlines = 0;
    $scope.accountLinesStatus = '';      
  }

  $scope.trustlinesPageLoad = function () {
    if (!$scope.walletAccount) return;
    $scope.trustlines = $scope.walletAccount._lines;
    if ($scope.trustlines) {
      $scope.accountLinesStatus = 'updated @ ledger: ' + $scope.walletAccount._lines_updated;
      $scope.linesStats();
    } else {
      if ($scope.inGatewayList($scope.activeAccount)) return; // do not auto-request trustlines for gateway issuer.
      if (!$scope.trustlines) $scope.accountLines();
    }
  }

  $scope.accountLines = function (callback) {
    if (!remote.isConnected()) return;
    if (typeof callback != 'function') callback = function (){};
    $scope.accountLinesStatus = 'refreshing...';
    var LINES = [];
    var page = 0;

    var ledger_index = remote._ledger_current_index - 1;

    var request = remote.requestAccountLines({account: $scope.activeAccount, ledger: ledger_index});
    request.callback(function handle_message(err, res) {
      var self = this;
      
      if (err) {
        if (err.remote) {
          var account = err.remote.account || err.remote.request.account;
          if (account != $scope.walletAccount._account_id) return;
          if (err.remote.error) $scope.accountLinesStatus = err.remote.error; 
        } else { $scope.accountLinesStatus = err.error;}          
      }
      if (res) { 
        if (res.account != $scope.activeAccount) return;
        var account = res.account;
        var lines = res.lines;
        LINES = LINES.concat(lines);

        page++;
        
        if (res.marker) {
          $scope.accountLinesStatus = 'requesting page #' + (page + 1) + ' ...';
          self.message.marker = res.marker;
          self.requested = false;
          self.callback(handle_message);
          return;
        }

        $scope.accountLinesStatus = 'Updated @ ledger:' + ledger_index;

        $scope.trustlines = LINES;
        $scope.walletAccount._lines = LINES;
        $scope.walletAccount._lines_updated = ledger_index;
        $scope.linesStats();
      }
      callback(err, res);
      $scope.$apply();          
    });
  }
  
  $scope.lineBalanceFloat = function (line){
    return parseFloat(line.balance);
  }

  $scope.linesStats = function () {
    $scope.trustlinesStats = null;
    
    var lines = $scope.trustlines;
    var total = 0;

    var stats = {};
    for (var i=0; i < lines.length; i++) {
      var currency = lines[i].currency;
      var balance = parseFloat(lines[i].balance);
      if (!stats.hasOwnProperty(currency)) stats[currency] = {balance: 0, lineNumber: 0};
      stats[currency].balance += balance;
      stats[currency].lineNumber++;
      total++;
    }

    $scope.totalTrustlines = total;
    $scope.trustlinesStats = stats;
  }

  $scope.generateNewSecret = function () {
    return  Seed.getRandom().to_json();
  }

  $scope.prepareGenerateAccount = function (options) {
    if (!options) options = {};
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-generate-account.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (new_options) {
      var secret = new_options.secret;
      var index = Number(new_options.index) || 0;

      if (secret) {
        var key = undefined;
        var seed = Seed.from_json(secret);
        if (seed.is_valid()) {
          key = seed.get_key(index);  
        } else {
          key = KeyPair.from_json(secret);
        }
        if (!key || !(key.is_valid())) return;
        options.secret = secret;
        options.index = index;
        options.address = key.to_address_string();
      }
      
    }, function () {
      // do nothing; 
    });    
  }

  $scope.prepareSetWalletAccount = function (options) {
    if (!options) options = {};
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-set-wallet-account.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }      
    });

    modalInstance.result.then(function (options) {
      $scope.setWalletAccount(options);
    }, function () {
      // do nothing; 
    });    
  }

  $scope.setWalletAccount = function (options) {
    var account = options.address;
    var secret = options.secret;

    if (!account) return;

    if (!$scope.walletAccount || $scope.walletAccount._account_id != account) {
      if ($scope.walletAccount) {
        $scope.walletAccount.removeListener('entry', $scope.updateAccountInfo);
        $scope.walletAccount.removeListener('transaction', $scope.handleTransaction);
      }
      $scope.accountInfoReset();
      $scope.trustlinesReset();
      $scope.accountOffers = {};      
      $scope.transactionHistoryStatus = '';

      $scope.activeAccount = account;
      $scope.walletAccount = $scope.remote.account(account);
      if (secret) $scope.setWalletSecret({secret: secret});

      $scope.addAccountHistory($scope.activeAccount);      
      $scope.accountInfo();
      $scope.trustlinesPageLoad();

      $scope.walletAccount.on('entry', $scope.updateAccountInfo);
      $scope.walletAccount.on('transaction', $scope.handleTransaction);
    }
  }

  $scope.prepareSetWalletSecret = function (options) {
    if (!options) options = {};

    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-set-wallet-secret.html',
      controller: 'ModalCtrl',
      resolve: {
        options: function () {
          return options;
        }
      }      
    });

    modalInstance.result.then(function (options) {
      $scope.setWalletSecret(options);
    }, function () {
      // do nothing; 
    });    
  }

  $scope.secrets = {};
  $scope.setWalletSecret = function (options) {
    if (!options || !options.secret) return;
    options.account = $scope.activeAccount;
    $scope.setSecret(options);
  }

  $scope.setSecret = function (options) {
    var secret = options.secret;
    var account = options.account;
    if (Seed.is_valid(secret)) {
      remote.setSecret(account, secret);
    } else if (KeyPair.is_valid(secret)) {
      // remove existing secrets
      delete remote.secrets[account];
      remote.setKey(account, secret)
    }
    $scope.secrets[account] = secret;
  }

  $scope.addAccountHistory = function (address) {
    var i = $scope.accountHistory.indexOf(address);
    if (i >= 0) $scope.accountHistory.splice(i, 1);
    $scope.accountHistory.unshift(address);
    if ($scope.accountHistory.length > HISTORY_MAX) $scope.accountHistory.splice(HISTORY_MAX);
  }

  $scope.currencyName = function (currency) {
    return Currency.from_json(currency).to_human();
  }
 
  $scope.amountDisplay = function (amount, opts) {
    if (!opts) opts = { value: true, currency: true, issuer: true, gatewayName: true};

    var options = {max_sig_digits: opts.max_sig_digits || 6};

    if (APPLY_INTEREST) {
      options.reference_date = new Date();  
    }

    if (!(amount instanceof Amount)) amount = Amount.from_json(amount);
    amount = amount.to_human_full(options).split('/');

    var value = amount[0];
    var currency = amount[1];
    var issuer = amount[2];

    if (opts.issuer && opts.gatewayName) issuer = $scope.gatewayName(issuer, opts.sliced);

    var result = '';

    result += opts.value ? value : ''; 
    result += opts.currency ? ' ' + currency : ''; 
    result += opts.issuer ? (issuer ? '.' + issuer : '') : '';

    return result;
  }

  // =============== federation protocol =======================

  $scope.federationReset = function () {
    $scope.Payment.federation = {};
    $scope.federationQuoteReset();
    $scope.Payment.federation.resolving = false;
    $scope.Payment.federation.status = '';
  }
  $scope.federationQuoteReset = function () {
    $scope.Payment.destination = '';
    $scope.Payment.destinationTag = '';
    $scope.Payment.invoiceID = '';
    $scope.Payment.amountCurrency = '';
    $scope.Payment.amountValue = '';
    $scope.Payment.amountIssuer = '';

    $scope.Payment.federation.quoteStatus = '';
    $scope.Payment.federation.quoteStatusDetail = '';
  }

  $scope.federationQuote = function () {
    $scope.federationQuoteReset();
    var fed_address = $scope.Payment.federationAddress;
    var quote_url = $scope.Payment.federation.quoteUrl;
    var domain = $scope.Payment.federation.domain;
    var destination = $scope.Payment.federation.destination;
    var amount = $scope.Payment.federation.quoteAmount + '/' + $scope.Payment.federation.quoteCurrency;

    function format_params (params) {
      var str = '';
      
      for (var key in params) {
        if (!params[key]) continue;
        if (str.length > 0) str += '&';
        str += key + '=' + encodeURIComponent(params[key]);
      }
      return str;
    }

    var data = {
      type: 'quote',
      domain: domain,
      destination: destination,
      amount: amount,
      source: $scope.activeAccount
    } 

    var fields = $scope.Payment.federation.extraFields;
    if (fields) {
      for (var i=0; i<fields.length; i++) {
        data[fields[i].name] = fields[i].value;
      }  
    }

    $scope.Payment.federation.quoteStatus = 'Quoting...';
    
    $http.get(quote_url + '?' + format_params(data))
    .success(function(res){
      if (fed_address != $scope.Payment.federationAddress) return;
      $scope.Payment.federation.quoteStatusDetail = res;
      if (res.result == 'success' && res.quote && res.quote.send){
        var expires = new Date(res.quote.expires * 1000) // 946684800;
        $scope.Payment.federation.quoteStatus = 'Success!... This quotation is valid till: ' + expires.toLocaleString() ;
        $scope.Payment.destination = res.quote.destination_address || res.quote.address;
        $scope.Payment.destinationTag = res.quote.destination_tag;
        $scope.Payment.invoiceID = res.quote.invoice_id; 
        $scope.Payment.amountCurrency = res.quote.send[0].currency;
        $scope.Payment.amountValue = res.quote.send[0].value;
        $scope.Payment.amountIssuer = res.quote.send[0].issuer;
        $scope.pathFindStart();
      } else if (res.result == 'error' || res.error){
        $scope.Payment.federation.quoteStatus = 'Error:' + res.error_message || res.error;
      }
    }).error(function(err){
      if (fed_address != $scope.Payment.federationAddress) return;
      $scope.Payment.federation.quoteStatus = err;
    })

  }

  $scope.resolveRippleName = function (ripplename){

    var auth_url = 'https://id.ripple.com/v1/authinfo';

    $http.get(auth_url + '?username=' + ripplename)
    .success(function(res){
      if (ripplename != $scope.Payment.federationAddress) return;
      $scope.Payment.federation.status = res;
      
      if (res.exists) {
        $scope.Payment.destination = res.address;
        $scope.Payment.federation.status = 'Done.';          
      } 
      else $scope.Payment.federation.status = 'ripplename not exists.';
    }).error(function(err){
      if (ripplename != $scope.Payment.federationAddress) return;
      $scope.Payment.federation.status = 'Error resolving ripplename.';
      $scope.Payment.federation.resolving = false;
    })


  }

  $scope.resolveFederation = function () {
    $scope.Payment.federation.resolving = true;
    $scope.Payment.federation.status = 'resolving...';
    var fed_address = $scope.Payment.federationAddress;

    if (fed_address[0] == '~') return $scope.resolveRippleName(fed_address); 

    var domain_split = fed_address.search(/@([\w-]+\.)+[\w-]{2,}$/);       
    if (domain_split <= 0) return federation_end('Invalid Address.');
    var domain = $scope.Payment.federation.domain = fed_address.slice(domain_split + 1);
    var destination = $scope.Payment.federation.destination = fed_address.slice(0, domain_split)

    function parse(txt) {
      txt = txt.replace('\r\n', '\n');
      txt = txt.replace('\r', '\n');
      txt = txt.split('\n');
  
      var currentSection = "", sections = {};

      for (var i = 0, l = txt.length; i < l; i++) {
        var line = txt[i];
        if (!line.length || line[0] === '#') {
          continue;
        }
        else if (line[0] === '[' && line[line.length - 1] === ']') {
          currentSection = line.slice(1, line.length - 1);
          sections[currentSection] = [];
        }
        else {
          line = line.replace(/^\s+|\s+$/g, '');
          if (sections[currentSection]) {
            sections[currentSection].push(line);
          }
        }
      }
      return sections;
    }

    function federation_end (message) {
      if (fed_address != $scope.Payment.federationAddress) return;
      $scope.Payment.federation.status = message;       
      $scope.Payment.federation.resolving = false;
    }

    function RippleTxt (i, callback) {
        var subdomain = ['', 'www.', 'ripple.'];
        function rippleTxtSuccess(res) {
          if (fed_address != $scope.Payment.federationAddress) return;
          callback(res)
        }
        function rippleTxtFailed (){
          federation_end('Error: ripple.txt Not Found.')
        }
        $http.get('https://' + subdomain[i] + domain + '/ripple.txt')
        .success(rippleTxtSuccess)
        .error(function() {
          if (i < subdomain.length - 1) return RippleTxt(i+1, callback);
          else rippleTxtFailed(); 
        });
    }

    function federation_check (fed_url) {
        $http.get(fed_url + '?type=federation&destination=' + destination + '&domain=' + domain)
        .success(function (res){
          if (fed_address != $scope.Payment.federationAddress) return; 
          if (res.federation_json) {
            var fedjson = res.federation_json;
            if (fedjson.destination_address) {
              $scope.Payment.destination = fedjson.destination_address;
              $scope.Payment.destinationTag = fedjson.dt;
              $scope.Payment.federation.status = 'Done.';

            } else if (fedjson.quote_url){
              $scope.Payment.federation.status = 'Quotation Required.';
              $scope.Payment.federation.quoteUrl = fedjson.quote_url;
              $scope.Payment.federation.quoteRequired = true; 

              var currencies = fedjson.currencies;               
              if (currencies && currencies[0]){
                $scope.Payment.federation.quoteCurrencies = currencies;
                $scope.Payment.federation.quoteCurrency = currencies[0].currency;
                $scope.Payment.federation.quoteIssuer = currencies[0].issuer;
              }
              if (fedjson.extra_fields) $scope.Payment.federation.extraFields = fedjson.extra_fields;
            }
          } else if (res.result == 'error') {
            federation_end('Error: ' + res.error_message || res.error);
          }
        }).error(function (){
          federation_end('Failed.')
        });
    }

    RippleTxt(0, function (txt){
      txt = parse(txt);
      if (txt['federation_url'] && txt['federation_url'][0]) {
        var fed_url = txt['federation_url'][0];
        federation_check(fed_url);
      } else { 
        federation_end('Federation Service Not Found.')
      }
    });     

  }

  $scope.setRecipient = function (contact) {
    $scope.federationReset();
    $scope.Payment.destinationTag = undefined;
    var recipient = $scope.Payment.recipient;

    function isFederation (str) {
        // ripplename;
        if (/^~[a-zA-Z0-9]([\-]?[a-zA-Z0-9]){0,19}$/.test(str)) return true;
 
        // checking for email type address (e.g.xyz@domain.com)
        var domain_split = str.search(/@([\w-]+\.)+[\w-]{2,}$/);       
        if (domain_split <= 0) return false;
        return true;      
    }

    if ($scope.isValidAddress(recipient)) {
      $scope.Payment.destination = recipient;
      if (contact && (contact.destinationTag !== undefined || contact.dtag !== undefined) ) {
         $scope.Payment.destinationTag = contact.destinationTag || contact.dtag;
      }
      $scope.getRecipientCurrencies();
    } 
    if (isFederation(recipient)) {
      $scope.Payment.federationAddress = recipient;
      $scope.resolveFederation();
    }
  }

  $scope.isValidAddress = function (address) {
    return UInt160.is_valid(address);
  }

  $scope.isRipplename = function (address) {
    return /^~[a-zA-Z0-9]([\-]?[a-zA-Z0-9]){0,19}$/.test(address);
  }

  $scope.isFederation = function (address) {
    // checking for email type address (e.g.xyz@domain.com)
    return address.search(/@([\w-]+\.)+[\w-]{2,}$/) > 0;  
  }

  // =========== Path Finding ===============================
  $scope.pathFindAutoStart = function (){
    if ($scope.pathFind) $scope.pathFindClose();
    $scope.Payment.pathOpts = null;
    $scope.Payment.paths = null;

    $scope.Payment.sendmaxValue = '';
    $scope.Payment.sendmaxCurrency = '';
    $scope.Payment.sendmaxIssuer = '';

    var shouldStart = ($scope.Payment.destination &&
                        $scope.Payment.amountValue &&
                        $scope.Payment.amountCurrency && 
                        ($scope.Payment.amountIssuer || $scope.Payment.amountCurrency == 'XRP')
                      ); 

    if (shouldStart) $scope.pathFindStart();
  }

  $scope.pathFindStart = function (options) {
    if ($scope.pathFind) $scope.pathFindClose();
    var payment = $scope.Payment

    var sourceCurrencies = [];
    if (payment.pathFindSeparateIssuer) {
      var lines = $scope.trustlines;
      if (lines) {
        var len = lines.length;
        if (len > 15) {
          // if there's too many trustlines, take 15 highest balance.
          lines.sort(function (a,b) {return b.balance - a.balance});
          len = 15;
        }
        sourceCurrencies.push({currency: 'XRP'});
        for (var i = 0; i < len; i++) {
          sourceCurrencies.push({
            currency: lines[i].currency,
            issuer: lines[i].account
          });
        }
      } else {
        if (!options || !options.lines_updated) {
          // delay untill trustlines updated.
          $scope.Payment.pathFindStatus = 'checking source currencies...'
          $scope.accountLines(function (){
            $scope.pathFindStart({lines_updated: true});
          });
          return;          
        } 
      }     
    }

    var AMOUNT = payment.amountCurrency == 'XRP'? 
                   String(Math.round(Number(payment.amountValue) * 1e6)) :
                   { 
                     value: payment.amountValue,
                     currency: payment.amountCurrency,
                     issuer: payment.amountIssuer  
                   } 

    $scope.sourceCurrencies = sourceCurrencies;
    var counter = 0;
    var pathfind = $scope.pathFind = remote.pathFind({
      src_account: $scope.activeAccount,
      dst_account: payment.destination,
      dst_amount: Amount.from_json(AMOUNT),
      src_currencies: sourceCurrencies.length ? sourceCurrencies : undefined
    })

    pathfind.on('error', function(msg){ 
      if (payment != $scope.Payment) return pathfind.close();
      $scope.Payment.pathFindStatus = 'Error: ' + msg.error;
    });

    pathfind.on("update", function(msg) {
      if (payment != $scope.Payment) return pathfind.close();         
      var path_opts = msg.alternatives;
      if (!path_opts || !path_opts.length) $scope.Payment.pathFindStatus = 'No Path Found!';
      else { 
        try { path_opts = JSON.parse(path_opts)} catch (e) {};
        $scope.Payment.pathFindRes = path_opts;
        $scope.Payment.pathFindStatus = 'Path_Finding Response:' + counter++;
        $scope.Payment.pathOpts = path_opts;
        if (counter > PATHFIND_MAX) {
          $scope.pathFindClose();
        }
      }
      $scope.$apply();
    })

    $scope.Payment.pathFindStatus = 'Finding Paths...';
    return pathfind;
  }

  $scope.pathFindClose = function () {
    if (!$scope.pathFind) return;
    $scope.Payment.pathFindStatus = 'Path_Finding Stopped.'
    $scope.pathFind.removeAllListeners();
    $scope.pathFind.close();
    $scope.pathFind = null;
  }

  $scope.setPaths = function (paths) {
    $scope.Payment.paths = paths;
  }

  // ============= payment ==============================
  $scope.pay = function (opts) {
    $scope.payto = {
      destination: opts.destination || opts.account || opts.address,
      destinationTag: (typeof opts.destinationTag == 'number') ? opts.destinationTag : opts.dtag,
      amountValue: opts.amount || opts.value || opts.amountValue,
      amountCurrency: opts.currency || opts.amountCurrency,
    };
    $scope.tabActive['Payment'] = true;
  }

  $scope.getRecipientCurrencies = function () {
    $scope.Payment.recipientCurrencies = ['XRP'];
    var account = $scope.Payment.destination;
    if (! account) return;
    remote.requestAccountCurrencies({account: account}, function (err, res) {
      if (account !== $scope.Payment.destination) return;
      if (res) $scope.Payment.recipientCurrencies = $scope.Payment.recipientCurrencies.concat(res.receive_currencies);
    }); 
  }

  $scope.setSendmax = function (amount) {
    var multiplier = 1 + $scope.Payment.slipage / 100;
    if (amount.value) {
      if (amount.currency == 'XRP' && $scope.Payment.amountCurrency == 'XRP') multiplier = 1;
      $scope.Payment.sendmaxValue = String(amount.value * multiplier);
      // $scope.Payment.sendmaxValue = amount.value;
      $scope.Payment.sendmaxCurrency = amount.currency;
      $scope.Payment.sendmaxIssuer = amount.issuer;
    } else {
      if ($scope.Payment.amountCurrency == 'XRP') multiplier = 1;
      $scope.Payment.sendmaxValue = String(amount/1000000 * multiplier);
      // $scope.Payment.sendmaxValue = amount/1000000;
      $scope.Payment.sendmaxCurrency = 'XRP';
    }
  }

  $scope.submitPayment = function () {
    var payment = $scope.Payment;

    var xrp_to_xrp = payment.amountCurrency == 'XRP' && (!payment.sendmaxCurrency || payment.sendmaxCurrency == 'XRP');

    var AMOUNT = payment.amountCurrency == 'XRP'? 
                   Math.round(Number(payment.amountValue) * 1e6) :
                   { 
                     value: payment.amountValue,
                     currency: payment.amountCurrency,
                     issuer: payment.amountIssuer  
                   }               

    var SENDMAX = (payment.sendmaxCurrency == 'XRP') ?
                   Math.round(Number(payment.sendmaxValue) * 1e6) :
                   { 
                     value: payment.sendmaxValue,
                     currency: payment.sendmaxCurrency,
                     issuer: payment.sendmaxIssuer  
                   }               

    var transaction = remote.transaction();

    transaction.payment({
      to: payment.destination,
      from: $scope.activeAccount,
      amount: AMOUNT
    });

    transaction.tx_json.Amount = AMOUNT;

    if (payment.destinationTag != undefined) transaction.tx_json.DestinationTag = Number(payment.destinationTag);
    if (payment.sourceTag != undefined) transaction.tx_json.SourceTag = Number(payment.sourceTag);
    if (payment.invoiceID) transaction.tx_json.InvoiceID = payment.invoiceID;
    
    if (!xrp_to_xrp) {
      if (payment.tfNoDirectRipple) transaction.setFlags('NoRippleDirect');
      if (payment.tfLimitQuality) transaction.setFlags('LimitQuality');
      if (payment.tfPartialPayment) {
        transaction.setFlags('PartialPayment');
        if (payment.deliverMin) {
          transaction.tx_json.DeliverMin = payment.amountCurrency == 'XRP'? 
                     Math.round(Number(payment.deliverMin) * 1e6) :
                     { 
                       value: payment.deliverMin,
                       currency: payment.amountCurrency,
                       issuer: payment.amountIssuer  
                     }
        }
      }
      if (payment.sendmaxValue) transaction.tx_json.SendMax = SENDMAX;
      if (payment.paths && payment.paths.length) transaction.tx_json.Paths = payment.paths;
    }

    if (payment.memo) {
      transaction.addMemo({
        memoData: payment.memo
      })
    }
    if (payment.memos) {
      var memos = payment.memos;
      for (var i = 0; i < memos.length; i++)  {
        transaction.addMemo(memos[i]); 
      }
    }

    var alert = {description: 'Sending ' + payment.amountValue + ' ' + payment.amountCurrency + ' to ' + payment.destination};
    $scope.alerts.payment.push(alert);
    $scope.submitTransaction({transaction:transaction, log: alert}, function (err, res){
      if (err && err.remote) {
        alert.result = err.remote.error + ': ' + err.remote.error_exception;
      }
      if (res && res.metadata) {
        var delivered = res.metadata.DeliveredAmount;
        if (!delivered) delivered = res.tx_json.Amount;
        alert.result += ', Delivered Amount = ' + $scope.amountDisplay(delivered, {value:true, currency:true});
      }
    });
  }

  $scope.paymentReset = function (){
    var advanceMode = $scope.Payment.advanceMode;
    $scope.Payment = {
      slipage: $localStorage.slipage,
      advanceMode: advanceMode,
    };
    if ($scope.payto) {
      Object.keys($scope.payto).forEach(function (key) {
        $scope.Payment[key] = $scope.payto[key];  
      })
      if (!advanceMode) {
        $scope.Payment.recipient = $scope.Payment.destination;
        $scope.setRecipient($scope.payto);
      }
      $scope.payto = undefined;
    }
  }

  // =================== transaction submission ===================================

  $scope.submitTransaction = function (options, callback) {
    if (typeof callback != 'function') callback = function (){};

    var transaction = options.transaction;
    var tx_log = options.log; 
    
    tx_log.status = '';
    tx_log.result = '';
    tx_log.summary = '';
    tx_log.tx_hash = '';

    transaction.on('submitted', function (msg) {    
      tx_log.status = 'PRELIMINARY';
      tx_log.result = msg.engine_result + ': ' + msg.engine_result_message;
      $scope.$apply();          
    })
    
    transaction.on('presubmit', function (msg) {
      if (!transaction.attempts) tx_log.status  = 'submitting...';
      else tx_log.status  = 'resubmitting...';
    })

    tx_log.status  = 'PREPARE';

    if (INSERT_CLIENT_INFO) {
      transaction.addMemo({memoType: 'client', memoData: CLIENT_VERSION});
    }

    transaction.submit(function(err, res){
      tx_log.status = 'FINAL';
      tx_log.status_code = err ? err.result : res.engine_result;
      tx_log.summary = transaction.summary();
      tx_log.result = tx_log.summary.result.engine_result;
      tx_log.tx_hash = tx_log.summary.result.transaction_hash;
      callback(err, res)
    });
   
  }

  // =========== Adding Memos ==================================

  $scope.clearMemos = function (tx) {
    delete tx.memos;
  }

  $scope.deleteMemo = function (tx, memo) {
    if (tx.memos) {
       var index = tx.memos.indexOf(memo);
       if (index > -1) tx.memos.splice(index, 1);
    }
  }

  $scope.clearMemo = function () {
    $scope.memoType='';
    $scope.memoFormat='';
    $scope.memoData='';
  }

  // ============= modal add memo ==============================
  $scope.prepareMemo = function (tx) {

    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-add-memo.html',
      controller: 'ModalAddMemoCtrl',
    });

    modalInstance.result.then(function (memo) {
      if (!tx.hasOwnProperty('memos')) tx.memos = [];
      tx.memos.push(memo);
    }, function () {
      // do nothing; 
    });
  };


  // =============  modal Set Signer List =====================
  $scope.prepareSetSignerList = function (callback) {
    var options = {
      signers: [],
      weightSum: function () {
        var sum = 0;
        for (var i=0; i<options.signers.length; i++) {
          sum += options.signers[i].weight;
        }
        return sum;
      }
    }

    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-set-signer-list.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }       
      }       
    });

    modalInstance.result.then(function (options) {
      if (typeof callback == 'function') return callback(options);
      $scope.setSignerList(options);
    }, function () {
      // do nothing; 
    });
  };

  $scope.setSignerList = function (options) {
      var transaction = remote.transaction();    
      transaction.signerListSet({
        account: $scope.activeAccount,
        signers: options.signers,
        quorum: options.quorum
      });

      if (options.memos) {
        var memos = options.memos;
        for (var i = 0; i < memos.length; i++)  {
          transaction.addMemo(memos[i]); 
        }
      }

      var alert = {description: 'Set SignerList'};
      $scope.alerts.account.push(alert);
      $scope.submitTransaction({transaction:transaction, log: alert});
  }

  // =============  modal Set RegularKey =====================
  $scope.regularKey = '';

  $scope.prepareSetRegularKey = function (options) {

    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-set-regularkey.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }       
    });

    modalInstance.result.then(function (options) {
      $scope.setRegularKey(options);
    }, function () {
      // do nothing; 
    });
  };

  $scope.setRegularKey = function (options) {
      var transaction = remote.transaction();    
      transaction.setRegularKey({
        account: $scope.activeAccount,
        regular_key: options.regularKey
      });

      if (options.memos) {
        var memos = options.memos;
        for (var i = 0; i < memos.length; i++)  {
          transaction.addMemo(memos[i]); 
        }
      }
      var alert = {description: 'Set RegularKey'};
      $scope.alerts.account.push(alert);
      $scope.submitTransaction({transaction:transaction, log: alert});
  }
   
  //  ================== Account Set ============================================

  $scope.prepareAccountSet = function (options) {
    if (typeof options != 'object') options = {};
    if (!options.modal) options.modal = 'info';

    options.set_clear_flags = {
      asfRequireDest: 1,
      asfRequireAuth: 2,
      asfDisallowXRP: 3,
      asfDisableMaster: 4,
      asfAccountTxnID: 5, // not implemented yet?
      asfNoFreeze: 6,
      asfGlobalFreeze: 7,
      asfDefaultRipple: 8
    };

    var templates = {
      info: 'templetes/modal-account-set.html',
      flags: 'templetes/modal-account-flags.html',
    }

    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: templates[options.modal],
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }      
    });

    modalInstance.result.then(function (newSettings) {
      $scope.accountSet(newSettings);
    }, function () {
      // do nothing
    });
  };


  $scope.accountSet = function (settings) {

    if (typeof settings != 'object') return;

    var options = {
      account: $scope.activeAccount
    }
    if (settings.flagSetClear && settings.actionSetClear == 'set') options.set_flag = settings.flagSetClear;
    if (settings.flagSetClear && settings.actionSetClear == 'clear') options.clear_flag = settings.flagSetClear;

    var transaction = remote.transaction();
    transaction.accountSet(options);

    if (settings.editTransferRate) {
      var rate = settings.transferRateHumanPercentage ? Number(settings.transferRateHumanPercentage) : 0;
      if (rate > 0) rate = Math.round(rate / 100 * 1e9 + 1e9); 
      transaction.setTransferRate(rate);
    }

    if (settings.editDomain) {
      var domain = settings.domain ? settings.domain : '';
      var domain_hex = '';
      if (domain !== "") {
        domain = domain.trim();
        domain = domain.toLowerCase();
        domain_hex = ripple.utils.stringToHex(domain);
      } 
      
      transaction.tx_json.Domain = domain_hex;
    }

    if (settings.editEmail) {
      var email = settings.email ? settings.email : '';
      email = email.trim();
      email = email.toLowerCase();

      var email_hash = "00000000000000000000000000000000";
      if (email !== "") {
          email_hash = CryptoJS.MD5(email).toString();
          email_hash = email_hash.toUpperCase();
      }
      transaction.tx_json.EmailHash = email_hash;
    }

    if (settings.editMessageKey) {
      transaction.tx_json.MessageKey = settings.messageKey ? settings.messageKey : '';
    }

    if (settings.editTickSize) {
      transaction.tx_json.TickSize = settings.tickSize ? settings.tickSize : 0;
    }

    if (settings.memos) transaction.tx_json.Memos = settings.memos;   

    var alert = {description: 'Account Set'};
    $scope.alerts.account.push(alert);
    $scope.submitTransaction({transaction:transaction, log: alert});
  }

  //  ================== Add or Edit Trustlines. ================================
  $scope.editTrustline = function (line) {
    var settings = JSON.parse(JSON.stringify(line)); // make a copy.

    settings.quality_in_human = line.quality_in ? line.quality_in / 1e9 : 0;
    settings.quality_out_human = line.quality_out ? line.quality_out / 1e9 : 0;
    settings.edit = true;

    $scope.prepareSetTrust(settings);
  }

  $scope.addTrustline = function () {
    var settings = {
      edit: false,
      no_ripple: true,
      quality_in_human: 0,
      quality_out_human: 0
    }
    $scope.prepareSetTrust(settings);
  }
  
  $scope.prepareSetTrust = function (options) {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-set-trust.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (newSettings) {
      $scope.setTrust(newSettings);
    }, function () {
      // do nothing
    });

  }

  $scope.setTrust = function (settings) {

    var options = {
      account: $scope.activeAccount,
      limit: {
        currency: settings.currency,
        issuer: settings.account,
        value: settings.limit
      },
      quality_in: Math.round(settings.quality_in_human * 1e9),   
      quality_out: Math.round(settings.quality_out_human * 1e9)     
    }

    var transaction = remote.transaction();
    transaction.trustSet(options);

    var flags = [];
    if (settings.setAuth) flags.push('SetAuth');
    if (settings.no_ripple) flags.push('SetNoRipple'); 
      else flags.push('ClearNoRipple');
    if (settings.freeze) flags.push('SetFreeze');
      else flags.push('ClearFreeze');

    transaction.setFlags(flags);    

    var alert = {description: 'Trustline setting for ' + settings.currency + '.' + settings.account};
    $scope.alerts.trustline.push(alert);
    
    $scope.submitTransaction({transaction:transaction, log: alert});
  }

  // ===================== Charting ===============================
  $scope.drawMarketDepth = function () {
    var currency = $scope.trading.baseCurrency;
    var bids = $scope.trading.bidOffers;
    var asks = $scope.trading.askOffers;

    var data_bids = [];
    var data_asks = [];

    if (bids.length) {
      var price_min = $scope.offerPriceToHuman(bids[0]) / 1.3;
      for (var i = 0; i < bids.length; i++) {
        var price = $scope.offerPriceToHuman(bids[i]);
        if (price < price_min) break;
        data_bids.push([price, $scope.offerPaysFundedToHuman(bids[i], true)])
      }
    }

    if (asks.length) {
      var price_max = $scope.offerPriceToHuman(asks[0], true) * 1.3;
      for (var i = 0; i < asks.length; i++) {
        var price = $scope.offerPriceToHuman(asks[i], true);
        if (price > price_max) break;
        data_asks.push([price, $scope.offerGetsFundedToHuman(asks[i], true)])
      }
    }

    $scope.trading.mdchart = new Highcharts.Chart({
      chart: {
        type: 'area',
        renderTo: 'container2',
        animation: false,
      },
      title: {
        text: null,
        margin: 0
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'logarithmic',
        allowDecimals: true,
        title: {
          text: 'Price'
        },
      },
      yAxis: {
        title: {
          text: 'Volume'
        },
        opposite: true,
      },
      tooltip: {
        headerFormat: 'price: {point.x} <br>',
        pointFormat: 'volume: {point.y} ' + currency,
      },
      plotOptions: {
        area: {
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        },
        series: {
          animation: false,
        }
      },
      series: [{ name: 'bids', data: data_bids, color:'#5cb85c' }, { name: 'asks', data: data_asks, color:'#d9534f' }]
    });
  }

  $scope.drawChart = function (){

    var data = $scope.trading.chartData;
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length;
        
    for (var i = 0; i < dataLength; i += 1) {
        ohlc.push([
          Date.parse(data[i]['start']),
          Number(data[i]['open']),
          Number(data[i]['high']),
          Number(data[i]['low']),
          Number(data[i]['close']),
        ]);

        volume.push([
          Date.parse(data[i]['start']),
          Number(data[i]['base_volume']),
        ]);
    }
    //ohlc.sort(function(a,b){return a[0] - b[0]})
    //volume.sort(function(a,b){return a[0] - b[0]})

    // set the allowed units for data grouping
    var groupingUnits = [[
            'minute',         
            [15, 30]  
        ], [
            'hour',               
            [1, 2, 4, 8, 12]            
        ], [
            'day',                        
            [1, 3,]                             
        ], [
            'week',
            [1, 2]  
        ], [
            'month',
            [1]
        ]];

    Highcharts.setOptions({
        global: {
            timezoneOffset: new Date().getTimezoneOffset()
        }
    });

    $scope.trading.chart = new Highcharts.StockChart({
            chart: {
                  renderTo: 'container'
               },
               
            rangeSelector: {
                selected: 1,
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1d'
                  }, {
                    type: 'day',
                    count: 3,
                    text: '3d'
                  }, {
                    type: 'week',
                    count: 1,
                    text: '1w'
                  }, {
                    type: 'week',
                    count: 2,
                    text: '2w'
                  }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                  }, {
                    type: 'all',
                    text: 'All'
                  }

                ]
            },

            xAxis: {
                type:'datetime',
                crosshair: {
                  snap: true
                }
            },

            yAxis: [{
                type: 'logarithmic',
                crosshair: {
                  snap: false
                },                
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Price'
                },
                height: '73%',
                lineWidth: 1
            }, {
                type: 'linear',                
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top: '75%',
                height: '25%',
                offset: 0,
                lineWidth: 1
            }],

            series: [{
                type: 'candlestick',
                name: $scope.trading.baseCurrency + '/' + $scope.trading.tradeCurrency,
                data: ohlc,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }]
      });
  }

  $scope.prepareChart = function (options){
    if ($scope.network != 'MAIN') return $scope.trading.chartStatus = 'Historical chart not available for Test Net';

    var pair = $scope.trading.pair;

    $scope.trading.chartStatus = 'Loading data from ' + RIPPLE_DATA_URL + ' ......';

    var data_url = RIPPLE_DATA_URL + '/v2/exchanges/' + 
                      $scope.trading.baseCurrency + 
                      ($scope.trading.baseIssuer ? '+' + $scope.trading.baseIssuer : '') + '/' +
                      $scope.trading.tradeCurrency + 
                      ($scope.trading.tradeIssuer ? '+' + $scope.trading.tradeIssuer : '') + 
                      '?descending=true&result=tesSUCCESS' + 
                      '&interval=' + CHART_INTERVAL + 
                      '&limit=' + CHART_LIMIT + 
                      ((options && options.marker) ? '&marker=' + options.marker : '');
                     
    $http.get(data_url)
    .success(function(res){
      if (pair != $scope.trading.pair || $scope.network != 'MAIN') return;
      var data = res.exchanges;
      data.sort(function(a,b){return Date.parse(a.start) - Date.parse(b.start)});

      $scope.trading.chartData = data.concat($scope.trading.chartData);
      if ($scope.trading.chartPage == 0) $scope.drawChart();

      $scope.trading.chartPage++;
      
      if (res.marker && $scope.trading.chartPage < CHART_MAX_PAGE) $scope.prepareChart({marker: res.marker});
      else if ($scope.trading.chartPage > 1) $scope.drawChart(); 

      $scope.trading.chartStatus = '';

    }).error(function(err){
      if (pair != $scope.trading.pair) return;
      $scope.trading.chartStatus = 'Error: ' + err;
    })
  }

  // ================== trading ========================

  $scope.buyReset = function (){
    $scope.trading.buyPrice = null;
    $scope.trading.buyQuantity = null;
  }

  $scope.sellReset = function (){
    $scope.trading.sellPrice = null;
    $scope.trading.sellQuantity = null;
  }

  $scope.tradingReset = function () {
    $scope.buyReset();
    $scope.sellReset();
  }

  $scope.tradingBalancesRefresh = function () {
    if ($scope.trading.baseCurrency != 'XRP') {
      $scope.getBalance({
        currency: $scope.trading.baseCurrency,
        issuer: $scope.trading.baseIssuer,
      })
    }
    if ($scope.trading.tradeCurrency != 'XRP') {
      $scope.getBalance({
        currency: $scope.trading.tradeCurrency,
        issuer: $scope.trading.tradeIssuer,
      })
    }
  }

  $scope.getBalance = function (opts) {
    if (typeof opts != 'object') return;
    if (!opts.currency || !opts.issuer) return;
    opts.ledger = 'validated';
    opts.account = $scope.activeAccount;
    remote.requestRippleBalance(opts, function (err, res) {
      if (opts.account != $scope.activeAccount) return;
      if (err) {
        $scope.accountBalances.IOU[opts.currency + '.' + opts.issuer] = 0;
      } 
      if (res && res.account_balance) {
        $scope.accountBalances.IOU[opts.currency + '.' + opts.issuer] = res.account_balance.to_number();
      }
    })
  }

  $scope.orderBooksReset = function (){
    $scope.trading.bidOffers = [];
    $scope.trading.askOffers = [];
    $scope.trading.bid_status = '';
    $scope.trading.ask_status = '';
    $scope.trading.chartPage = 0;
    $scope.trading.chartData = [];
    try { 
      $scope.trading.chart.destroy(); 
      $scope.trading.mdchart.destroy();
    } catch (e) {};

    $scope.loadOrderBooks();
    $scope.prepareChart();
  }

  $scope.tradingPageLoad = function () {
    if (!$scope.trading.baseCurrency) $scope.setTradePair($scope.trading.pair);
    if (!$scope.accountOffers.offers) $scope.getAccountOffers();
  };

  $scope.pairName = function (pair, sliced) {
    var base = pair.split('/')[0]; 
    var trade = pair.split('/')[1];

    var baseCurrency = base.split('.')[0];
    var baseIssuer = base.split('.')[1];
    var tradeCurrency = trade.split('.')[0];
    var tradeIssuer = trade.split('.')[1];

    var pairname = baseCurrency + (baseIssuer ? '.' + $scope.gatewayName(baseIssuer, sliced) : '') + '/' +
                     tradeCurrency + (tradeIssuer ? '.' + $scope.gatewayName(tradeIssuer, sliced) : '');
    return pairname;                     
  }

  $scope.prepareTradePair = function (options) {
    if (!options) options = {};

    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-set-trade-pair.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (options) {     
      var pair = options.baseCurrency + (options.baseIssuer ? '.' + options.baseIssuer : '') + '/' + options.tradeCurrency + (options.tradeIssuer ? '.' + options.tradeIssuer : '');
      if (options.edit && (typeof options.index === 'number')) {
        $scope.tradepairs[options.index] = pair;
      }
      if (options.set && pair != $scope.trading.pair) $scope.setTradePair(pair);
    }, function () {
      // do nothing
    });
  }

  $scope.setTradePair = function (pair){
    $scope.trading.pair = pair;

    // swap position to the top of tradepairs-list.
    var i = $scope.tradepairs.indexOf(pair);
    if (i >= 0) $scope.deleteTradePair(i);
    $scope.tradepairs.unshift(pair);

    var base = pair.split('/')[0]; 
    var trade = pair.split('/')[1];

    $scope.trading.baseCurrency = base.split('.')[0];
    $scope.trading.baseIssuer = base.split('.')[1];
    $scope.trading.tradeCurrency = trade.split('.')[0];
    $scope.trading.tradeIssuer = trade.split('.')[1];

    $scope.tradingBalancesRefresh();
    $scope.orderBooksReset();
    $scope.tradingReset();     
  }

  $scope.flipTradePair = function (){
    var currencies = $scope.trading.pair.split('/'); 
    $scope.setTradePair(currencies[1] + '/' + currencies[0]);
  }

  $scope.offerPriceToHuman = function (offer, isAskOffer) {
    if (!offer) return false;
    var quality = offer.quality;
    var tgets = offer.TakerGets || offer.taker_gets;
    var tpays = offer.TakerPays || offer.taker_pays;

    if (typeof tpays == 'string') quality = quality / 1000000;
    if (typeof tgets == 'string') quality = quality * 1000000;
    var price = (isAskOffer) ? Number(quality) : Number(1/quality);
    return price;
  }

  $scope.bidPrice = function (offer) {
    return $scope.offerPriceToHuman(offer);
  }
  $scope.askPrice = function (offer) {
    return $scope.offerPriceToHuman(offer, true);
  }

  $scope.offerGetsCurrency = function (offer) {
    var tgets = offer.TakerGets || offer.taker_gets;
    return (typeof tgets == 'object') ? tgets.currency : 'XRP';
  }
  $scope.offerPaysCurrency = function (offer) {
    var tpays = offer.TakerPays || offer.taker_pays;
    return (typeof tpays == 'object') ? tpays.currency : 'XRP';
  }    
  $scope.offerGetsIssuer = function (offer) {
    var tgets = offer.TakerGets || offer.taker_gets;
    return (typeof tgets == 'object') ? tgets.issuer : null;
  }
  $scope.offerPaysIssuer = function (offer) {
    var tpays = offer.TakerPays || offer.taker_pays;
    return (typeof tpays == 'object') ? tpays.issuer : null;
  }

  $scope.offerGetsToHuman = function (offer) {
    var tgets = offer.TakerGets || offer.taker_gets;
    var value = tgets.value ? tgets.value : tgets / 1000000
    return Number(value);
  }

  $scope.offerPaysToHuman = function (offer) {
    var tpays = offer.TakerPays || offer.taker_pays;
    var value = tpays.value ? tpays.value : tpays / 1000000
    return Number(value);
  }  

  $scope.offerGetsFundedToHuman = function (offer, sum) {
    var tgets = offer.TakerGets || offer.taker_gets;
    var funded = sum ? offer.taker_gets_funded_sum : offer.taker_gets_funded;
    var value = (typeof tgets == 'object') ? funded : funded / 1000000
    return Number(value);
  }

  $scope.offerPaysFundedToHuman = function (offer, sum) {
    var tpays = offer.TakerPays || offer.taker_pays;
    var funded = sum ? offer.taker_pays_funded_sum : offer.taker_pays_funded;
    var value = (typeof tpays == 'object') ? funded : funded / 1000000
    return Number(value);
  }  

  $scope.offerExpireHour = function (offer){
    if (!offer || !offer.expiration) return;
    var now = Date.now();    
    return (Utils.toTimestamp(offer.expiration) - now) / (60 * 60 * 1000);  // hours remaining.    
  }

  $scope.bidFilter = function (offer) {
    if ($scope.offerPaysCurrency(offer) == $scope.trading.baseCurrency &&
        $scope.offerPaysIssuer(offer) == $scope.trading.baseIssuer &&
        $scope.offerGetsCurrency(offer) == $scope.trading.tradeCurrency &&
        $scope.offerGetsIssuer(offer) == $scope.trading.tradeIssuer
      ) return true;
    return false;
  }

  $scope.askFilter = function (offer) {
    if ($scope.offerGetsCurrency(offer) == $scope.trading.baseCurrency &&
        $scope.offerGetsIssuer(offer) == $scope.trading.baseIssuer &&
        $scope.offerPaysCurrency(offer) == $scope.trading.tradeCurrency &&
        $scope.offerPaysIssuer(offer) == $scope.trading.tradeIssuer
      ) return true;
    return false;
  }

  $scope.getAccountOffers = function () {
    $scope.accountOffers = {};
    $scope.accountOffers.status = 'Refreshing...';

    var options = {
      account: $scope.activeAccount,
      ledger: "validated"
    };

    remote.requestAccountOffers (options, function (err, res){
      if (err) {
        if (err.remote) {
          var account = err.remote.account || err.remote.request.account;
          if (account != $scope.walletAccount._account_id) return;
          if (err.remote.error) {
            $scope.accountOffers.status = err.remote.error; 
          }
        } else { $scope.accountOffers.status = err.error; }
      }
      if (res) {
        if (res.account != $scope.activeAccount) return;
        $scope.accountOffers.status = 'Updated @ Ledger: ' + res.ledger_index;
        $scope.accountOffers.ledger_index = res.ledger_index;
        $scope.accountOffers.offers = res.offers;
      }
      $scope.$apply();
    })
  }

  $scope.prepareOfferEdit = function (options, raw_offer) {
    if (typeof options != 'object' || !options.offer || !options.type) return;

    var offer = options.offer;
    options.offer_sequence = offer.seq;
    options.qty = (options.type == 'sell') ? $scope.offerGetsToHuman(offer) : $scope.offerPaysToHuman(offer);
    options.price = $scope.offerPriceToHuman(offer, (options.type == 'sell'));

    if (raw_offer) {
      var tgets = $scope.offerGetsCurrency(offer);
      var tpays = $scope.offerPaysCurrency(offer);
      options.baseCurrency = (options.type == 'sell') ? tgets : tpays;
      options.tradeCurrency = (options.type == 'sell') ? tpays : tgets;
      var tgets_issuer = $scope.offerGetsIssuer(offer);
      var tpays_issuer = $scope.offerPaysIssuer(offer);
      options.baseIssuer = (options.type == 'sell') ? tgets_issuer : tpays_issuer;
      options.tradeIssuer = (options.type == 'sell') ? tpays_issuer : tgets_issuer;
    } else {
      options.baseCurrency = $scope.trading.baseCurrency;
      options.tradeCurrency = $scope.trading.tradeCurrency;
      options.baseIssuer = $scope.trading.baseIssuer;
      options.tradeIssuer = $scope.trading.tradeIssuer;
    }

    if (offer.expiration) {
      var now = Date.now();
      options.expiration = (Utils.toTimestamp(offer.expiration) - now) / (60 * 60 * 1000);  // hours remaining.
    }

    var modalInstance = $uibModal.open({
      size: 'sm',
      animation: false,
      templateUrl: 'templetes/modal-offer-edit.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (options) {
      $scope.offerCreate(options);
    }, function () {
      // do nothing
    });

  }

  $scope.prepareOfferCancel = function (options, raw_offer) {
    if (typeof options != 'object' || !options.offer || !options.type) return;

    var offer = options.offer;
    options.offer_sequence = offer.seq;
    options.qty = (options.type == 'sell') ? $scope.offerGetsToHuman(offer) : $scope.offerPaysToHuman(offer);
    options.price = $scope.offerPriceToHuman(offer, (options.type == 'sell'));

    if (raw_offer) {
      var tgets = $scope.offerGetsCurrency(offer);
      var tpays = $scope.offerPaysCurrency(offer);
      options.baseCurrency = (options.type == 'sell') ? tgets : tpays;
      options.tradeCurrency = (options.type == 'sell') ? tpays : tgets; 
    } else {
      options.baseCurrency = $scope.trading.baseCurrency;
      options.tradeCurrency = $scope.trading.tradeCurrency;
    }

    var modalInstance = $uibModal.open({
      size: 'sm',
      animation: false,
      templateUrl: 'templetes/modal-offer-cancel.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (options) {
      $scope.offerCancel(options.offer_sequence);
    }, function () {
      // do nothing
    });

  }


  $scope.offerCancel = function (seq){
    var transaction = remote.transaction();
    transaction.offer_cancel({
      account: $scope.activeAccount,
      offer_sequence: seq,
    });

    var alert = {description: 'Deleting offer seq-' + seq};
    $scope.alerts.trading.push(alert);
    $scope.alerts.offer.push(alert);
    $scope.submitTransaction({transaction:transaction, log: alert});
  }

  $scope.getMarketPrice = function () {
    var market_price;
    if ($scope.trading.bidOffers && $scope.trading.bidOffers[0]) {
      market_price = $scope.offerPriceToHuman($scope.trading.bidOffers[0]);
    }
    if ($scope.trading.askOffers && $scope.trading.askOffers[0]) {
      var ask_price = $scope.offerPriceToHuman($scope.trading.askOffers[0], true);
      market_price = market_price ? (market_price + ask_price) / 2 : ask_price;
    }
    return market_price;
  }

  $scope.priceAlert = function (options) {
    if (!DEVIATION_ALERT || !options.market_price || !options.price) return false;
    return (Math.abs(options.price - options.market_price) / options.market_price) > DEVIATION_ALERT;
  }

  $scope.prepareOfferCreate = function (options) {
    if (typeof options != 'object' || !options.type) return;
    
    if (options.type == 'sell') {
      options.qty = $scope.trading.sellQuantity;
      options.price = $scope.trading.sellPrice;
    } else if (options.type == 'buy') {
      options.qty = $scope.trading.buyQuantity;
      options.price = $scope.trading.buyPrice;
    }
    options.baseCurrency = $scope.trading.baseCurrency;
    options.tradeCurrency = $scope.trading.tradeCurrency;
    options.baseIssuer = $scope.trading.baseIssuer;
    options.tradeIssuer = $scope.trading.tradeIssuer;

    options.market_price = $scope.getMarketPrice();

    var modalInstance = $uibModal.open({
      size:'sm',
      animation: false,
      templateUrl: 'templetes/modal-offer-create.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (options) {
      $scope.offerCreate(options);
      if (options.type == 'sell') {
        $scope.trading.sellQuantity = null;
        $scope.trading.sellPrice = null;
      } else if (options.type == 'buy') {
        $scope.trading.buyQuantity = null;
        $scope.trading.buyPrice = null;
      }      
    }, function () {
      // do nothing
    });

  }

  $scope.offerCreate = function (options){
    if (typeof options != 'object') return;

    var qty = options.qty;
    var price = options.price;
    var expiration = options.expiration;

    var baseCurrency = options.baseCurrency;
    var baseIssuer = options.baseIssuer;
    var tradeCurrency = options.tradeCurrency;
    var tradeIssuer = options.tradeIssuer;

    var base_amount = (baseCurrency == 'XRP') ? 
                        String(Math.round(qty * 1000000)) :
                        {
                          "currency": baseCurrency,
                          "issuer": baseIssuer,
                          "value": String(qty)
                        }

    var trade_amount = (tradeCurrency == 'XRP') ? 
                        String(Math.round(qty * price* 1000000)) :
                        {
                          "currency": tradeCurrency,
                          "issuer": tradeIssuer,
                          "value": String(qty * price)
                        }

    if (expiration) {
        var now = new Date();
        expiration = new Date(now.getTime() + (options.expiration * 60 * 60 * 1000));
    } else {
      expiration = undefined;
    }

    var transaction = remote.transaction();

    transaction.offer_create({
      account: $scope.activeAccount,
      taker_pays: (options.type == 'sell') ? trade_amount : base_amount,
      taker_gets: (options.type == 'sell') ? base_amount : trade_amount, 
      expiration: expiration,
      offer_sequence: options.offer_sequence,
    }); 

    if (options.type == 'sell') transaction.setFlags('Sell');

    var alert = {description: options.offer_sequence ? 'Modifying offer seq-' + options.offer_sequence : 'Creating new ' + options.type + ' offer'};
    $scope.alerts.trading.push(alert);
    $scope.alerts.offer.push(alert);
    $scope.submitTransaction({transaction:transaction, log: alert});
  }
    
  $scope.loadOrderBooks = function (){
    if ($scope.trading.bookAsk) $scope.trading.bookAsk.destroy();
    if ($scope.trading.bookBid) $scope.trading.bookBid.destroy();

    var pair = $scope.trading.pair;

    var ask_options = {
          currency_gets: $scope.trading.baseCurrency,
          issuer_gets: $scope.trading.baseIssuer,
          currency_pays: $scope.trading.tradeCurrency,
          issuer_pays: $scope.trading.tradeIssuer
        };

    var bid_options = {
          currency_gets: $scope.trading.tradeCurrency,
          issuer_gets: $scope.trading.tradeIssuer,
          currency_pays: $scope.trading.baseCurrency,
          issuer_pays: $scope.trading.baseIssuer
        };

    $scope.trading.bookAsk = remote.createOrderBook(ask_options);
    $scope.trading.bookBid = remote.createOrderBook(bid_options);
    $scope.trading.bid_status = 'subscribing...'
    $scope.trading.ask_status = 'subscribing...';

    $scope.trading.bookAsk.on('model', function (offers){
      $scope.trading.ask_status = 'updated on ledger ' + (remote.getLedgerSequence() - 1);
      $scope.offersCalculateSum(offers);
      $scope.trading.askOffers = offers;
      $scope.drawMarketDepth();
    })

    $scope.trading.bookBid.on('model', function (offers){
      $scope.trading.bid_status = 'updated on ledger ' + (remote.getLedgerSequence() - 1);
      $scope.offersCalculateSum(offers);
      $scope.trading.bidOffers = offers;
      $scope.drawMarketDepth();
    })       
  }

  $scope.offersCalculateSum = function (offers) {
    if (! Array.isArray(offers)) return;
    sum_get = 0;
    sum_pay = 0;
    for (var i = 0, l = offers.length; i < l; i++) {
      sum_get += Number(offers[i].taker_gets_funded);
      sum_pay += Number(offers[i].taker_pays_funded);
      offers[i].taker_gets_funded_sum = sum_get;
      offers[i].taker_pays_funded_sum = sum_pay;
    }
  }

  $scope.offerPageLoad = function () {
    if (!$scope.accountOffers.offers) $scope.getAccountOffers();
  }

  $scope.offerIsSell = function (offer) {
    if (!offer) return;
    return (offer.flags & Remote.flags['offer']['Sell']) ? true : false;
  }

  $scope.transactionHistory = function (refresh) {
    var account = $scope.activeAccount;
    if (refresh || ! $scope.walletAccount.history) $scope.walletAccount.history = [];

    var params = {
      account: account,
      ledger_index_min: -1,
      ledger_index_max: -1,
      limit: 20,
      binary: false,
      marker: refresh ? undefined : $scope.walletAccount.tx_marker 
    };

    $scope.transactionHistoryStatus = 'Loading...';
    remote.requestAccountTransactions(params, function (err, data) {
      if (err) return;
      if (!data || data.account != $scope.activeAccount) return;
      var history = $scope.walletAccount.history;
      for(var i=0;i<data.transactions.length;i++) {
        var tx = $scope.processTxn(data.transactions[i], account);
        if (tx) history.push(tx);
      }

      if (data.marker) {
        $scope.walletAccount.tx_marker = data.marker;
        $scope.transactionHistoryStatus = 'Loaded';
      } else {
        $scope.transactionHistoryStatus = 'Full';
      }
      
      $scope.walletAccount.history = history;
      $scope.$apply();
    }).request();
  }

  $scope.processTxn = function (transaction, account) {
    var txn = transaction.tx || transaction.transaction;
    var meta = transaction.meta || transaction.metadata;

    function filterEffects (tx) {
      if (! Array.isArray(tx.effects)) return;

      var effects = [];
      var balance_effects = [];

      for (var i=0; i<tx.effects.length; i++) {
        var effect = tx.effects[i];
        switch (effect.type) {
          case 'offer_funded':
          case 'offer_partially_funded':
          case 'offer_bought':
          case 'offer_cancelled':
          case 'offer_created':
          case 'regular_key_added':
          case 'regular_key_changed':
          case 'regular_key_removed':
            effects.push(effect);
            break;

          //case 'fee':
          case 'balance_change':
          case 'trust_change_balance':
            balance_effects.push(effect)
            break;
        }
        if (effect.type == 'trust_change_balance' && effect.balance) {
          $scope.accountBalances.IOU[effect.currency + '.' + effect.counterparty] = effect.balance.to_number();
        }
      }
      //sort offer effects
      var index = {'offer_cancelled': 1, 'offer_funded': 2, 'offer_bought': 3, 'offer_partially_funded': 4, 'offer_created': 5}
      effects.sort(function (a, b) { return (index[a.type] && index[b.type]) ? (index[a.type] - index[b.type]) : 0; })

      tx.showEffects = effects;
      tx.balanceEffects = balance_effects;
    }

    var tx = JsonRewriter.processTxn(txn, meta, account);
    if (tx) filterEffects(tx);
    return tx;
  }

  $scope.historyPageLoad = function () {
    if (!$scope.walletAccount.history) $scope.transactionHistory();
  }

  $scope.updateOffers = function (tx) {
    if (! $scope.accountOffers.offers) $scope.accountOffers.offers = [];
    var offers = $scope.accountOffers.offers;

    function modifyOffer (effect) {
      var newFields = {
        taker_gets: effect.gets,
        taker_pays: effect.pays        
      }
      var offer = offers.find(function (offer){return offer.seq == effect.seq;});
      if (offer) Object.assign(offer, newFields);
    }

    function deleteOffer (effect) {
        var i = offers.findIndex(function (offer) {return offer.seq == effect.seq;})
        if (i >= 0) offers.splice(i, 1);
    }

    function addOffer (effect) {
      offers.push({
        expiration: effect.expiration,
        flags: effect.flags || 0,
        seq: effect.seq,
        taker_gets: effect.gets.to_json(),
        taker_pays: effect.pays.to_json(),
        quality: effect.pays.divide(effect.gets).to_text()        
      });
    }

    tx.effects.forEach(function (effect){
      switch(effect.type) {
        case 'offer_created':
          addOffer(effect)
          break;
        case 'offer_partially_funded':
          if (! effect.deleted) {
            modifyOffer(effect);
            break;
          } //else fall through
        case 'offer_funded':
        case 'offer_cancelled':
          deleteOffer(effect);
          break;
      }
    })
  }

  $scope.updateLines = function (tx) {
    if (! $scope.trustlines) return;

    var settings = [
      'freeze', 'freeze_peer', 
      'no_ripple', 'no_ripple_peer',
      'authorized', 'peer_authorized',
    ]

    function modifyLine (effect) {
      var newFields = {
        balance: effect.balance.to_text(),
        limit: effect.limit.to_text(),
        limit_peer: effect.limit_peer.to_text(),
        quality_in: effect.quality_in,
        quality_out: effect.quality_out,
      }
      settings.forEach(function (s) {
        newFields[s] = effect[s];
      })
      var line = $scope.trustlines.find(function (line){
        return line.account === effect.counterparty && line.currency === effect.currency;
      });
      if (line) Object.assign(line, newFields); 
    }

    function deleteLine (effect) {
        var i = $scope.trustlines.findIndex(function (line) {
          return line.account === effect.counterparty && line.currency === effect.currency;
        })
        if (i >= 0) $scope.trustlines.splice(i, 1);
    }

    function addLine (effect) {
      var line = {
        account: effect.counterparty,
        currency: effect.currency,
        balance: effect.balance.to_text(),
        limit: effect.limit.to_text(),
        limit_peer: effect.limit_peer.to_text(),
        quality_in: effect.quality_in,
        quality_out: effect.quality_out,
      };
      settings.forEach(function (s) {
        line[s] = effect[s];
      })
      $scope.trustlines.push(line)
    }

    tx.effects.forEach(function (effect){
      if (effect.deleted) return deleteLine(effect);

      switch(effect.type) {
        case 'trust_create_local':
        case 'trust_create_remote':
          addLine(effect)
          break;
        case 'trust_change_balance':
        case 'trust_change_remote':
        case 'trust_change_local':
        case 'trust_change_flags':
          modifyLine(effect);
      }
    })
  }

  $scope.handleTransaction = function (tx) {
    if (! tx.validated) return;
    if (! $scope.walletAccount.history) $scope.walletAccount.history = [];

    var tx = $scope.processTxn(tx, $scope.walletAccount._account_id);
    if (!tx) return;

    $scope.walletAccount.history.unshift(tx);
    $scope.updateOffers(tx);
    $scope.updateLines(tx);
  }

  $scope.editTradePair = function (pair, index) {
    var base = pair.split('/')[0];
    var trade = pair.split('/')[1];
    var opts = {
      baseCurrency: base.split('.')[0],
      baseIssuer: base.split('.')[1],
      tradeCurrency: trade.split('.')[0],
      tradeIssuer: trade.split('.')[1],
    };
    opts.index = index;
    opts.edit = true;
    $scope.prepareTradePair(opts);
  }

  $scope.deleteTradePair= function (index) {
    $scope.tradepairs.splice(index, 1);
  }

  $scope.addGateway = function (options) {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-add-gateway.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (options) {
      var newGateway = {
        name: options.name,
        address: options.address,
        currencies: options.currencies.trim().split(/,\s*/),
      }
      if (options.edit && (typeof options.index === 'number')) {
        $scope.gateways[options.index] = newGateway;
      } else {
        options.index = $scope.gateways.length;
        $scope.gateways.push(newGateway);
      }
    }, function () {
      // do nothing
    });
  }

  $scope.isDuplicateGateway = function (gateway) {
    var gateways = $scope.gateways;
    for (var i=0, l=gateways.length; i<l; i++) {
      if (i === gateway.index) continue;
      var g = gateways[i];
      if (g.name === gateway.name || g.address === gateway.address) return true;
    }
    return false; 
  }

  $scope.editGateway = function (gateway, index) {
    var opts = JSON.parse(JSON.stringify(gateway)); // make a copy.
    opts.currencies = gateway.currencies.join(', ');
    opts.index = $scope.gateways.findIndex(function(g){
      return g.address === gateway.address;
    });
    opts.edit = true;
    $scope.addGateway(opts);
  }

  $scope.deleteGateway = function (gateway) {
    var index = $scope.gateways.findIndex(function(g){
      return g.address === gateway.address;
    });
    $scope.gateways.splice(index, 1);
  }

  $scope.addServer = function (options) {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-add-server.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (options) {
      var newServer = {
        host: options.server,
        port: options.port,
        secure: options.secure,
        primary: options.primary
      }
      if (options.primary) {
        for (var i=0, l=$scope.servers.length; i<l; i++) {
          $scope.servers[i].primary = false;
        }
      }
      if (options.edit && (typeof options.index === 'number')) {
        $scope.servers[options.index] = options;
      } else {
        $scope.servers.push(options);
      }
    }, function () {
      // do nothing
    });
  }

  $scope.editServer = function (server, index) {
    var opts = JSON.parse(JSON.stringify(server)); // make a copy.
    opts.index = index;
    opts.edit = true;
    $scope.addServer(opts);
  }

  $scope.deleteServer = function (index) {
    $scope.servers.splice(index, 1);
  }

  $scope.editConfig = function () {
    var options = {
      slipage: $localStorage.slipage,
      fee_cushion: $localStorage.fee_cushion,
      orderbook_limit: $localStorage.orderbook_limit,
      last_ledger_offset: $localStorage.last_ledger_offset,
      max_fee: ($localStorage.max_fee) / 1000000,
      address: $localStorage.account.address,
    }

    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-config.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (options) {
      $localStorage.account = {address: options.address};
      $localStorage.max_fee = Math.ceil(options.max_fee * 1000000);
      $localStorage.last_ledger_offset = options.last_ledger_offset;
      $localStorage.orderbook_limit = options.orderbook_limit;
      $localStorage.fee_cushion = options.fee_cushion;
      $localStorage.slipage = options.slipage;
    }, function () {
      // do nothing
    });
  }

  $scope.addContact = function (options) {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'templetes/modal-add-contact.html',
      controller: 'ModalCtrl',
      scope: $scope,
      resolve: {
        options: function () {
          return options;
        }
      }
    });

    modalInstance.result.then(function (options) {
      var newContact = {
        name: options.name,
        address: options.address,
        dtag: options.dtag,
      }
      if (options.edit && (typeof options.index === 'number')) {
        $scope.contacts[options.index] = newContact;
      } else {
        options.index = $scope.contacts.length;
        $scope.contacts.push(newContact);
      }
    }, function () {
      // do nothing
    });
  }

  $scope.isDuplicateContact = function (contact) {
    var contacts = $scope.contacts;
    for (var i=0, l=contacts.length; i<l; i++) {
      if (i === contact.index) continue;
      var c = contacts[i];
      if (c.name === contact.name) return true;
      if (c.address === contact.address && c.dtag == contact.dtag) return true;
    }
    return false; 
  }

  $scope.editContact = function (contact, index) {
    var opts = JSON.parse(JSON.stringify(contact)); // make a copy.
    opts.index = $scope.contacts.findIndex(function(c){
      return c.name === contact.name;
    });
    opts.edit = true;
    $scope.addContact(opts);
  }

  $scope.deleteContact = function (contact) {
    var index = $scope.contacts.findIndex(function(c){
      return c.name === contact.name;
    });
    $scope.contacts.splice(index, 1);
  }
}]);  // main controller;



// ============ modal controller =================================

walletApp.controller('ModalAddMemoCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
  $scope.memo = {};
  $scope.ok = function () {
    $uibModalInstance.close($scope.memo);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);


walletApp.controller('ModalCtrl', ['$scope', '$uibModalInstance', 'options', function ($scope, $uibModalInstance, options) {
  if (typeof options != 'object') options = {}; 
  $scope.options = options;

  $scope.ok = function () {
    $uibModalInstance.close($scope.options);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);


// ============== directive ============================

walletApp.directive('rippleValidRecipient', function () {
  return {
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
      ctrl.$validators.rippleValidRecipient = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        // ripple address
        if (UInt160.is_valid(modelValue)) return true;

        // ripplename;
        var ripplename_regex = /^~[a-zA-Z0-9]([\-]?[a-zA-Z0-9]){0,19}$/;
        if (modelValue.length > 1 && modelValue[0] =='~') return ripplename_regex.test(modelValue);
 
        // checking for email type address (e.g.xyz@domain.com)
        var domain_split = modelValue.search(/@([\w-]+\.)+[\w-]{2,}$/);       
        if (domain_split <= 0) return false;
        return true;
      }
    }
  }
});

walletApp.directive('rippleValidAddress', function () {
  return {
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
      ctrl.$validators.rippleValidAddress = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        return UInt160.is_valid(modelValue);
      }
    }
  }
});

walletApp.directive('rippleValidSecret', function () {
  return {
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
      ctrl.$validators.rippleValidSecret = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) return true;
        if (Seed.is_valid(modelValue)) return true;
        if (KeyPair.is_valid(modelValue)) return true;
        return false; 
      }
    }
  }
});


walletApp.directive('rippleValidFederation', ['$http', function ($http) {
  return {
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
      ctrl.$validators.rippleValidFederation = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) return true;
        var str = String(modelValue);

        // ripplename;
        var ripplename_regex = /^~[a-zA-Z0-9]([\-]?[a-zA-Z0-9]){0,19}$/;

        if (str.length > 1 && str[0] =='~') return ripplename_regex.test(str);
 
        // checking for email type address (e.g.xyz@domain.com)
        var domain_split = str.search(/@([\w-]+\.)+[\w-]{2,}$/);       
        if (domain_split <= 0) return false;
        return true;
      }
    }
  }
}]);

walletApp.directive('positiveNumber', function () {
  return {
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
      ctrl.$validators.positiveNumber = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }

        var value = Number(modelValue);

        if (Number.isNaN(value)) return false;
        else if (value > 0) return true;

        return false;
      }
    }
  }
});

walletApp.directive('uint32', function () {
  return {
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
      ctrl.$validators.uint32 = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        
        if (/^\d+$/.test(modelValue)) { 
          var value = Number(modelValue);  
          if (value >= 0 && value <= 4294967295) return true;
        }

        return false;
      }
    }
  }
});

walletApp.directive('xrpDrops', function () {
  return {
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
      ctrl.$validators.xrpDrops = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        if (typeof modelValue == 'object') {
          return true;
        }
        
        if (/^\d+$/.test(modelValue)) { 
          var value = Number(modelValue);  
          if (value > 0 && value < 1e17) return true;
        }

        return false;
      }
    }
  }
});

walletApp.directive('rippleValidMemo', function () {
  return {
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
      ctrl.$validators.rippleValidMemo = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) return true;       
        else return /^[0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(modelValue);  // url characters '
      }
    }
  }
});

walletApp.directive('uppercaseOnly', function () {
  return {
    restrict: 'A',
    require: 'ngModel', 
    link: function (scope, element, attr, ctrl) {
        function parser(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }
          var formatedValue = value.toUpperCase();
          if (ctrl.$viewValue !== formatedValue) {
            ctrl.$setViewValue(formatedValue);
            ctrl.$render();
          }
          return formatedValue;
        }

        function formatter(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }
          return value.toUpperCase();
        }

        ctrl.$parsers.push(parser);
        parser(scope[attr.ngModel]);
    }
  }
});
