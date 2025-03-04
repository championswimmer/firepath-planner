
import { FinancialData, ProjectionData, ChartData } from '@/types';

/**
 * Calculate financial projections based on user input
 */
export const calculateProjections = (data: FinancialData): ChartData => {
  const currentYear = new Date().getFullYear();
  
  // Generate past projections
  const pastProjections = generatePastProjections(data, currentYear);
  
  // Generate future projections (40 years for savings/investments, 20 years for income)
  const futureProjections = generateFutureProjections(data, currentYear, 40);
  
  return {
    past: pastProjections,
    future: futureProjections,
  };
};

/**
 * Generate projections for past years
 */
const generatePastProjections = (data: FinancialData, currentYear: number): ProjectionData[] => {
  const { 
    firstEarningYear, 
    firstYearEarnings,
    historicalEarnings,
    currentAnnualIncome,
    currentSavings,
    currentInvestments,
    savingsPercentage,
    investmentPercentage,
    spendPercentage
  } = data;
  
  const pastProjections: ProjectionData[] = [];
  
  // Create a map of known historical earnings for quick lookup
  const earningsMap = new Map<number, number>();
  historicalEarnings.forEach(entry => {
    earningsMap.set(entry.year, entry.amount);
  });
  earningsMap.set(firstEarningYear, firstYearEarnings);
  earningsMap.set(currentYear, currentAnnualIncome);
  
  // Starting values at 0
  let runningTotalSavings = 0;
  let runningTotalInvestments = 0;
  
  // Calculate for each year from first earning year to current year
  for (let year = firstEarningYear; year <= currentYear; year++) {
    let yearlyIncome: number;
    
    // Use known values if available, otherwise interpolate linearly
    if (earningsMap.has(year)) {
      yearlyIncome = earningsMap.get(year) || 0;
    } else {
      // Find closest known years before and after
      const knownYears = Array.from(earningsMap.keys()).sort((a, b) => a - b);
      const prevYear = knownYears.filter(y => y < year).pop() || firstEarningYear;
      const nextYear = knownYears.find(y => y > year) || currentYear;
      
      const prevValue = earningsMap.get(prevYear) || 0;
      const nextValue = earningsMap.get(nextYear) || 0;
      
      // Linear interpolation
      yearlyIncome = prevValue + (nextValue - prevValue) * 
                    ((year - prevYear) / (nextYear - prevYear));
    }
    
    // Calculate allocation amounts for the year
    const yearlySpending = yearlyIncome * (spendPercentage / 100);
    const yearlySavings = yearlyIncome * (savingsPercentage / 100);
    const yearlyInvestments = yearlyIncome * (investmentPercentage / 100);
    
    // Apply growth to previous running totals (simplified - assume consistent rates)
    if (year > firstEarningYear) {
      runningTotalSavings = runningTotalSavings * (1 + data.savingsGrowthRate / 100);
      runningTotalInvestments = runningTotalInvestments * (1 + data.investmentsGrowthRate / 100);
    }
    
    // Handle spending - first reduce from savings
    let remainingSpending = yearlySpending;
    
    // Add this year's savings contribution
    runningTotalSavings += yearlySavings;
    
    // Subtract spending from savings
    if (runningTotalSavings >= remainingSpending) {
      runningTotalSavings -= remainingSpending;
      remainingSpending = 0;
    } else {
      // If savings can't cover all spending, calculate remaining
      remainingSpending -= runningTotalSavings;
      runningTotalSavings = 0;
    }
    
    // Add this year's investment contribution
    runningTotalInvestments += yearlyInvestments;
    
    // If there's still spending to cover, take from investments
    if (remainingSpending > 0) {
      if (runningTotalInvestments >= remainingSpending) {
        runningTotalInvestments -= remainingSpending;
      } else {
        // If investments can't cover all remaining spending, set to 0
        runningTotalInvestments = 0;
      }
    }
    
    pastProjections.push({
      year,
      income: yearlyIncome,
      savings: runningTotalSavings,
      investments: runningTotalInvestments,
      spending: yearlySpending
    });
  }
  
  // Calculate growth factors to adjust final values to match current values
  // This distributes any difference between calculated and actual values proportionally
  const lastIndex = pastProjections.length - 1;
  if (lastIndex >= 0) {
    const calculatedSavings = pastProjections[lastIndex].savings;
    const calculatedInvestments = pastProjections[lastIndex].investments;
    
    // Only adjust if there's a significant difference
    if (Math.abs(calculatedSavings - currentSavings) > 0.01) {
      const savingsRatio = calculatedSavings > 0 ? currentSavings / calculatedSavings : 1;
      
      // Apply adjustment factor to all past savings values
      pastProjections.forEach(entry => {
        entry.savings *= savingsRatio;
      });
    }
    
    if (Math.abs(calculatedInvestments - currentInvestments) > 0.01) {
      const investmentsRatio = calculatedInvestments > 0 ? currentInvestments / calculatedInvestments : 1;
      
      // Apply adjustment factor to all past investment values
      pastProjections.forEach(entry => {
        entry.investments *= investmentsRatio;
      });
    }
  }
  
  return pastProjections;
};

