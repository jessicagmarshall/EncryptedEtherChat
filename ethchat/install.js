let signal = require('signal-protocol')


// install time - generate the client's identity keys, registration id, and prekeys
let KeyHelper = signal.KeyHelper
let registrationId = KeyHelper.generateRegistrationId()   // keep this someplace safe

// generate longterm identity priv & pubkey pair
KeyHelper.generateIdentityKeyPair().then((identityKeyPair) => {
  console.log(identityKeyPair)
})

// generate medium-term signed prekey pair
KeyHelper.generatePreKey().then((preKey) => {
  console.log(preKey)
  store.storePreKey(preKey.keyId, preKey.keyPair);
})
