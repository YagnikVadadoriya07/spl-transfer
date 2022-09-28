const web3 = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const base = require("bs58");
(async () => {
  //Create connection to devnet
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  let secretkey = Uint8Array.from([
    128, 81, 179, 133, 103, 63, 214, 162, 18, 142, 181, 123, 50, 22, 1, 67, 165,
    87, 89, 175, 161, 36, 47, 182, 76, 92, 38, 8, 141, 14, 146, 97, 49, 112,
    224, 28, 20, 113, 75, 76, 65, 107, 240, 176, 152, 11, 173, 136, 105, 87,
    145, 15, 40, 242, 3, 97, 81, 233, 74, 219, 168, 117, 185, 68,
  ]);
  const myKeypair = web3.Keypair.fromSecretKey(secretkey);
  console.log("Solana public address: " + myKeypair.publicKey.toBase58());
  const tokenMintAddress = "72RUrrjLgyjcBUk8S1L9RZPj8BQs95Vg7W3tw9zrkeHY";
  //   const nftReciver = "57LCdmugcENsLvCZasBYL7M19hhCMVhzWhGxcyTAvM88";
  const nftReciver = "BCR7uW94mAcD93tPbhM59akKLu8RGbYh7S87QbFEhL5M";
  try {
    await transfer(tokenMintAddress, myKeypair, nftReciver, connection, 1);
  } catch (error) {
    console.log(error);
  }
  console.log("done");
  setInterval(reverse, 180000);
})();

const reverse = async () => {
  //Create connection to devnet
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  //   let secretkey = Uint8Array.from([
  //     128, 81, 179, 133, 103, 63, 214, 162, 18, 142, 181, 123, 50, 22, 1, 67, 165,
  //     87, 89, 175, 161, 36, 47, 182, 76, 92, 38, 8, 141, 14, 146, 97, 49, 112,
  //     224, 28, 20, 113, 75, 76, 65, 107, 240, 176, 152, 11, 173, 136, 105, 87,
  //     145, 15, 40, 242, 3, 97, 81, 233, 74, 219, 168, 117, 185, 68,
  //   ]);
  const myKeypair = web3.Keypair.fromSecretKey(
    base.decode(
      "2raYdkvTAzACLfVPMVAMgwS8kJmF3kpds59jzKcma5n9zpzYSiEwwqErrzoPyvmiVDJPtBVqhQoWVCwMN5jVbBZ1"
    )
  );
  //   const myKeypair = web3.Keypair.fromSecretKey(secretkey);
  console.log("Solana public address: " + myKeypair.publicKey.toBase58());
  const tokenMintAddress = "AWRLiTWfqSrMrujK9VbMEoyBnhqd6Yv6V7SasukigamS";
  //   const nftReciver = "57LCdmugcENsLvCZasBYL7M19hhCMVhzWhGxcyTAvM88";
  const nftReciver = "4KzogKU9sN7DGbBDkC5fXrj3zdkWrtrN7q1htC8LLQUb";

  //   const nftReciver = "BCR7uW94mAcD93tPbhM59akKLu8RGbYh7S87QbFEhL5M";
  try {
    await transfer(tokenMintAddress, myKeypair, nftReciver, connection, 1);
  } catch (error) {
    console.log(error);
  }
  console.log("reverse");
};
async function transfer(tokenMintAddress, wallet, to, connection, amount) {
  const mintPublicKey = new web3.PublicKey(tokenMintAddress);
  const mintToken = new splToken.Token(
    connection,
    mintPublicKey,
    splToken.TOKEN_PROGRAM_ID,
    wallet
  );
  const fromtokenaccount = await mintToken.getOrCreateAssociatedAccountInfo(
    wallet.publicKey
  );
  const destPublicKey = new web3.PublicKey(to);
  const associatedDestinationTokenaddr =
    await splToken.Token.getAssociatedTokenAddress(
      mintToken.associatedProgramId,
      mintToken.programId,
      mintPublicKey,
      destPublicKey
    );
  // const receiverAccount = await connection.getAccountinfo(associatedDestinationTokenaddr);
  let transaction = await new web3.Transaction();
  transaction.add(
    splToken.Token.createAssociatedTokenAccountInstruction(
      mintToken.associatedProgramId,
      mintToken.programId,
      mintPublicKey,
      associatedDestinationTokenaddr,
      destPublicKey,
      wallet.publicKey
    )
  );
  transaction.add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromtokenaccount.address,
      associatedDestinationTokenaddr,
      wallet.publicKey,
      [],
      amount
    )
  );
  try {
    var signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet]
    );
  } catch (error) {
    console.log(error);
  }
  console.log("Transaction Signature :", signature);
  console.log("Success");
}
