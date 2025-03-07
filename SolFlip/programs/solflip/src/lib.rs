use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::clock::Clock;

// Define the program ID
#[program]
mod solflip {
    use super::*;

    pub fn place_bet(ctx: Context<PlaceBet>, choice: u8, amount: u64) -> Result<()> {
        require!(choice == 0 || choice == 1, ErrorCode::InvalidChoice);
        
        let bet = &mut ctx.accounts.bet;
        let user = &ctx.accounts.user;
        
        let clock = Clock::get()?;
        let random_seed = clock.slot as u64; 
        let outcome = (random_seed % 2) as u8;

        let winnings = if outcome == choice {
            amount * 2
        } else {
            0
        };

        bet.user = *user.key;
        bet.choice = choice;
        bet.outcome = outcome;
        bet.amount = amount;
        bet.winnings = winnings;

        if winnings > 0 {
            **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += winnings;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(init, payer = user, space = 8 + 40)]
    pub bet: Account<'info, Bet>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Bet {
    pub user: Pubkey,
    pub choice: u8,
    pub outcome: u8,
    pub amount: u64,
    pub winnings: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid choice. Choose 0 for Heads or 1 for Tails.")]
    InvalidChoice,
}