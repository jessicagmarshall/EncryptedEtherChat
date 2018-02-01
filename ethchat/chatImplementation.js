let libsignal = require('signal-protocol')
let SignalProtocolStore = require('../test/InMemorySignalProtocolStore')
let util = require('../ethChat/node_modules/signal-protocol/src/helpers.js');

let KeyHelper = libsignal.KeyHelper;

// define function to generate client identity
function generateIdentity (store) {
    return Promise.all([
        KeyHelper.generateIdentityKeyPair(),
        KeyHelper.generateRegistrationId(),
    ]).then(function(result) {
        store.put('identityKey', result[0]);
        store.put('registrationId', result[1]);
    });
}

// define function to generate prekey bundle
function generatePreKeyBundle (store, preKeyId, signedPreKeyId) {
    return Promise.all([
        store.getIdentityKeyPair(),
        store.getLocalRegistrationId()
    ]).then(function(result) {
        let identity = result[0];
        let registrationId = result[1];

        return Promise.all([
            KeyHelper.generatePreKey(preKeyId),
            KeyHelper.generateSignedPreKey(identity, signedPreKeyId),
        ]).then(function(keys) {
            let preKey = keys[0]
            // console.log('preKey', preKey)
            let signedPreKey = keys[1];
            // console.log('signedPreKey', signedPreKey)

            store.storePreKey(preKeyId, preKey.keyPair);
            store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);

            return {
                identityKey: identity.pubKey,
                registrationId : registrationId,
                preKey:  {
                    keyId     : preKeyId,
                    publicKey : preKey.keyPair.pubKey
                },
                signedPreKey: {
                    keyId     : signedPreKeyId,
                    publicKey : signedPreKey.keyPair.pubKey,
                    signature : signedPreKey.signature
                }
            };
        }).catch(() => { console.log('failed')});
    }).catch(() => { console.log('failed')});
}

// libsignal.SignalProtocolAddress(name, deviceId)
let ALICE_ADDRESS = new libsignal.SignalProtocolAddress("xxxxxxxxx", 1);
let BOB_ADDRESS   = new libsignal.SignalProtocolAddress("yyyyyyyyyyyyy", 1);
console.log(ALICE_ADDRESS, BOB_ADDRESS)

    let aliceStore = new SignalProtocolStore();
    let bobStore = new SignalProtocolStore();
    // randomly selected values
    let bobPreKeyId = 1337;
    let bobSignedKeyId = 1;

    let Curve = libsignal.Curve;

        Promise.all([
            generateIdentity(aliceStore),
            generateIdentity(bobStore),
        ]).then(function() {
            return generatePreKeyBundle(bobStore, bobPreKeyId, bobSignedKeyId);
        })
        .then(function(preKeyBundle) {
            let builder = new libsignal.SessionBuilder(aliceStore, BOB_ADDRESS);
            // return builder.processPreKey(preKeyBundle)
            // .then(function() {
            //
            //   let originalMessage = util.toArrayBuffer("my message ......");
            //   let aliceSessionCipher = new libsignal.SessionCipher(aliceStore, BOB_ADDRESS);
            //   let bobSessionCipher = new libsignal.SessionCipher(bobStore, ALICE_ADDRESS);
            //
            //
            //   // aliceSessionCipher.encrypt(originalMessage).then(function(ciphertext) {
            //   //
            //   //     // check for ciphertext.type to be 3 which includes the PREKEY_BUNDLE
            //   //     return bobSessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary');
            //   //
            //   // }).then(function(plaintext) {
            //   //
            //   //     alert(plaintext);
            //   //
            //   // });
            //   //
            //   // bobSessionCipher.encrypt(originalMessage).then(function(ciphertext) {
            //   //
            //   //     return aliceSessionCipher.decryptWhisperMessage(ciphertext.body, 'binary');
            //   //
            //   // }).then(function(plaintext) {
            //   //
            //   //     assertEqualArrayBuffers(plaintext, originalMessage);
            //   //
            //   // });
            //
            // });
        });
