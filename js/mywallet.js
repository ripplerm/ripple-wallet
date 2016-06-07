var walletApp = angular.module('walletApp', ['ui.bootstrap', 'monospaced.qrcode', 'ngCookies', 'pascalprecht.translate']);

var translationsEN = {
    Ripple_Wallet: 'Ripple Wallet',
    Network: 'Network',
    Secret: 'Secret',
    Account: 'Account',
    Server: 'Server',
    LCL: 'Last-Closed-Ledger',
    BUTTON_LANG_CN: '中文',
    BUTTON_LANG_EN: 'English',
    Info: 'Info',
    Trustlines: 'Trustlines',
    Payment: 'Payment',
    Trading: 'Trading',
    Offers: 'Offers',
    Disclaimer: 'Disclaimer',
    Set_Wallet: 'Set Wallet Account',
    Address: 'Address',
    Idinput_holder: 'enter address or click use secret key',
    Invalid: 'Invalid',
    Save_secret: 'click QR image to download',
    Use_secret: 'use secretkey',
    Submit: 'Submit',
    Cancel: 'Cancel',
    Set_Secret: 'Set Wallet Secret',
    Enter_Secret: 'enter secret or select QR image',
    Refresh: 'Refresh',
    Advanced: 'Advanced',
    Set_RegularKey: 'Set RegularKey',
    Edit_Info: 'Edit Account Info',
    Reserved: 'Reserved',
    Account_Flags: 'Account Flags',
    Edit_Flags: 'Edit Account Flags',
    Total_Trustlines: 'Total Trustlines',
    Balance_Statistics: 'Balance Statistics',
    Hide_zero: 'Hide zero-balances',
    C_NOT: 'Currency(Nos of Trustlines)',
    Balance: 'Balance',
    List_Trustlines: 'List of Trustlines',
    Currency_Filter: 'Currency Filter',
    Descending: 'Descending',
    Show_A_D: 'Show Advance Detail',
    A_L: 'Add New Trustline',
    Currency: 'Currency',
    Counter_Party: 'Counter Party',
    A_P: '-- Add New --',
    Flip: 'Flip',
    Outstanding_Orders: 'Outstanding Orders',
    Type: 'Type',
    Qty: 'Qty',
    Price: 'Price',
    Edit: 'Edit',
    Sell: 'Sell',
    Buy: 'Buy',
    Place_Order: 'Place Order',
    Amount: 'amount',
    VARIABLE_REPLACEMENT1: 'price in ',
    VARIABLE_REPLACEMENT2: '',
    Reset: 'Reset',
    OrderBooks: 'OrderBooks',
    BIDS: 'BIDS',
    ASKS: 'ASKS',
    Hide: 'Hide',
    Volume: 'Volume',
    Receipient: 'Receipient',
    Use_RF: 'Use RippleName / Federation Address.',
    Resolve: 'Resolve',
    DT: 'Destination Tag:',
    Value: 'Value',
    Issuer: 'Issuer',
    SELQR: 'select QR',
    RDQR: 'read secret',
    Random: 'New Random Secret',
    SH_secret: 'Show Secret',
};

var translationsCN = {
    Ripple_Wallet: 'Ripple钱包',
    Network: '网络',
    Secret: '密钥',
    Account: '账户',
    Server: '服务器',
    LCL: '最新账本号',
    BUTTON_LANG_CN: '中文',
    BUTTON_LANG_EN: 'English',
    Info: '账户信息',
    Trustlines: '资产管理',
    Payment: '支付',
    Trading: '交易',
    Offers: '委托单',
    Disclaimer: '免责声明',
    Set_Wallet: '设置账户',
    Address: 'Ripple地址',
    Idinput_holder: '输入Ripple地址或点击使用密钥',
    Invalid: '无效',
    Save_secret: '点击QR下载密钥',
    Use_secret: '使用密钥',
    Submit: '提交',
    Cancel: '取消',
    Set_Secret: '设置密钥',
    Enter_Secret: '输入密钥或选择密钥QR',
    Refresh: '刷新',
    Advanced: '高级',
    Set_RegularKey: '设置RegularKey',
    Edit_Info: '编辑账户信息',
    Reserved: '锁定',
    Account_Flags: '账户标签',
    Edit_Flags: '编辑账户标签',
    Total_Trustlines: '已连接网关数',
    Balance_Statistics: '资产一览',
    Hide_zero: '隐藏余额为零的网关',
    C_NOT: '币种（网关数）',
    Balance: '余额',
    List_Trustlines: '资产明细',
    Currency_Filter: '筛选币种',
    Descending: '降序排列',
    Show_A_D: '显示高级明细',
    A_L: '添加新网关',
    Currency: '币种',
    Counter_Party: '对手盘',
    A_P: '--添加交易对--',
    Flip: '对调交易对',
    Outstanding_Orders: '该交易对委托单',
    Type: '类型',
    Qty: '数额',
    Price: '单价',
    Edit: '修改',
    Sell: '卖出',
    Buy: '买入',
    Place_Order: '下单',
    Amount: '数额',
    VARIABLE_REPLACEMENT1: '以',
    VARIABLE_REPLACEMENT2: '计价',
    Reset: '重置',
    OrderBooks: '委托盘',
    BIDS: '买入盘面',
    ASKS: '卖出盘面',
    Hide: '隐藏',
    Volume: '委托量',
    Receipient: '接收方',
    Use_RF: '使用RippleName或联邦地址',
    Resolve: '解析',
    DT: '终端标签:',
    Value: '值',
    Issuer: '发行方',
    SELQR: '选择 QR',
    RDQR: '读取密钥',
    Random: '新生成密钥',
    SH_secret: '显示密钥',
};

var Remote = ripple.Remote;
var Seed = ripple.Seed;
var Utils = ripple.utils;
var UInt160 = ripple.UInt160;
var Amount = ripple.Amount;
var Currency = ripple.Currency;
var sjcl = ripple.utils.sjcl;
var base58 = ripple.Base;
var Wallet = ripple.Wallet;
var OrderBookUtils = ripple.OrderBookUtils;

// ================= configuration & Global constant  ==================

var CLIENT_VERSION = "yxxyun-0.6";
var INSERT_CLIENT_INFO = true;

var DEFAULT_ACCOUNT =""; //"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
var DEFAULT_SECRET ="";// "snoPBrXtMeMyMHUVTgbuqAfg1SUTb";

var PATHFIND_MAX = 10; // stop pathfinding after reaching PATHFIND_MAX
var SLIPAGE = 1; // 1%, for calculating sendMax

var RIPPLE_DATA_URL = 'https://data.ripple.com';
var CHART_INTERVAL = '1hour'; // 1minute, 15minute, 30minute, 1hour, 1day...
var CHART_MAX_PAGE = 5; // max pages for repeated queries to data.ripple.com;
var CHART_LIMIT = 1000; // limit number for single query;

