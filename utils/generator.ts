import { Batch } from '../types';

/**
 * Returns a random integer between min and max (inclusive)
 */
const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Logical multipliers for creating meaningful bundles.
 * e.g., for 50 millimes, we usually save 10, 20, or 50 pieces at once, not 3 pieces.
 */
const BUNDLE_SIZES: Record<number, number[]> = {
  0.050: [10, 20, 40, 50, 100],        // 0.5, 1.0, 2.0, 2.5, 5.0 DT
  0.100: [10, 20, 50, 100],            // 1, 2, 5, 10 DT
  0.200: [5, 10, 25, 50],              // 1, 2, 5, 10 DT
  0.500: [2, 4, 10, 20],               // 1, 2, 5, 10 DT
  1.000: [1, 2, 5, 10],                // 1, 2, 5, 10 DT
  2.000: [1, 2, 5],                    // 2, 4, 10 DT
  5.000: [1, 2, 4],                    // 5, 10, 20 DT
  10.000: [1, 2, 3],                   // 10, 20, 30 DT
  20.000: [1, 2],
  50.000: [1]
};

export const generateBatches = (targetAmount: number, selectedDenomValues: number[]): Batch[] => {
  let remaining = Math.round(targetAmount * 1000); // Work in Millimes to avoid float issues
  const batches: Batch[] = [];
  const sortedDenoms = [...selectedDenomValues].sort((a, b) => b - a); // Largest first

  // Safety check: ensure we have denominations
  if (sortedDenoms.length === 0) return [];

  let batchIdCounter = 1;

  while (remaining > 0) {
    // Filter denoms that fit into remaining amount at least once
    const availableDenoms = sortedDenoms.filter(val => (val * 1000) <= remaining);
    
    // If no denomination fits (e.g. remaining 50m but smallest selected is 100m)
    // We must use the smallest available and "overfill" slightly or handle differently.
    // For this app, we will force the last step to match exactly if possible, 
    // or stop if mathematically impossible with selection (user error in selection).
    // However, to be robust, if we get stuck, we break the loop and alert or handle remainder.
    
    if (availableDenoms.length === 0) {
       // Fallback: Use the smallest selected denomination to finish it off, 
       // even if it technically creates a remainder issue in real life (though with money, usually handled by change).
       // We will just create a partial batch of the smallest unit selected to close the gap as close as possible.
       const smallest = sortedDenoms[sortedDenoms.length - 1];
       const smallestMilli = Math.round(smallest * 1000);
       
       // Simply add a batch of 1 of the smallest to clear the queue, 
       // in reality this might overshoot slightly, but we clamp for the sake of the game logic being "Target Reached"
       const finalVal = remaining / 1000;
       batches.push({
         id: `batch-${batchIdCounter++}`,
         denominationValue: smallest,
         count: 1, 
         totalValue: finalVal, // This might be weird (e.g. 0.030 TND), but it closes the math.
         isCompleted: false
       });
       remaining = 0;
       break;
    }

    // Pick a random denomination from available
    const pickIndex = randomInt(0, availableDenoms.length - 1);
    const denomVal = availableDenoms[pickIndex];
    const denomMilli = Math.round(denomVal * 1000);

    // Determine batch size
    const possibleSizes = BUNDLE_SIZES[denomVal] || [1];
    // Filter sizes so we don't overshoot remaining
    const validSizes = possibleSizes.filter(size => (size * denomMilli) <= remaining);

    let count = 1;
    if (validSizes.length > 0) {
        // Pick a random valid size
        count = validSizes[randomInt(0, validSizes.length - 1)];
    } else {
        // If defined bundle sizes are too big, just calculate max fit
        count = Math.floor(remaining / denomMilli);
        if (count === 0) count = 1; // Should not happen due to availableDenoms check
    }

    const batchTotalMilli = count * denomMilli;
    
    batches.push({
      id: `batch-${batchIdCounter++}`,
      denominationValue: denomVal,
      count: count,
      totalValue: batchTotalMilli / 1000,
      isCompleted: false
    });

    remaining -= batchTotalMilli;
  }

  // Shuffle the batches so they aren't sorted by generation order (which would look clustered)
  return batches.sort(() => Math.random() - 0.5);
};