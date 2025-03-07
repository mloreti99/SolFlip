const { Connection, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');
const { AnchorProvider, Program, web3, Wallet } = require('@coral-xyz/anchor');
const idl = require('./solflip_idl.json');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = JSON.parse(fs.readFileSync('./id.json', 'utf-8'));
const wallet = web3.Keypair.fromSecretKey(new Uint8Array(SECRET_KEY));
const connection = new Connection(web3.clusterApiUrl('devnet'), 'processed');
const provider = new AnchorProvider(connection, new Wallet(wallet), {});
const program = new Program(idl, new PublicKey('YOUR_PROGRAM_ID_HERE'), provider);

const placeBet = async (choice, amount) => {
    try {
        const [betPDA] = PublicKey.findProgramAddressSync([
            Buffer.from('bet'),
            wallet.publicKey.toBuffer()
        ], program.programId);

        const transaction = await program.methods.placeBet(
            choice, 
            new web3.BN(web3.LAMPORTS_PER_SOL * amount)
        )
        .accounts({
            bet: betPDA,
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .transaction();

        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.sign(wallet);

        const txid = await connection.sendRawTransaction(transaction.serialize());
        console.log(`Bet placed! Tx ID: ${txid}`);
    } catch (error) {
        console.error('Error placing bet:', error);
    }
};

// Automate bets every 30 seconds
setInterval(() => {
    const choice = Math.random() < 0.5 ? 0 : 1;
    const amount = 0.1; // 0.1 SOL per bet
    placeBet(choice, amount);
}, 30000);