var DEVIATION_ALERT = 0.20; // alert when offerCreate price deviate >20% from market.
var APPLY_INTEREST = false; // false: showing raw amount instead of demuraged figure.

var remote = new Remote({
    // see the API Reference for available options
    trusted: false,
    local_signing: true,
    local_fee: true,
    fee_cushion: 1.2,
    max_fee: 15000,
    max_attempts: 0, // do not resubmit tx. 
    servers: [{
        host: 's1.ripple.com',
        port: 443,
        secure: true
    }, {
        host: 's2.ripple.com',
        port: 443,
        secure: true
    }, {
        host: 's-west.ripple.com',
        port: 443,
        secure: true
    }, {
        host: 's-east.ripple.com',
        port: 443,
        secure: true
    }]
});

var GATEWAYS = [{
        name: "BitStamp",
        address: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        currencies: ['USD', 'BTC']
    }, {
        name: "SnapSwap",
        address: "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        currencies: ['USD', 'BTC', 'EUR']
    }, {
        name: "RippleChina",
        address: "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
        currencies: ['CNY', 'BTC', 'LTC']
    }, {
        name: "RippleCN",
        address: "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
        currencies: ['CNY', 'BTC']
    }, {
        name: "RippleFox",
        address: "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
        currencies: ['CNY', 'FMM', 'STR', 'XLM']
    }, {
        name: "TheRock",
        address: "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
        currencies: ['BTC', 'LTC', 'NMC', 'PPC', 'DOG', 'USD ', 'EUR', 'GBP']
    }, {
        name: "RippleSingapore",
        address: "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH",
        currencies: ['SGD', 'XAG', 'XAU', 'XPT', 'USD']
    }, {
        name: "DividendRippler",
        address: "rfYv1TXnwgDDK4WQNbFALykYuEBnrR4pDX",
        currencies: ['BTC', 'LTC', 'NMC', 'TRC', 'STR']
    }, {
        name: "PayRoutes",
        address: "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
        currencies: ['USD', 'ILS', 'BTC', 'LTC', 'NMC', 'PPC']
    }, {
        name: "RippleUnion",
        address: "r3ADD8kXSUKHd6zTCKfnKT3zV9EZHjzp1S",
        currencies: ['CAD']
    }, {
        name: "Bitso",
        address: "rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn",
        currencies: ['BTC', 'MXN']
    }, {
        name: "ExchangeTokyo",
        address: "r9ZFPSb1TFdnJwbTMYHvVwFK1bQPUCVNfJ",
        currencies: ['JPY']
    }, {
        name: "DigitalGateJP",
        address: "rJRi8WW24gt9X85PHAxfWNPCizMMhqUQwg",
        currencies: ['JPY']
    }, {
        name: "TokyoJPY",
        address: "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN",
        currencies: ['JPY']
    }, {
        name: "Central24",
        address: "rM1JztoSdHmX2EPnRGRYmKQvkxZ2hnrWsn",
        currencies: ['JPY']
    }, {
        name: "PaxMoneta",
        address: "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d",
        currencies: ['KRW']
    }, {
        name: "Ripula",
        address: "rBycsjqxD8RVZP5zrrndiVtJwht7Z457A8",
        currencies: ['BTC', 'EUR', 'GBP', 'USD']
    }, {
        name: "Gatehub",
        address: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
        currencies: ['EUR', 'USD']
    }, {
        name: "Bluzelle",
        address: "raBDVR7JFq3Yho2jf7mcx36sjTwpRJJrGU",
        currencies: ['CAD']
    }, {
        name: "eXRP",
        address: "rPxU6acYni7FcXzPCMeaPSwKcuS2GTtNVN",
        currencies: ['KRW']
    }, {
        name: "GBI",
        address: "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
        currencies: ['0158415500000000C1F76FF6ECB0BAC600000000', 'XAU (-.5%pa)']
    }, {
        name: "Rippex",
        address: "rfNZPxoZ5Uaamdp339U9dCLWz2T73nZJZH",
        currencies: ['BRL']
    }, {
        name: "PtyCoin",
        address: "rBadiLisPCyqeyRA1ufVLv5qgVRenP2Zyc",
        currencies: ['USD', 'PAB', 'BTC', 'LTC', 'DRK']
    },{
        name: "MrRipple",
        address: "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
        currencies: ['JPY', 'USD']
    }
];

var TRADE_PAIRS = [
    'USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/XRP',
    'BTC.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/XRP',
    'BTC.rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/XRP',
    'BTC.rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun/XRP',
    'CNY.rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/XRP',
    'CNY.razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA/XRP',
    'CNY.rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK/XRP',
    'JPY.r9ZFPSb1TFdnJwbTMYHvVwFK1bQPUCVNfJ/XRP',
    'JPY.r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN/XRP',
    'JPY.rJRi8WW24gt9X85PHAxfWNPCizMMhqUQwg/XRP',
    'KRW.rUkMKjQitpgAM5WTGk79xpjT38DEJY283d/XRP',
    'BRL.rfNZPxoZ5Uaamdp339U9dCLWz2T73nZJZH/XRP',
    'MXN.rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn/XRP',
];

walletApp.config(['$translateProvider', function($translateProvider) {
    // add translation tables
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('cn', translationsCN);
    $translateProvider.preferredLanguage('en');
    // remember language
    $translateProvider.useLocalStorage();
    $translateProvider.useSanitizeValueStrategy('escape');
}]);



// ========= main controller ====================================


