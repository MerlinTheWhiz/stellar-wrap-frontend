/**
 * Mock Indexer Service for Stellar Wrap Issue #36
 * 
 * NOTE: This is a placeholder service until Issue #34 (Stellar Horizon API Indexer Service)
 * is fully implemented and merged. It simulates network delay and returns successfully
 * to unblock frontend development of indexing feedback states.
 */

class IndexerService {
  /**
   * Simulates fetching and indexing an account's transactions.
   * @param address The Stellar public key to index
   * @returns Promise that resolves when indexing is "complete"
   */
  async fetchAccountTransactions(address: string): Promise<void> {
    console.log(`[Mock Indexer Service] Starting indexing for address: ${address}`);
    
    // Simulate a network delay (e.g., 2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    // Randomly fail sometimes for testing error states (uncomment to test)
    // if (Math.random() < 0.2) {
    //  throw new Error("Simulated indexing failure");
    // }

    console.log(`[Mock Indexer Service] Finished indexing for address: ${address}`);
    return Promise.resolve();
  }
}

export const indexerService = new IndexerService();
