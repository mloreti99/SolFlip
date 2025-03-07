import { useState } from 'react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import idl from '../solflip_idl.json';

const programID = new PublicKey('YOUR_PROGRAM_ID_HERE');
const network = web3.clusterApiUrl('devnet');

const FlipUI = ({ connection }) => {
    const { publicKey, sendTransaction } = useWallet();
    const [betChoice, setBetChoice] = useState(null);
    const [betAmount, setBetAmount] = useState(0.1);
    const [result, setResult] = useState(null);

    const handleBet = async () => {
        if (!publicKey) return alert('Connect your wallet!');

        const provider = new AnchorProvider(connection, window.solana, {});
        const program = new Program(idl, programID, provider);

        const [betPDA] = PublicKey.findProgramAddressSync([
            Buffer.from('bet'),
            publicKey.toBuffer()
        ], programID);

        const transaction = await program.methods.placeBet(
            betChoice,
            new web3.BN(web3.LAMPORTS_PER_SOL * betAmount)
        )
        .accounts({
            bet: betPDA,
            user: publicKey,
            systemProgram: SystemProgram.programId,
        })
        .transaction();

        const tx = await sendTransaction(transaction, connection);
        console.log('Transaction sent:', tx);
        setResult('Bet placed! Waiting for result...');
    };

    return (
        <div className="flip-container">
            <h2>Flip a Coin</h2>
            <button onClick={() => setBetChoice(0)}>Heads</button>
            <button onClick={() => setBetChoice(1)}>Tails</button>
            <input 
                type="number" 
                value={betAmount} 
                onChange={(e) => setBetAmount(parseFloat(e.target.value))} 
            />
            <button onClick={handleBet} disabled={betChoice === null}>Place Bet</button>
            {result && <p>{result}</p>}
        </div>
    );
};

export default FlipUI;