walletApp.controller('walletCtrl', ['$translate', '$scope', '$http', '$uibModal', function($translate, $scope, $http, $uibModal) {
    $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
    };

    $scope.gateways = GATEWAYS;
    $scope.tradepairs = TRADE_PAIRS;

    $scope.accountHistory = [];
    $scope.accountBalances = {};
    $scope.paymentSlipage = SLIPAGE;

    $scope.trading = {
        pair: $scope.tradepairs[0]
    };

    $scope.flags = Remote.flags;

    $scope.remote = remote;

    remote.on('state', function(state) {
        $scope.state = state;
        $scope.$apply();
    })
    remote.on('ledger_closed', function(msg, server) {
        $scope.ledgerIndex = msg.ledger_index;
        $scope.server = remote.getServer()._url;
        try {
            $scope.$apply();
        } catch (e) {};
    })
    remote.connect();

    $scope.tabs = [{
        title: 'Info',
        templete: 'templetes/tab-info.html',
        select: function() {
            $scope.infoPageLoad();
        }
    }, {
        title: 'Trustlines',
        templete: 'templetes/tab-trustlines.html',
        select: function() {
            $scope.trustlinesPageLoad();
        }
    }, {
        title: 'Payment',
        templete: 'templetes/tab-payment.html',
        select: function() {
            $scope.paymentReset();
        }
    }, {
        title: 'Trading',
        templete: 'templetes/tab-trading.html',
        select: function() {
            $scope.tradingPageLoad();
        }
    }, {
        title: 'Offers',
        templete: 'templetes/tab-offers.html',
        select: function() {
            $scope.offerPageLoad();
        }
    }, ]

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.inGatewayList = function(account) {
        if (!account) return false;

        var gateways = $scope.gateways;
        for (var i = 0; i < gateways.length; i++) {
            if (account == gateways[i].address) return true;
        }
        return false;
    }

    $scope.gatewayName = function(account) {
        if (!account) {
            return '';
        }
        var gateways = $scope.gateways;
        for (var i = 0; i < gateways.length; i++) {
            if (account == gateways[i].address) return gateways[i].name;
        }
        return account;
    }

    $scope.accountInfoReset = function() {
        $scope.accountData = null;
        $scope.accountBalances.XRP = null;
        $scope.accountInfoStatus = '';
    }

    $scope.handleAccountTransaction = function(transaction) {
        if (!transaction.mmeta) return;

        var changed = false;
        transaction.mmeta.each(function(an) {
            var isAccount = an.fields.Account === $scope.walletAccount._account_id;
            var isAccountRoot = isAccount && an.entryType === 'AccountRoot';
            if (isAccountRoot) {
                Object.assign($scope.walletAccount.account_data, an.fieldsNew, an.fieldsFinal);
                Object.keys(an.fieldsPrev).forEach(function(field) {
                    if (!an.fieldsFinal.hasOwnProperty(field)) {
                        delete $scope.walletAccount.account_data[field];
                    }
                })
                changed = true;
            }
        });
        if (changed) $scope.updateAccountInfo();
        $scope.accountInfoStatus = 'Updated @ Ledger:' + transaction.ledger_index;
    }

    $scope.updateAccountInfo = function() {
        var accountData = $scope.walletAccount.account_data;

        accountData.domain = accountData.Domain ? Utils.hexToString(accountData.Domain) : '';
        accountData.xrpBalance = accountData.Balance / 1000000;
        accountData.xrpReserved = 20 + (accountData.OwnerCount ? accountData.OwnerCount : 0) * 5;

        accountData.settings = {};

        var flags = Remote.flags['account_root'];
        for (var flag in flags) {
            accountData.settings[flag] = accountData.Flags & flags[flag] ? true : false;
            accountData.settings['AccountTxnID'] = accountData.hasOwnProperty('AccountTxnID') ? true : false;
        }

        $scope.accountData = accountData;

        $scope.accountBalances.XRP = accountData.xrpBalance;
        $scope.accountBalances.reserved = accountData.xrpReserved;
        //$scope.$apply();
    }

    $scope.accountInfo = function() {
        if (!$scope.walletAccount) return;

        $scope.accountInfoStatus = 'requesting...';

        remote.requestAccountInfo({
            account: $scope.walletAccount._account_id,
            ledger: 'validated'
        }, function(err, res) {
            if (err) {
                if (err.remote) {
                    var account = err.remote.account || err.remote.request.account;
                    if (account != $scope.walletAccount._account_id) return;
                    if (err.remote.error) $scope.accountInfoStatus = err.remote.error;
                } else {
                    $scope.accountInfoStatus = err.error;
                }
            }
            if (res && res.account_data) {
                if (res.account_data.Account != $scope.walletAccount._account_id) return;
                $scope.walletAccount.account_data = res.account_data;
                $scope.accountInfoStatus = 'Updated @ Ledger:' + res.ledger_index;
                $scope.updateAccountInfo();
            }
            //$scope.$apply();
        })
    }

    $scope.infoPageLoad = function() {
        if (!$scope.walletAccount) {
            // $scope.setWalletAccount({
            //     address: DEFAULT_ACCOUNT,
            //     secret: DEFAULT_SECRET
            // });
            return;
        }
        if (!$scope.walletAccount.account_data) $scope.accountInfo();
    }

    $scope.trustlinesReset = function() {
        $scope.accountBalances.IOU = {};
        $scope.trustlines = null;
        $scope.trustlinesStats = null;
        $scope.totalTrustlines = 0;
        $scope.accountLinesStatus = '';
    }

    $scope.trustlinesPageLoad = function() {
        if ($scope.inGatewayList($scope.activeAccount)) return;
        if (!$scope.trustlines) $scope.accountLines();
    }

    $scope.accountLines = function(callback) {
        if (typeof callback != 'function') callback = function() {};
        $scope.accountLinesStatus = 'refreshing...';
        var LINES = [];
        var page = 0;

        var request = remote.requestAccountLines({
            account: $scope.activeAccount,
            ledger: 'validated'
        });
        request.callback(function handle_message(err, res) {
            var self = this;

            if (err) {
                if (err.remote) {
                    var account = err.remote.account || err.remote.request.account;
                    if (!$scope.walletAccount) {
                    // $scope.setWalletAccount({
                    //     address: DEFAULT_ACCOUNT,
                    //     secret: DEFAULT_SECRET
                    // });
                    return;
                    }
                    if (account != $scope.walletAccount._account_id) return;
                    if (err.remote.error) $scope.accountLinesStatus = err.remote.error;
                } else {
                    $scope.accountLinesStatus = err.error;
                }
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

                $scope.accountLinesStatus = 'Updated @ ledger:' + res.ledger_index;

                $scope.trustlines = LINES;
                $scope.linesStats();
            }
            callback(err, res);
            //$scope.$apply();          
        });
    }

    $scope.lineBalanceFloat = function(line) {
        return parseFloat(line.balance);
    }

    $scope.linesStats = function() {
        $scope.trustlinesStats = null;

        var lines = $scope.trustlines;
        var total = 0;

        var stats = {};
        for (var i = 0; i < lines.length; i++) {
            var currency = lines[i].currency;
            var balance = parseFloat(lines[i].balance);
            if (!stats.hasOwnProperty(currency)) stats[currency] = {
                balance: 0,
                lineNumber: 0
            };
            stats[currency].balance += balance;
            stats[currency].lineNumber++;
            total++;
        }

        $scope.totalTrustlines = total;
        $scope.trustlinesStats = stats;
    }

    $scope.generateNewSecret = function() {
        return ripple.Wallet.getRandom().secret;
    }

    $scope.prepareGenerateAccount = function(options) {
        if (!options) options = {};
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'templetes/modal-generate-account.html',
            controller: 'ModalCtrl',
            scope: $scope,
            resolve: {
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(new_options) {
            var secret = new_options.secret;
            var index = Number(new_options.index) || 0;

            if (secret) {
                var seed = Seed.from_json(secret);
                var key = seed.get_key(index);
                var address = key.get_address().to_json();

                options.secret = secret;
                options.index = index;
                options.address = address;
            }

        }, function() {
            // do nothing; 
        });
    };

    var qr = new QrCode();
    var qrsec;
    qr.callback = function(result) {
        qrsec = result;
    };
    $scope.qrSecret = function() {

        return qrsec;
    };


    $scope.file_changed = function(element) {

        $scope.$apply(function(scope) {
            var photofile = element.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                qr.decode(this.result); // handle onload
            };
            reader.readAsDataURL(photofile);
        });
    };

    $scope.prepareSetWalletAccount = function(options) {
        if (!options) options = {};
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'templetes/modal-set-wallet-account.html',
            controller: 'ModalCtrl',
            scope: $scope,
            resolve: {
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(options) {
            $scope.setWalletAccount(options);
        }, function() {
            // do nothing; 
        });
    }

    $scope.setWalletAccount = function(options) {
        var account = options.address;
        var secret = options.secret;

        if (!account) return;

        if (!$scope.walletAccount || $scope.walletAccount._account_id != account) {
            if ($scope.walletAccount) $scope.walletAccount.removeAllListeners();
            $scope.accountInfoReset();
            $scope.trustlinesReset();
            $scope.accountOffers = {};

            $scope.activeAccount = account;
            $scope.walletAccount = $scope.remote.account(account);
            if (secret) remote.setSecret(account, secret);

            $scope.addAccountHistory($scope.activeAccount);
            $scope.accountInfo();
            //$scope.getAccountOffers();

            $scope.walletAccount.on('transaction', function(tx) {
                $scope.handleAccountTransaction(tx);
            })
        }
    }

    $scope.prepareSetWalletSecret = function(options) {
        if (!options) options = {};

        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'templetes/modal-set-wallet-secret.html',
            controller: 'ModalCtrl',
            scope: $scope,
            resolve: {
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(options) {
            $scope.setWalletSecret(options);
        }, function() {
            // do nothing; 
        });
    }

    $scope.setWalletSecret = function(options) {
        var secret = options.secret;
        remote.setSecret($scope.activeAccount, secret);
    }

    $scope.addAccountHistory = function(address) {
        if ($scope.accountHistory.indexOf(address) < 0) $scope.accountHistory.push(address);
    }

    $scope.setSecret = function() {
        var secret = $scope.formSecret;

        if (secret[0] != 's' || !Seed.from_json(secret).is_valid()) {
            return alert('Invalid Secret!')
        };

        remote.setSecret($scope.activeAccount, secret);
        $scope.editSecret = false;
        $scope.formSecret = '';
    }

    $scope.currencyName = function(currency) {
        return Currency.from_json(currency).to_human();
    }

    $scope.amountDisplay = function(amount, opts) {
        if (!opts) opts = {
            value: true,
            currency: true,
            issuer: true,
            gatewayName: true
        };

        var options = {
            max_sig_digits: opts.max_sig_digits
        };

        if (APPLY_INTEREST) {
            options.reference_date = new Date();
        }
        var now = new Date();
        var amount = Amount.from_json(amount).to_human_full(options).split('/');

        var value = amount[0];
        var currency = amount[1];
        var issuer = amount[2];

        //if (opts.precision) value = Number(value).toPrecision(opts.precision);
        if (opts.issuer && opts.gatewayName) issuer = $scope.gatewayName(issuer);

        var result = '';

        result += opts.value ? value : '';
        result += opts.currency ? ' ' + currency : '';
        result += opts.issuer ? (issuer ? '.' + issuer : '') : '';

        return result;
    }

    // =============== federation protocol =======================

    $scope.federationReset = function() {
        $scope.Payment.federation = {};
        $scope.federationQuoteReset();
        $scope.Payment.federation.resolving = false;
        $scope.Payment.federation.status = '';
    }
    $scope.federationQuoteReset = function() {
        $scope.Payment.destination = '';
        $scope.Payment.destinationTag = '';
        $scope.Payment.invoiceID = '';
        $scope.Payment.amountCurrency = '';
        $scope.Payment.amountValue = '';
        $scope.Payment.amountIssuer = '';

        $scope.Payment.federation.quoteStatus = '';
        $scope.Payment.federation.quoteStatusDetail = '';
    }

    $scope.federationQuote = function() {
        $scope.federationQuoteReset();
        var fed_address = $scope.Payment.federationAddress;
        var quote_url = $scope.Payment.federation.quoteUrl;
        var domain = $scope.Payment.federation.domain;
        var destination = $scope.Payment.federation.destination;
        var amount = $scope.Payment.federation.quoteAmount + '/' + $scope.Payment.federation.quoteCurrency;

        function format_params(params) {
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
            for (var i = 0; i < fields.length; i++) {
                data[fields[i].name] = fields[i].value;
            }
        }

        $scope.Payment.federation.quoteStatus = 'Quoting...';

        $http.get(quote_url + '?' + format_params(data))
            .success(function(res) {
                if (fed_address != $scope.Payment.federationAddress) return;
                $scope.Payment.federation.quoteStatusDetail = res;
                if (res.result == 'success' && res.quote && res.quote.send) {
                    var expires = new Date(res.quote.expires * 1000) // 946684800;
                    $scope.Payment.federation.quoteStatus = 'Success!... This quotation is valid till: ' + expires.toLocaleString();
                    $scope.Payment.destination = res.quote.destination_address || res.quote.address;
                    $scope.Payment.destinationTag = res.quote.destination_tag;
                    $scope.Payment.invoiceID = res.quote.invoice_id;
                    $scope.Payment.amountCurrency = res.quote.send[0].currency;
                    $scope.Payment.amountValue = res.quote.send[0].value;
                    $scope.Payment.amountIssuer = res.quote.send[0].issuer;
                    $scope.pathFindStart();
                } else if (res.result == 'error' || res.error) {
                    $scope.Payment.federation.quoteStatus = 'Error:' + res.error_message || res.error;
                }
            }).error(function(err) {
                if (fed_address != $scope.Payment.federationAddress) return;
                $scope.Payment.federation.quoteStatus = err;
            })

    }

    $scope.resolveRippleName = function(ripplename) {

        var auth_url = 'https://id.ripple.com/v1/authinfo';

        $http.get(auth_url + '?username=' + ripplename)
            .success(function(res) {
                if (ripplename != $scope.Payment.federationAddress) return;
                $scope.Payment.federation.status = res;

                if (res.exists) {
                    $scope.Payment.destination = res.address;
                    $scope.Payment.federation.status = 'Done.';
                } else $scope.Payment.federation.status = 'ripplename not exists.';
            }).error(function(err) {
                if (ripplename != $scope.Payment.federationAddress) return;
                $scope.Payment.federation.status = 'Error resolving ripplename.';
                $scope.Payment.federation.resolving = false;
            })


    }

    $scope.resolveFederation = function() {
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

            var currentSection = "",
                sections = {};

            for (var i = 0, l = txt.length; i < l; i++) {
                var line = txt[i];
                if (!line.length || line[0] === '#') {
                    continue;
                } else if (line[0] === '[' && line[line.length - 1] === ']') {
                    currentSection = line.slice(1, line.length - 1);
                    sections[currentSection] = [];
                } else {
                    line = line.replace(/^\s+|\s+$/g, '');
                    if (sections[currentSection]) {
                        sections[currentSection].push(line);
                    }
                }
            }
            return sections;
        }

        function federation_end(message) {
            if (fed_address != $scope.Payment.federationAddress) return;
            $scope.Payment.federation.status = message;
            $scope.Payment.federation.resolving = false;
        }

        function RippleTxt(i, callback) {
            var subdomain = ['', 'www.', 'ripple.'];

            function rippleTxtSuccess(res) {
                if (fed_address != $scope.Payment.federationAddress) return;
                callback(res)
            }

            function rippleTxtFailed() {
                federation_end('Error: ripple.txt Not Found.')
            }
            $http.get('https://' + subdomain[i] + domain + '/ripple.txt')
                .success(rippleTxtSuccess)
                .error(function() {
                    if (i < subdomain.length) return RippleTxt(i + 1, callback);
                    else rippleTxtFailed();
                });
        }

        function federation_check(fed_url) {
            $http.get(fed_url + '?type=federation&destination=' + destination + '&domain=' + domain)
                .success(function(res) {
                    if (fed_address != $scope.Payment.federationAddress) return;
                    if (res.federation_json) {
                        var fedjson = res.federation_json;
                        if (fedjson.destination_address) {
                            $scope.Payment.destination = fedjson.destination_address;
                            $scope.Payment.destinationTag = fedjson.dt;
                            $scope.Payment.federation.status = 'Done.';

                        } else if (fedjson.quote_url) {
                            $scope.Payment.federation.status = 'Quotation Required.';
                            $scope.Payment.federation.quoteUrl = fedjson.quote_url;
                            $scope.Payment.federation.quoteRequired = true;

                            var currencies = fedjson.currencies;
                            if (currencies && currencies[0]) {
                                $scope.Payment.federation.quoteCurrencies = currencies;
                                $scope.Payment.federation.quoteCurrency = currencies[0].currency;
                                $scope.Payment.federation.quoteIssuer = currencies[0].issuer;
                            }
                            if (fedjson.extra_fields) $scope.Payment.federation.extraFields = fedjson.extra_fields;
                        }
                    } else if (res.result == 'error') {
                        federation_end('Error: ' + res.error_message || res.error);
                    }
                }).error(function() {
                    federation_end('Failed.')
                });
        }

        RippleTxt(0, function(txt) {
            txt = parse(txt);
            if (txt['federation_url'] && txt['federation_url'][0]) {
                var fed_url = txt['federation_url'][0];
                federation_check(fed_url);
            } else {
                federation_end('Federation Service Not Found.')
            }
        });

    }

    // =========== Path Finding ===============================
    $scope.pathFindAutoStart = function() {
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

    $scope.pathFindStart = function(options) {
        if ($scope.pathFind) $scope.pathFindClose();
        var payment = $scope.Payment

        var sourceCurrencies = [];
        if (payment.pathFindSeparateIssuer) {
            var lines = $scope.trustlines;
            if (lines) {
                sourceCurrencies.push({
                    currency: 'XRP'
                });
                for (var i = 0; i < lines.length; i++) {
                    sourceCurrencies.push({
                        currency: lines[i].currency,
                        issuer: lines[i].account
                    });
                }
            } else {
                if (!options || !options.lines_updated) {
                    // delay untill trustlines updated.
                    $scope.Payment.pathFindStatus = 'checking source currencies...'
                    $scope.accountLines(function() {
                        $scope.pathFindStart({
                            lines_updated: true
                        });
                    });
                    return;
                }
            }
        }

        var AMOUNT = payment.amountCurrency == 'XRP' ?
            String(Math.round(Number(payment.amountValue) * 1e6)) : {
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
            src_currencies: sourceCurrencies
        })

        pathfind.on('error', function(msg) {
            if (payment != $scope.Payment) return pathfind.close();
            $scope.Payment.pathFindStatus = 'Error: ' + msg.error;
        });

        pathfind.on("update", function(msg) {
            if (payment != $scope.Payment) return pathfind.close();
            var path_opts = msg.alternatives;
            if (!path_opts || !path_opts.length) $scope.Payment.pathFindStatus = 'No Path Found!';
            else {
                try {
                    path_opts = JSON.parse(path_opts)
                } catch (e) {};
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

    $scope.pathFindClose = function() {
        if (!$scope.pathFind) return;
        $scope.Payment.pathFindStatus = 'Path_Finding Stopped.'
        $scope.pathFind.removeAllListeners();
        $scope.pathFind.close();
        $scope.pathFind = null;
    }

    $scope.setPaths = function(paths) {
        $scope.Payment.paths = paths;
    }

    $scope.setSendmax = function(amount) {
        var multiplier = 1 + $scope.paymentSlipage / 100;
        if (amount.value) {
            if (amount.currency == 'XRP' && $scope.Payment.amountCurrency == 'XRP') multiplier = 1;
            $scope.Payment.sendmaxValue = String(amount.value * multiplier);
            // $scope.Payment.sendmaxValue = amount.value;
            $scope.Payment.sendmaxCurrency = amount.currency;
            $scope.Payment.sendmaxIssuer = amount.issuer;
        } else {
            if ($scope.Payment.amountCurrency == 'XRP') multiplier = 1;
            $scope.Payment.sendmaxValue = String(amount / 1000000 * multiplier);
            // $scope.Payment.sendmaxValue = amount/1000000;
            $scope.Payment.sendmaxCurrency = 'XRP';
        }
    }

    $scope.submitPayment = function() {
        var payment = $scope.Payment;

        var xrp_to_xrp = payment.amountCurrency == 'XRP' && (!payment.sendmaxCurrency || payment.sendmaxCurrency == 'XRP');

        var AMOUNT = payment.amountCurrency == 'XRP' ?
            Math.round(Number(payment.amountValue) * 1e6) : {
                value: payment.amountValue,
                currency: payment.amountCurrency,
                issuer: payment.amountIssuer
            }

        var SENDMAX = (payment.sendmaxCurrency == 'XRP') ?
            Math.round(Number(payment.sendmaxValue) * 1e6) : {
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
                    transaction.tx_json.DeliverMin = payment.amountCurrency == 'XRP' ?
                        Math.round(Number(payment.deliverMin) * 1e6) : {
                            value: payment.deliverMin,
                            currency: payment.amountCurrency,
                            issuer: payment.amountIssuer
                        }
                }
            }
            if (payment.sendmaxValue) transaction.tx_json.SendMax = SENDMAX;
            if (payment.paths) transaction.tx_json.Paths = payment.paths;
        }

        if (payment.memos) {
            var memos = payment.memos;
            for (var i = 0; i < memos.length; i++) {
                transaction.addMemo(memos[i]);
            }
        }

        $scope.paymentLog = {};
        $scope.submitTransaction({
            transaction: transaction,
            log: $scope.paymentLog
        }, function(err, res) {
            if (res && res.metadata) {
                var delivered = res.metadata.DeliveredAmount;
                if (!delivered) delivered = res.tx_json.Amount;
                $scope.paymentLog.result += ', Delivered Amount = ' + $scope.amountDisplay(delivered, {
                    value: true,
                    currency: true
                });
            }
        });
    }

    $scope.paymentReset = function() {
        $scope.Payment = {};
    }

    // =================== transaction submission ===================================

    $scope.submitTransaction = function(options, callback) {
        if (typeof callback != 'function') callback = function() {};

        var transaction = options.transaction;
        var tx_log = options.log;

        tx_log.status = '';
        tx_log.result = '';
        tx_log.summary = '';
        tx_log.tx_hash = '';

        transaction.on('submitted', function(msg) {
            tx_log.status = 'PRELIMINARY';
            tx_log.result = msg.engine_result + ': ' + msg.engine_result_message;
            $scope.$apply();
        })

        transaction.on('presubmit', function(msg) {
            if (!transaction.attempts) tx_log.status = 'submitting...';
            else tx_log.status = 'resubmitting...';
        })

        tx_log.status = 'PREPARE';

        if (INSERT_CLIENT_INFO) {
            transaction.addMemo({
                memoType: 'ripple-wallet-md',
                memoData: CLIENT_VERSION
            });
        }

        transaction.submit(function(err, res) {
            tx_log.status = 'FINAL';
            tx_log.status_code = err ? err.result : res.engine_result;
            tx_log.summary = transaction.summary();
            tx_log.result = tx_log.summary.result.engine_result;
            tx_log.tx_hash = tx_log.summary.result.transaction_hash;

            callback(err, res)
            $scope.$apply();
        });

    }

    // =========== Adding Memos ==================================

    $scope.clearMemos = function(tx) {
        delete tx.memos;
    }

    $scope.deleteMemo = function(tx, memo) {
        if (tx.memos) {
            var index = tx.memos.indexOf(memo);
            if (index > -1) tx.memos.splice(index, 1);
        }
    }

    $scope.clearMemo = function() {
        $scope.memoType = '';
        $scope.memoFormat = '';
        $scope.memoData = '';
    }

    // ============= modal add memo ==============================
    $scope.prepareMemo = function(tx) {

        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'templetes/modal-add-memo.html',
            controller: 'ModalAddMemoCtrl',
        });

        modalInstance.result.then(function(memo) {
            if (!tx.hasOwnProperty('memos')) tx.memos = [];
            tx.memos.push(memo);
        }, function() {
            // do nothing; 
        });
    };

    // =============  modal Set RegularKey =====================
    $scope.regularKey = '';

    $scope.prepareSetRegularKey = function(options) {

        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'templetes/modal-set-regularkey.html',
            controller: 'ModalCtrl',
            scope: $scope,
            resolve: {
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(options) {
            $scope.setRegularKey(options);
        }, function() {
            // do nothing; 
        });
    };

    $scope.setRegularKey = function(options) {
        var transaction = remote.transaction();
        transaction.setRegularKey({
            account: $scope.activeAccount,
            regular_key: options.regularKey
        });

        if (options.memos) {
            var memos = options.memos;
            for (var i = 0; i < memos.length; i++) {
                transaction.addMemo(memos[i]);
            }
        }
        $scope.accountSetLog = {};
        $scope.submitTransaction({
            transaction: transaction,
            log: $scope.accountSetLog
        });
    }

    //  ================== Account Set ============================================

    $scope.prepareAccountSet = function(options) {
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
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(newSettings) {
            $scope.accountSet(newSettings);
        }, function() {
            // do nothing
        });
    };


    $scope.accountSet = function(settings) {

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
            transaction.tx_json.messageKey = settings.messageKey ? settings.messageKey : '';
        }

        if (settings.memos) transaction.tx_json.memos = settings.memos;

        $scope.accountSetLog = {};
        $scope.submitTransaction({
            transaction: transaction,
            log: $scope.accountSetLog
        });
    }

    //  ================== Add or Edit Trustlines. ================================
    $scope.editTrustline = function(line) {
        var settings = JSON.parse(JSON.stringify(line)); // make a copy.

        settings.quality_in_human = line.quality_in ? line.quality_in / 1e9 : 0;
        settings.quality_out_human = line.quality_out ? line.quality_out / 1e9 : 0;
        settings.edit = true;

        $scope.prepareSetTrust(settings);
    }

    $scope.addTrustline = function() {
        var settings = {
            edit: false,
            no_ripple: true,
            quality_in_human: 0,
            quality_out_human: 0
        }
        $scope.prepareSetTrust(settings);
    }

    $scope.prepareSetTrust = function(options) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'templetes/modal-set-trust.html',
            controller: 'ModalCtrl',
            scope: $scope,
            resolve: {
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(newSettings) {
            $scope.setTrust(newSettings);
        }, function() {
            // do nothing
        });

    }

    $scope.setTrust = function(settings) {

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

        $scope.trustSetLog = {};
        $scope.trustSetLog.tx_json = transaction.tx_json;

        $scope.submitTransaction({
            transaction: transaction,
            log: $scope.trustSetLog
        });
    }

    // ===================== Charting ===============================

    $scope.drawChart = function() {

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
        var groupingUnits = [
            [
                'minute', [15, 30]
            ],
            [
                'hour', [1, 2, 4, 8, 12]
            ],
            [
                'day', [1, 3, ]
            ],
            [
                'week', [1, 2]
            ],
            [
                'month', [1]
            ]
        ];

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
                type: 'datetime',
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

    $scope.prepareChart = function(options) {
        var pair = $scope.trading.pair;

        $scope.trading.chartStatus = 'Loading data from ' + RIPPLE_DATA_URL + ' ......';
        // 'https://data.ripple.com/v2/exchanges/BTC+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/XRP?descending=true&result=tesSUCCESS&interval=15minute'

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
            .success(function(res) {
                if (pair != $scope.trading.pair) return;
                var data = res.exchanges;
                data.sort(function(a, b) {
                    return Date.parse(a.start) - Date.parse(b.start)
                });

                $scope.trading.chartData = data.concat($scope.trading.chartData);
                if ($scope.trading.chartPage == 0) $scope.drawChart();

                $scope.trading.chartPage++;

                if (res.marker && $scope.trading.chartPage < CHART_MAX_PAGE) $scope.prepareChart({
                    marker: res.marker
                });
                else if ($scope.trading.chartPage > 1) $scope.drawChart();

                $scope.trading.chartStatus = '';

            }).error(function(err) {
                if (pair != $scope.trading.pair) return;
                $scope.trading.chartStatus = 'Error: ' + err;
            })
    }

    // ================== trading ========================

    $scope.buyReset = function() {
        $scope.trading.buyPrice = null;
        $scope.trading.buyQuantity = null;
    }

    $scope.sellReset = function() {
        $scope.trading.sellPrice = null;
        $scope.trading.sellQuantity = null;
    }

    $scope.tradingReset = function() {
        $scope.buyReset();
        $scope.sellReset();
    }


    $scope.orderBooksReset = function() {
        $scope.trading.bidOffers = [];
        $scope.trading.askOffers = [];
        $scope.trading.bid_status = '';
        $scope.trading.ask_status = '';
        $scope.trading.chartPage = 0;
        $scope.trading.chartData = [];
        try {
            $scope.trading.chart.destroy();
        } catch (e) {};

        $scope.offersFilterTradePair();
        $scope.loadOrderBooks();
        $scope.prepareChart();
    }

    $scope.tradingPageLoad = function() {
        if (!$scope.trading.baseCurrency) $scope.setTradePair($scope.trading.pair);
    };

    $scope.pairName = function(pair) {
        var base = pair.split('/')[0];
        var trade = pair.split('/')[1];

        var baseCurrency = base.split('.')[0];
        var baseIssuer = base.split('.')[1];
        var tradeCurrency = trade.split('.')[0];
        var tradeIssuer = trade.split('.')[1];

        var pairname = baseCurrency + (baseIssuer ? '.' + $scope.gatewayName(baseIssuer) : '') + '/' +
            tradeCurrency + (tradeIssuer ? '.' + $scope.gatewayName(tradeIssuer) : '');
        return pairname;
    }

    $scope.prepareTradePair = function(options) {
        if (!options) options = {};

        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'templetes/modal-set-trade-pair.html',
            controller: 'ModalCtrl',
            scope: $scope,
            resolve: {
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(options) {
            var pair = options.baseCurrency + (options.baseIssuer ? '.' + options.baseIssuer : '') + '/' + options.tradeCurrency + (options.tradeIssuer ? '.' + options.tradeIssuer : '');
            if (pair != $scope.trading.pair) $scope.setTradePair(pair);
        }, function() {
            // do nothing
        });
    }

    $scope.setTradePair = function(pair) {
        $scope.trading.pair = pair;

        if ($scope.tradepairs.indexOf(pair) < 0) $scope.tradepairs.unshift(pair);

        var base = pair.split('/')[0];
        var trade = pair.split('/')[1];

        $scope.trading.baseCurrency = base.split('.')[0];
        $scope.trading.baseIssuer = base.split('.')[1];
        $scope.trading.tradeCurrency = trade.split('.')[0];
        $scope.trading.tradeIssuer = trade.split('.')[1];

        $scope.orderBooksReset();
        $scope.tradingReset();
    }

    $scope.flipTradePair = function() {
        var currencies = $scope.trading.pair.split('/');
        $scope.setTradePair(currencies[1] + '/' + currencies[0]);
    }

    $scope.offerPriceToHuman = function(offer, isAskOffer) {
        if (!offer) return false;
        var quality = offer.quality;
        var tgets = offer.TakerGets || offer.taker_gets;
        var tpays = offer.TakerPays || offer.taker_pays;

        if (typeof tpays == 'string') quality = quality / 1000000;
        if (typeof tgets == 'string') quality = quality * 1000000;
        var price = (isAskOffer) ? Number(quality) : Number(1 / quality);
        return price;
    }

    $scope.offerGetsCurrency = function(offer) {
        var tgets = offer.TakerGets || offer.taker_gets;
        return (typeof tgets == 'object') ? tgets.currency : 'XRP';
    }
    $scope.offerPaysCurrency = function(offer) {
        var tpays = offer.TakerPays || offer.taker_pays;
        return (typeof tpays == 'object') ? tpays.currency : 'XRP';
    }

    $scope.offerGetsToHuman = function(offer) {
        var tgets = offer.TakerGets || offer.taker_gets;
        var value = tgets.value ? tgets.value : tgets / 1000000
        return Number(value);
    }

    $scope.offerPaysToHuman = function(offer) {
        var tpays = offer.TakerPays || offer.taker_pays;
        var value = tpays.value ? tpays.value : tpays / 1000000
        return Number(value);
    }

    $scope.offerGetsFundedToHuman = function(offer) {
        var tgets = offer.TakerGets || offer.taker_gets;
        var funded = offer.taker_gets_funded;
        var value = (typeof tgets == 'object') ? funded : funded / 1000000
        return Number(value);
    }

    $scope.offerPaysFundedToHuman = function(offer) {
        var tpays = offer.TakerPays || offer.taker_pays;
        var funded = offer.taker_pays_funded;
        var value = (typeof tpays == 'object') ? funded : funded / 1000000
        return Number(value);
    }

    $scope.offerExpireHour = function(offer) {
        if (!offer || !offer.expiration) return;
        var now = Date.now();
        return (Utils.toTimestamp(offer.expiration) - now) / (60 * 60 * 1000); // hours remaining.    
    }

    $scope.offersFilterTradePair = function(offers) {
        var offers = offers ? offers : ($scope.accountOffers) ? $scope.accountOffers.all : null;
        if (!offers) return;

        function tgetsCurrency(offer) {
            var currency = (typeof offer.taker_gets == 'object') ? offer.taker_gets.currency : 'XRP';
            return currency;
        }

        function tpaysCurrency(offer) {
            var currency = (typeof offer.taker_pays == 'object') ? offer.taker_pays.currency : 'XRP';
            return currency;
        }

        function tgetsIssuer(offer) {
            var currency = (typeof offer.taker_gets == 'object') ? offer.taker_gets.issuer : null;
            return currency;
        }

        function tpaysIssuer(offer) {
            var currency = (typeof offer.taker_pays == 'object') ? offer.taker_pays.issuer : null;
            return currency;
        }

        var bidOffers = [],
            askOffers = [],
            otherOffers = [];

        offers.filter(function(offer) {
            if (tgetsCurrency(offer) == $scope.trading.baseCurrency &&
                tgetsIssuer(offer) == $scope.trading.baseIssuer &&
                tpaysCurrency(offer) == $scope.trading.tradeCurrency &&
                tpaysIssuer(offer) == $scope.trading.tradeIssuer) {
                askOffers.push(offer);
            } else if (tpaysCurrency(offer) == $scope.trading.baseCurrency &&
                tpaysIssuer(offer) == $scope.trading.baseIssuer &&
                tgetsCurrency(offer) == $scope.trading.tradeCurrency &&
                tgetsIssuer(offer) == $scope.trading.tradeIssuer) {
                bidOffers.push(offer);
            } else {
                otherOffers.push(offer);
            }
        });

        if (!$scope.accountOffers) $scope.accountOffers = {};
        $scope.accountOffers.all = offers;
        $scope.accountOffers.bid = bidOffers;
        $scope.accountOffers.ask = askOffers;
        $scope.accountOffers.other = otherOffers;

        $scope.trading.getOfferStatus = (bidOffers.length == 0 && askOffers.length == 0) ? 'No outstanding offers for this Trade-pair.' : '';
    }

    $scope.getAccountOffers = function() {
        $scope.accountOffers = {};
        $scope.trading.getOfferStatus = 'Refreshing...';
        $scope.accountOffers.status = 'Refreshing...';

        var options = {
            account: $scope.activeAccount,
            ledger: "validated"
        };

        remote.requestAccountOffers(options, function(err, res) {
            if (err) {
                if (err.remote) {
                    var account = err.remote.account || err.remote.request.account;
                    if (account != $scope.walletAccount._account_id) return;
                    if (err.remote.error) {
                        $scope.accountOffers.status = err.remote.error;
                        $scope.trading.getOfferStatus = err.remote.error;
                    }
                } else {
                    $scope.accountOffers.status = err.error;
                    $scope.trading.getOfferStatus = err.error;
                }
            }
            if (res) {
                if (res.account != $scope.activeAccount) return;
                $scope.accountOffers.status = 'Updated @ Ledger:' + res.ledger_index;
                $scope.accountOffers.ledger_index = res.ledger_index;

                var offers = res.offers;
                $scope.offersFilterTradePair(offers);
            }
            //$scope.$apply();
        })
    }

    $scope.prepareOfferEdit = function(options, raw_offer) {
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

        if (offer.expiration) {
            var now = Date.now();
            options.expiration = (Utils.toTimestamp(offer.expiration) - now) / (60 * 60 * 1000); // hours remaining.
        }

        var modalInstance = $uibModal.open({
            size: 'sm',
            animation: false,
            templateUrl: 'templetes/modal-offer-edit.html',
            controller: 'ModalCtrl',
            scope: $scope,
            resolve: {
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(options) {
            $scope.offerCreate(options);
        }, function() {
            // do nothing
        });

    }

    $scope.prepareOfferCancel = function(options, raw_offer) {
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
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(options) {
            $scope.offerCancel(options.offer_sequence);
        }, function() {
            // do nothing
        });

    }


    $scope.offerCancel = function(seq) {
        var transaction = remote.transaction();
        transaction.offer_cancel({
            account: $scope.activeAccount,
            offer_sequence: seq,
        });

        $scope.tradingLog = {};
        $scope.submitTransaction({
            transaction: transaction,
            log: $scope.tradingLog
        });
    }

    $scope.getMarketPrice = function() {
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

    $scope.priceAlert = function(options) {
        if (!options.market_price || !options.price) return false;
        return (Math.abs(options.price - options.market_price) / options.market_price) > DEVIATION_ALERT;
    }

    $scope.prepareOfferCreate = function(options) {
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

        options.market_price = $scope.getMarketPrice();

        var modalInstance = $uibModal.open({
            size: 'sm',
            animation: false,
            templateUrl: 'templetes/modal-offer-create.html',
            controller: 'ModalCtrl',
            scope: $scope,
            resolve: {
                options: function() {
                    return options;
                }
            }
        });

        modalInstance.result.then(function(options) {
            $scope.offerCreate(options);
            if (options.type == 'sell') {
                $scope.trading.sellQuantity = null;
                $scope.trading.sellPrice = null;
            } else if (options.type == 'buy') {
                $scope.trading.buyQuantity = null;
                $scope.trading.buyPrice = null;
            }
        }, function() {
            // do nothing
        });

    }

    $scope.offerCreate = function(options) {
        if (typeof options != 'object') return;

        var qty = options.qty;
        var price = options.price;
        var expiration = options.expiration;

        var pair = $scope.trading.pair;

        var base_amount = ($scope.trading.baseCurrency == 'XRP') ?
            String(Math.round(qty * 1000000)) : {
                "currency": $scope.trading.baseCurrency,
                "issuer": $scope.trading.baseIssuer,
                "value": qty
            }

        var trade_amount = ($scope.trading.tradeCurrency == 'XRP') ?
            String(Math.round(qty * price * 1000000)) : {
                "currency": $scope.trading.tradeCurrency,
                "issuer": $scope.trading.tradeIssuer,
                "value": qty * price
            }

        if (expiration) {
            var now = new Date();
            expiration = new Date(now.getTime() + (options.expiration * 60 * 60 * 1000));
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

        $scope.tradingLog = {};
        $scope.submitTransaction({
            transaction: transaction,
            log: $scope.tradingLog
        });
    }

    $scope.loadOrderBooks = function() {
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

        $scope.trading.bookAsk.on('model', function(offers) {
            $scope.trading.ask_status = 'updated on ledger ' + (remote.getLedgerSequence() - 1);
            $scope.trading.askOffers = offers;
        })

        $scope.trading.bookBid.on('model', function(offers) {
            $scope.trading.bid_status = 'updated on ledger ' + (remote.getLedgerSequence() - 1);
            $scope.trading.bidOffers = offers;
        })
    }

    $scope.offerPageLoad = function() {
        if (!$scope.walletAccount) {
            // $scope.setWalletAccount({
            //     address: DEFAULT_ACCOUNT,
            //     secret: DEFAULT_SECRET
            // });
            return;
        }
        if (!$scope.accountOffers.all) $scope.getAccountOffers();
    }

    $scope.offerIsSell = function(offer) {
        if (!offer) return;
        return (offer.flags & Remote.flags['offer']['Sell']) ? true : false;
    }

}]); // main controller;



// ============ modal controller =================================

walletApp.controller('ModalAddMemoCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
    $scope.memo = {};
    $scope.ok = function() {
        $uibModalInstance.close($scope.memo);
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}]);