/**
 * Generate projections for future years
 */
const generateFutureProjections = (
  data: FinancialData, 
  currentYear: number, 
  projectionYears: number
): ProjectionData[] => {
  const {
    currentSavings,
    currentInvestments,
    currentAnnualIncome,
    incomeGrowthRate,
    savingsGrowthRate,
    investmentsGrowthRate,
    savingsPercentage,
    investmentPercentage,
    spendPercentage,
    inflationRate
  } = data;
  
  const futureProjections: ProjectionData[] = [];
  
  let runningIncome = currentAnnualIncome;
  let runningSavings = currentSavings;
  let runningInvestments = currentInvestments;
  
  const incomeProjectionYears = Math.min(20, projectionYears);
  
  for (let yearOffset = 1; yearOffset <= projectionYears; yearOffset++) {
    const year = currentYear + yearOffset;
    
    // Initialize spending for this year
    let yearlySpending = 0;
    let yearlySavings = 0;
    let yearlyInvestments = 0;
    
    // Income stops after 20 years, but continue projecting savings and investments
    if (yearOffset <= incomeProjectionYears) {
      // Growth-adjusted income
      runningIncome = runningIncome * (1 + incomeGrowthRate / 100);
      
      // Calculate this year's allocations
      yearlySpending = runningIncome * (spendPercentage / 100);
      yearlySavings = runningIncome * (savingsPercentage / 100);
      yearlyInvestments = runningIncome * (investmentPercentage / 100);
    }
    
    // Apply growth to running totals
    runningSavings = runningSavings * (1 + savingsGrowthRate / 100);
    runningInvestments = runningInvestments * (1 + investmentsGrowthRate / 100);
    
    // Add this year's contributions
    runningSavings += yearlySavings;
    
    // Handle spending - first reduce from savings
    let remainingSpending = yearlySpending;
    
    if (runningSavings >= remainingSpending) {
      runningSavings -= remainingSpending;
      remainingSpending = 0;
    } else {
      // If savings can't cover all spending, calculate remaining
      remainingSpending -= runningSavings;
      runningSavings = 0;
    }
    
    // Add this year's investment contribution
    runningInvestments += yearlyInvestments;
    
    // If there's still spending to cover, take from investments
    if (remainingSpending > 0) {
      if (runningInvestments >= remainingSpending) {
        runningInvestments -= remainingSpending;
      } else {
        // If investments can't cover all remaining spending, set to 0
        runningInvestments = 0;
      }
    }
    
    // Apply inflation adjustment to all values
    const inflationFactor = Math.pow(1 - (inflationRate / 100), yearOffset);
    const inflationAdjustedIncome = runningIncome * inflationFactor;
    const inflationAdjustedSavings = runningSavings * inflationFactor;
    const inflationAdjustedInvestments = runningInvestments * inflationFactor;
    const inflationAdjustedSpending = yearlySpending * inflationFactor;
    
    futureProjections.push({
      year,
      income: inflationAdjustedIncome,
      savings: inflationAdjustedSavings,
      investments: inflationAdjustedInvestments,
      spending: inflationAdjustedSpending
    });
  }
  
  return futureProjections;
};

/**
 * Helper to validate that allocation percentages sum to 100
 */
export const validateAllocationPercentages = (
  spendPercentage: number,
  savingsPercentage: number,
  investmentPercentage: number
): boolean => {
  const sum = spendPercentage + savingsPercentage + investmentPercentage;
  return Math.abs(sum - 100) < 0.01; // Allow for tiny floating point errors
};

/**
 * Format currency values
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
