# SolFlip
SolFlip is a trustless, decentralised betting platform built on Solana, allowing users to wager on fair, verifiable coin flips.
This repository includes smart contract code, a bot for automated interactions, and test cases to ensure contract functionality.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Overview

SolFlip allows users to place bets on-chain using Solana smart contracts. The project leverages Anchor for easier Solana program development and testing.

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 16.x)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli)
- `yarn` or `npm` for package management

### Clone the Repository

```sh
git clone https://github.com/mloreti99/SolFlip.git
cd SolFlip
```

### Install Dependencies

```sh
yarn install
# or
npm install
```

## Usage

### Deploying the Smart Contract

To deploy the smart contract, ensure you are connected to a Solana cluster and run:

```sh
anchor build
anchor deploy
```

### Running the Bot

The bot automates betting interactions with the smart contract.

```sh
node bots/solflip_bot.js
```

## Testing

The project includes unit tests using Mocha and Anchor.

To run tests:

```sh
anchor test
```

The test script (`Solflip Test`) verifies:

- Bet initialization
- Data storage integrity
- Successful transaction execution

## Project Structure

```
SolFlip/
├── README.md
├── SolFlip
│   ├── Anchor.toml
│   ├── app
│   │   ├── components
│   │   ├── lib
│   │   └── pages
│   ├── bots
│   │   └── solflip_bot.js
│   ├── migrations
│   ├── programs
│   │   └── solflip
│   ├── scripts
│   └── tests
│       └── solflip.js
├── node_modules  # Contains dependencies, usually not listed
├── package-lock.json
└── package.json


