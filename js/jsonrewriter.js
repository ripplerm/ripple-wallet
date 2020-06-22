
function convertHexToString(hexString) {
  var bits = ripple.sjcl.codec.hex.toBits(hexString);
  return ripple.sjcl.codec.utf8String.fromBits(bits);
}

var isEmptyObject = function (obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Calculate executed order price
 *
 * @param effect
 * @returns {*}
 */
var getPrice = function(effect, referenceDate){
  var g = effect.got ? effect.got : effect.gets;
  var p = effect.paid ? effect.paid : effect.pays;
  var price;

  if (!p.is_zero() && !g.is_zero()) {
    if (effect.sell) {
      price = p.ratio_human(g, {reference_date: referenceDate});
    }
    else {
      price = g.ratio_human(p, {reference_date: referenceDate});
    }
  }

  return price || 0;
};

/**
 * Determine if the transaction is a "rippling" transaction based on effects
 *
 * @param effects
 */
var isRippling = function(effects){
  if (
    effects
    && effects.length
    && 2 === effects.length
    && 'trust_change_balance' == effects[0].type
    && 'trust_change_balance' == effects[1].type
    && effects[0].currency == effects[1].currency
    && !effects[0].amount.compareTo(effects[1].amount.negate())
  ) {
    return true;
  }
};

/**
 * Simple static class for processing server-side JSON.
 */
var JsonRewriter = {
  /**
   * Filter affected nodes by type.
   *
   * If affectedNodes is not a valid set of nodes, returns an empty array.
   */
  filterAnodes: function (affectedNodes, type) {
    if (!affectedNodes) return [];

    return affectedNodes.filter(function (an) {
      an = an.CreatedNode ? an.CreatedNode :
          an.ModifiedNode ? an.ModifiedNode :
          {};

      return an.LedgerEntryType === type;
    });
  },

  /**
   * Returns resulting (new or modified) fields from an affected node.
   */
  getAnodeResult: function (an) {
    an = an.CreatedNode ? an.CreatedNode :
        an.ModifiedNode ? an.ModifiedNode :
        {};

    var fields = Object.assign({}, an.NewFields, an.FinalFields);

    return fields;
  },

  /**
   * Takes a metadata affected node and returns a simpler JSON object.
   *
   * The resulting object looks like this:
   *
   *   {
   *     // Type of diff, e.g. CreatedNode, ModifiedNode
   *     diffType: 'CreatedNode'
   *
   *     // Type of node affected, e.g. RippleState, AccountRoot
   *     entryType: 'RippleState',
   *
   *     // Index of the ledger this change occurred in
   *     ledgerIndex: '01AB01AB...',
   *
   *     // Contains all fields with later versions taking precedence
   *     //
   *     // This is a shorthand for doing things like checking which account
   *     // this affected without having to check the diffType.
   *     fields: {...},
   *
   *     // Old fields (before the change)
   *     fieldsPrev: {...},
   *
   *     // New fields (that have been added)
   *     fieldsNew: {...},
   *
   *     // Changed fields
   *     fieldsFinal: {...}
   *   }
   */
  processAnode: function (an) {
    var result = {};

    ["CreatedNode", "ModifiedNode", "DeletedNode"].forEach(function (x) {
      if (an[x]) result.diffType = x;
    });

    if (!result.diffType) return null;

    an = an[result.diffType];

    result.entryType = an.LedgerEntryType;
    result.ledgerIndex = an.LedgerIndex;

    result.fields = Object.assign({}, an.PreviousFields, an.NewFields, an.FinalFields);
    result.fieldsPrev = an.PreviousFields || {};
    result.fieldsNew = an.NewFields || {};
    result.fieldsFinal = an.FinalFields || {};

    return result;
  },

  /**
   * Takes a transaction and its metadata and returns the amount sent as:
   *
   * If XRP, value sent as String
   *
   * If not XRP,
      {
       value: value sent as String,
       currency: currency code of value sent
      }
    *
    * If unable to determine, returns undefined
    *
    * If the caller needs the issuer of sent currency as well, try tx.sendMax.issuer
   */
  getAmountSent: function (tx, meta) {
    var sender = tx.Account;
    var difference = null;
    var cur = null;
    var i;
    var affectedNode;
    var amtSent;

    if (tx.TransactionType === "Payment") {
      /*
      if (meta.delivered_amount) {
        return meta.delivered_amount;
      }
      */

      if (meta.AffectedNodes) {
        // Find the metadata node with entry type == "RippleState"
        // and either HighLimit.issuer == [sender's account] or
        // LowLimit.issuer == [sender's account] and
        // Balance.currency == [currency of SendMax || Amount]
        if (tx.SendMax && tx.SendMax.currency) {
          for (i = 0; i < meta.AffectedNodes.length; i++) {
            affectedNode = meta.AffectedNodes[i];
            if (affectedNode.ModifiedNode && affectedNode.ModifiedNode.LedgerEntryType === "RippleState" &&
              (affectedNode.ModifiedNode.FinalFields.HighLimit.issuer === sender ||
                affectedNode.ModifiedNode.FinalFields.LowLimit.issuer === sender) &&
              affectedNode.ModifiedNode.FinalFields.Balance.currency === tx.SendMax.currency) {

              // Calculate the difference before/after. If HighLimit.issuer == [sender's account] negate it.
              difference = affectedNode.ModifiedNode.PreviousFields.Balance.value - affectedNode.ModifiedNode.FinalFields.Balance.value;
              if (affectedNode.ModifiedNode.FinalFields.HighLimit.issuer === sender) difference *= -1;
              cur = affectedNode.ModifiedNode.FinalFields.Balance.currency;
              break;
            }
          }
        }

        if (difference === null) {
          // Find the metadata node with entry type == "AccountRoot" and Account == [sender's account].
          for (i = 0; i < meta.AffectedNodes.length; i++) {
            affectedNode = meta.AffectedNodes[i];
            if (affectedNode.ModifiedNode && affectedNode.ModifiedNode.LedgerEntryType === "AccountRoot" &&
              affectedNode.ModifiedNode.FinalFields && affectedNode.ModifiedNode.FinalFields.Account === sender) {

              // Calculate the difference minus the fee
              difference = affectedNode.ModifiedNode.PreviousFields.Balance - affectedNode.ModifiedNode.FinalFields.Balance - tx.Fee;
              break;
            }
          }
        }

        if (difference) {  // calculated and non-zero
          var diff = String(difference);
          amtSent = cur ? {value: diff, currency:cur} : diff;
          if (tx.SendMax) {
            amtSent.issuer = tx.SendMax.issuer;
          }
        }
      }
    }

    return amtSent;
  },

  /**
   * Convert transactions into a more useful (for our purposes) format.
   *
   * The main operation this function performs is to change the view on the
   * transaction from a neutral view to a subjective view specific to our
   * account.
   *
   * For example, rather than having a sender and receiver, the transaction has
   * a counterparty and a flag whether it is incoming or outgoing.
   *
   * processTxn returns main purpose of transaction and side effects.
   *
   * Main purpose
   *  Real transaction names
   *  - Payment (sent/received/exchange)
   *  - TrustSet (trusting/trusted)
   *  - OfferCreate (offernew)
   *  - OfferCancel (offercancel)
   *
   *  Virtual transaction names
   *  - Failed
   *  - Rippling
   *
   * Side effects
   *  - balance_change
   *  - Trust (trust_create_local, trust_create_remote, trust_change_local,
   *          trust_change_remote, trust_change_balance, trust_change_flags)
   *  - Offer (offer_created, offer_funded, offer_partially_funded,
   *          offer_cancelled, offer_bought)
   *  - Other (regular_key_added, regular_key_changed, regular_key_removed)
   */
  processTxn: function (tx, meta, account) {
    try {
      return JsonRewriter._processTxn(tx, meta, account);
    } catch (err) {
      var transaction = {};
      transaction.type = 'error';
      if (tx && 'object' === typeof tx) {
        transaction.hash = tx.hash;
        transaction.date = ripple.utils.toTimestamp(tx.date);
        transaction.dateRaw = tx.date;
      } else {
        transaction.hash = 'unknown';
        transaction.date = new Date().getTime();
        transaction.dateRaw = ripple.utils.fromTimestamp(transaction.date);
      }
      return {transaction: transaction, error: err};
    }
  },

  _processTxn: function (tx, meta, account) {
    var obj = {};

    // Currency balances that have been affected by the transaction
    var affected_currencies = [];

    // Main transaction
    if (tx.Account === account
        || (tx.Destination && tx.Destination === account)
        || (tx.LimitAmount && tx.LimitAmount.issuer === account)) {

      var transaction = {};

      if ('tesSUCCESS' === meta.TransactionResult) {
        switch (tx.TransactionType) {
          case 'Payment':
            var amount = ripple.Amount.from_json(tx.Amount);

            transaction.amount = amount;
            transaction.currency = amount.currency().to_human();
            transaction.amountDelivered = meta.DeliveredAmount || amount;

            var amtSent = JsonRewriter.getAmountSent(tx, meta);
            if (amtSent) transaction.amountSent = ripple.Amount.from_json(amtSent);

            if (typeof tx.SendMax === 'object') transaction.sendMax = tx.SendMax;

            if (tx.Account === account) {
              if (tx.Destination === account) {
                transaction.type = 'exchange';
                transaction.spent = amtSent || ripple.Amount.from_json(tx.SendMax);
              }
              else {
                transaction.type = 'sent';
                transaction.counterparty = tx.Destination;
              }
            }
            else {
              transaction.type = 'received';
              transaction.counterparty = tx.Account;
            }
            break;

          case 'TrustSet':
            transaction.type = tx.Account === account ? 'trusting' : 'trusted';
            transaction.counterparty = tx.Account === account ? tx.LimitAmount.issuer : tx.Account;
            transaction.amount = ripple.Amount.from_json(tx.LimitAmount);
            transaction.currency = tx.LimitAmount.currency;
            break;

          case 'OfferCreate':
            transaction.type = 'offernew';
            transaction.pays = ripple.Amount.from_json(tx.TakerPays);
            transaction.gets = ripple.Amount.from_json(tx.TakerGets);
            transaction.sell = tx.Flags & ripple.Transaction.flags.OfferCreate.Sell;
            transaction.price = getPrice(transaction, tx.date);
            break;

          case 'OfferCancel':
            transaction.type = 'offercancel';
            break;

          case 'SetRegularKey':
            transaction.type = 'setregularkey';
            break;

          case 'AccountSet':
            // // Ignore empty accountset transactions. (Used to sync sequence numbers)
            // if (meta.AffectedNodes.length === 1 && _.size(meta.AffectedNodes[0].ModifiedNode.PreviousFields) === 2)
            //   break;

            transaction.type = 'accountset';
            break;

          case 'SignerListSet':
            transaction.type = 'signerlistset';
            break;

          case 'AccountDelete':
            transaction.type = 'accountDelete';
            break;

          default:
            console.log('Unknown transaction type: "' + tx.TransactionType + '"', tx);
        }

        if (tx.Flags) {
          transaction.flags = tx.Flags;
        }
      } else {
        transaction.type = 'failed';
      }

      if (!isEmptyObject(transaction)) {
        obj.transaction = transaction;
      }
    }

    // Side effects
    if ('tesSUCCESS' === meta.TransactionResult) {
      meta.AffectedNodes.forEach(function (n) {
        var node = JsonRewriter.processAnode(n);
        var feeEff;
        var effect = {};

        // AccountRoot - Current account node
        if (node.entryType === "AccountRoot" && node.fields.Account === account) {
          obj.accountRoot = node.fields;

          if (node.fieldsPrev.Balance) {
            var balance = ripple.Amount.from_json(node.fields.Balance);

            // Fee
            if(tx.Account === account && tx.Fee) {
              feeEff = {
                type: "fee",
                amount: ripple.Amount.from_json(tx.Fee).negate(),
                balance: balance
              };
            }

            // Updated XRP Balance
            if (tx.Fee != node.fieldsPrev.Balance - node.fields.Balance) {
              if (feeEff)
                balance = balance.subtract(feeEff.amount);

              effect.type = "balance_change";
              effect.amount = balance.subtract(node.fieldsPrev.Balance);
              effect.balance = balance;

              // balance_changer is set to true if the transaction / effect has changed one of the account balances
              obj.balance_changer = effect.balance_changer = true;
              affected_currencies.push('XRP');
            }

            // Updated the regular key
            if (obj.transaction && obj.transaction.type == 'setregularkey') {
              // Added a regular key
              if (!node.fieldsPrev.RegularKey && node.fieldsFinal.RegularKey) {
                effect.type = 'regular_key_added';
                effect.address = node.fields.RegularKey
              }

              // Removed the regular key
              else if (node.fieldsPrev.RegularKey && !node.fieldsFinal.RegularKey) {
                effect.type = 'regular_key_removed';
                effect.address = node.fieldsPrev.RegularKey;
              }

              // Changed the regular key
              else if (node.fieldsPrev.RegularKey != node.fieldsFinal.RegularKey) {
                effect.type = 'regular_key_changed';
                effect.newAddress = node.fields.RegularKey;
                effect.oldAddress = node.fieldsPrev.RegularKey;
              }
            }
          }
        }

        // RippleState - Ripple Lines
        if (node.entryType === "RippleState"
            && (node.fields.HighLimit.issuer === account || node.fields.LowLimit.issuer === account)) {

          var high = node.fields.HighLimit;
          var low = node.fields.LowLimit;

          // New trust line
          if (node.diffType === "CreatedNode") {
            if (node.fields.Balance.value === '0') {
              effect.type = tx.Account === account ? "trust_create_local" : "trust_create_remote";
            } else {
              effect.type = "trust_change_balance";
              effect.amount = effect.balance;
              obj.balance_changer = effect.balance_changer = true;
              affected_currencies.push(high.currency.toUpperCase());
            }
          }

          // Modified trust line
          else if (node.diffType === "ModifiedNode" || node.diffType === "DeletedNode") {
            var highPrev = node.fieldsPrev.HighLimit;
            var lowPrev = node.fieldsPrev.LowLimit;

            // Trust Balance change
            if (node.fieldsPrev.Balance) {
              effect.type = "trust_change_balance";

              var issuer =  node.fields.Balance.value > 0 || node.fieldsPrev.Balance.value > 0
                  ? high.issuer : low.issuer;

              effect.amount = high.issuer === account
                  ? effect.amount = ripple.Amount.from_json(
                  node.fieldsPrev.Balance.value
                      + "/" + node.fieldsPrev.Balance.currency
                      + "/" + issuer).subtract(node.fields.Balance)
                  : effect.amount = ripple.Amount.from_json(
                  node.fields.Balance.value
                      + "/" + node.fields.Balance.currency
                      + "/" + issuer).subtract(node.fieldsPrev.Balance);

              obj.balance_changer = effect.balance_changer = true;
              affected_currencies.push(high.currency.toUpperCase());
            }

            // Trust Limit change
            else if (highPrev || lowPrev) {
              effect.type = tx.Account === account ? "trust_change_local" : "trust_change_remote";
              if (highPrev) effect.prevLimit = ripple.Amount.from_json(highPrev);
              else if (lowPrev) effect.prevLimit = ripple.Amount.from_json(lowPrev);
            }

            if (node.diffType === "ModifiedNode" && node.fieldsPrev.Flags && node.fieldsPrev.Flags !== node.fields.Flags) {
              if (! effect.type) {
                // effect gets this type only if nothing else but flags has been changed
                effect.type = "trust_change_flags";
              }

              effect.flags_changed = [];
              var isHigh = (high.issuer === account);
              ['NoRipple', 'Freeze', 'Auth'].forEach(function (f) {
                ['High', 'Low'].forEach(function (h) {
                  var flag = h + f;
                  var action = undefined;
                  if (node.fields.Flags & ripple.Remote.flags.state[flag] &&
                    !(node.fieldsPrev.Flags & ripple.Remote.flags.state[flag])) {
                    action = '_set';
                  } else if (node.fieldsPrev.Flags & ripple.Remote.flags.state[flag] &&
                  !(node.fields.Flags & ripple.Remote.flags.state[flag])) {
                    action = '_removed';
                  }
                  if (!action) return;
                  var eff = f.toLowerCase() + action;
                  if ((h == 'High' && !isHigh) || (h == 'Low' && isHigh)) {
                    eff = eff + '_peer';
                  };
                  effect.flags_changed.push(eff);
                });
              });
            }

            // Trustline deleted
            if (node.diffType === "DeletedNode") {
              effect.deleted = true;
            }
          }

          if (!isEmptyObject(effect)) {
            effect.counterparty = high.issuer === account ? low.issuer : high.issuer;
            effect.currency = high.currency;
            effect.balance = high.issuer === account
                ? ripple.Amount.from_json(node.fields.Balance).negate(true)
                : ripple.Amount.from_json(node.fields.Balance);
            effect.limit = ripple.Amount.from_json(high.issuer === account ? high : low);
            effect.limit_peer = ripple.Amount.from_json(high.issuer === account ? low : high);

            var isHigh = (high.issuer === account);
            var flags = effect.flags = node.fields.Flags;
            var Flags = ripple.Remote.flags['state'];

            effect.authorized = isHigh? Flags['HighAuth'] & flags : Flags['LowAuth'] & flags;
            effect.peer_authorized = isHigh? Flags['LowAuth'] & flags : Flags['HighAuth'] & flags;
            effect.freeze = isHigh? Flags['HighFreeze'] & flags : Flags['LowFreeze'] & flags;
            effect.freeze_peer = isHigh? Flags['LowFreeze'] & flags : Flags['HighFreeze'] & flags;
            effect.no_ripple = isHigh? Flags['HighNoRipple'] & flags : Flags['LowNoRipple'] & flags;
            effect.no_ripple_peer = isHigh? Flags['LowNoRipple'] & flags : Flags['HighNoRipple'] & flags;

            effect.quality_in = isHigh ? 
                                  node.fieldsNew['HighQualityIn'] || node.fieldsFinal['HighQualityIn'] : 
                                  node.fieldsNew['LowQualityIn'] || node.fieldsFinal['LowQualityIn']; 
            effect.quality_out = isHigh ? 
                                  node.fieldsNew['HighQualityOut'] || node.fieldsFinal['HighQualityOut'] : 
                                  node.fieldsNew['LowQualityOut'] || node.fieldsFinal['LowQualityOut']; 
          }
        }

        // Offer
        else if (node.entryType === "Offer") {

          // For new and cancelled offers we use "fields"
          var fieldSet = node.fields;

          // Flags
          if (node.fields.Flags) {
            effect.flags = node.fields.Flags;
            effect.sell = node.fields.Flags & ripple.Remote.flags.offer.Sell;
          }

          // Current account offer
          if (node.fields.Account === account) {

            // Partially funded offer [and deleted.. no more funds]
            /* Offer has been partially funded and deleted (because of the luck of funds)
             if the node is deleted and the TakerGets/TakerPays field has been changed */
            if (node.diffType === "ModifiedNode" ||
                (node.diffType === "DeletedNode"
                    && node.fieldsPrev.TakerGets
                    && !ripple.Amount.from_json(node.fieldsFinal.TakerGets).is_zero())) {
              effect.type = 'offer_partially_funded';

              if (node.diffType !== "DeletedNode") {
                effect.remaining = effect.sell ?
                  ripple.Amount.from_json(node.fields.TakerGets) :
                  ripple.Amount.from_json(node.fields.TakerPays) ;
              }
              else {
                effect.cancelled = true;
              }
            }
            else {
              // New / Funded / Cancelled offer
              effect.type = node.diffType === "CreatedNode"
                  ? 'offer_created'
                  : node.fieldsPrev.TakerPays
                  ? 'offer_funded'
                  : 'offer_cancelled';

              // For funded offers we use "fieldsPrev".
              if (effect.type === 'offer_funded')
                fieldSet = node.fieldsPrev;

              // We don't count cancelling an offer as a side effect if it's
              // already the primary effect of the transaction.
              if (effect.type === 'offer_cancelled' &&
                  obj.transaction &&
                  obj.transaction.type === "offercancel") {

                // Fill in remaining information about offer
                obj.transaction.gets = ripple.Amount.from_json(fieldSet.TakerGets);
                obj.transaction.pays = ripple.Amount.from_json(fieldSet.TakerPays);
                obj.transaction.sell = effect.sell;
                obj.transaction.price = getPrice(obj.transaction, tx.date);
              }
            }

            effect.expiration = +node.fields.Expiration;
            effect.seq = +node.fields.Sequence;
          }

          // Another account offer. We care about it only if our transaction changed the offer amount (we bought currency)
          else if(tx.Account === account && !isEmptyObject(node.fieldsPrev) /* Offer is unfunded if node.fieldsPrev is empty */) {
            effect.type = 'offer_bought';
            if (obj.transaction && obj.transaction.type == 'offernew') {
              effect.ownSell = obj.transaction.sell;
              effect.sell = !obj.transaction.sell;
            }
          }

          if (effect.type) {
            effect.gets = ripple.Amount.from_json(fieldSet.TakerGets);
            effect.pays = ripple.Amount.from_json(fieldSet.TakerPays);

            if ('offer_partially_funded' === effect.type || 'offer_bought' === effect.type) {
              effect.got = ripple.Amount.from_json(node.fieldsPrev.TakerGets).subtract(node.fields.TakerGets);
              effect.paid = ripple.Amount.from_json(node.fieldsPrev.TakerPays).subtract(node.fields.TakerPays);
            }
          }

          if (effect.gets && effect.pays) {
            effect.price = getPrice(effect, tx.date);
          }
        }

        if (!isEmptyObject(effect)) {
          if (node.diffType === "DeletedNode") {
            effect.deleted = true;
          }

          if (!obj.effects) obj.effects = [];
          obj.effects.push(effect);
        }

        // Fee effect
        if (feeEff) {
          if (!obj.effects) obj.effects = [];
          obj.effects.push(feeEff);
        }
      });
    }

    // Balance after the transaction
    if (obj.accountRoot && obj.transaction && "undefined" === typeof obj.transaction.balance) {
      obj.transaction.balance = ripple.Amount.from_json(obj.accountRoot.Balance);
    }

    if (isEmptyObject(obj))
      return;

    // If the transaction didn't wind up cancelling an offer
    if (tx.TransactionType === 'OfferCancel' && obj.transaction &&
      (!obj.transaction.gets || !obj.transaction.pays)) {
      return;
    }

    // Rippling transaction
    if (isRippling(obj.effects)) {
      if (!obj.transaction) {
        obj.transaction = {};
      }
      obj.transaction.type = 'rippling';
    }

    // parse memos
    if (tx.Memos) {
      obj.memos = [];
      tx.Memos.forEach(function (m) {
        var memo = {};
        if (m.Memo.MemoType) memo.memoType = convertHexToString(m.Memo.MemoType);
        if (m.Memo.MemoFormat) memo.memoFormat = convertHexToString(m.Memo.MemoFormat);
        if (m.Memo.MemoData) {
          if (memo.memoFormat === 'hex') {
            // retain original hex data
            memo.memoData = m.Memo.MemoData;
          } else {
            memo.memoData = convertHexToString(m.Memo.MemoData);
          }
        }
        obj.memos.push(memo);
      })
    }

    obj.tx_type = tx.TransactionType;
    obj.tx_result = meta.TransactionResult;
    obj.fee = tx.Fee;
    obj.date = ripple.utils.toTimestamp(tx.date);
    obj.dateRaw = tx.date;
    obj.hash = tx.hash;
    obj.affected_currencies = affected_currencies ? affected_currencies : [];
    obj.ledger_index = tx.ledger_index;
    obj.raw = tx;
    obj.meta = meta;

    return obj;
  }
};
