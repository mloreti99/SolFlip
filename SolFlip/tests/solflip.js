const anchor = require('@coral-xyz/anchor');
const { PublicKey, SystemProgram } = require('@solana/web3.js');
const assert = require('assert');

describe('solflip', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Solflip;

    let betPDA;

    it('Initializes a bet and verifies storage', async () => {
        [betPDA] = PublicKey.findProgramAddressSync([
            Buffer.from('bet'),
            provider.wallet.publicKey.toBuffer()
        ], program.programId);

        const betAmount = new anchor.BN(1000000);

        const tx = await program.methods.placeBet(0, betAmount)
            .accounts({
                bet: betPDA,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log('Transaction Signature:', tx);
        assert.ok(tx);

        // Fetch the bet account state to verify the stored data
        const betAccount = await program.account.bet.fetch(betPDA);
        console.log('Bet Account:', betAccount);

        // Verify stored values
        assert.ok(betAccount.amount.eq(betAmount), 'Bet amount mismatch');
        assert.deepStrictEqual(betAccount.user, provider.wallet.publicKey, 'User mismatch');
    });
});