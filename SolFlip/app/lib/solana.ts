import { Connection, clusterApiUrl } from '@solana/web3.js';

const network = clusterApiUrl('devnet');
const connection = new Connection(network, 'processed');

export default connection;