walletApp.controller('ModalCtrl', ['$scope', '$uibModalInstance', 'options', function($scope, $uibModalInstance, options) {
    if (typeof options != 'object') options = {};
    $scope.options = options;

    $scope.ok = function() {
        $uibModalInstance.close($scope.options);
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}]);


// ============== directive ============================

walletApp.directive('rippleValidAddress', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$validators.rippleValidAddress = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return true;
                }
                return UInt160.is_valid(modelValue);
            }
        }
    }
});

walletApp.directive('rippleValidSecret', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$validators.rippleValidSecret = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) return true;

                return (modelValue[0] == 's' && Seed.from_json(modelValue).is_valid())
            }
        }
    }
});


walletApp.directive('rippleValidFederation', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$validators.rippleValidFederation = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) return true;
                var str = String(modelValue);

                // ripplename;
                var ripplename_regex = /^~[a-zA-Z0-9]([\-]?[a-zA-Z0-9]){0,19}$/;

                if (str.length > 1 && str[0] == '~') return ripplename_regex.test(str);

                // checking for email type address (e.g.xyz@domain.com)
                var domain_split = str.search(/@([\w-]+\.)+[\w-]{2,}$/);
                if (domain_split <= 0) return false;
                return true;
            }
        }
    }
}]);

walletApp.directive('positiveNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
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

walletApp.directive('uint32', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$validators.positiveNumber = function(modelValue, viewValue) {
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

walletApp.directive('rippleValidMemo', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$validators.rippleValidMemo = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) return true;
                else return /^[0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(modelValue); // url characters '
            }
        }
    }
});