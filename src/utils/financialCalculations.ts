
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
    investmentPercentage
  } = data;
  
  const pastProjections: ProjectionData[] = [];
  
  // Create a map of known historical earnings for quick lookup
  const earningsMap = new Map<number, number>();
  historicalEarnings.forEach(entry => {
    earningsMap.set(entry.year, entry.amount);
  });
  earningsMap.set(firstEarningYear, firstYearEarnings);
  earningsMap.set(currentYear, currentAnnualIncome);
  
  // Starting values
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
    
    // Calculate savings and investments for the year
    const yearlySavings = yearlyIncome * (savingsPercentage / 100);
    const yearlyInvestments = yearlyIncome * (investmentPercentage / 100);
    
    // Apply growth to previous running totals (simplified - assume consistent rates)
    if (year > firstEarningYear) {
      runningTotalSavings = runningTotalSavings * (1 + data.savingsGrowthRate / 100);
      runningTotalInvestments = runningTotalInvestments * (1 + data.investmentsGrowthRate / 100);
    }
    
    // Add this year's contributions
    runningTotalSavings += yearlySavings;
    runningTotalInvestments += yearlyInvestments;
    
    pastProjections.push({
      year,
      income: yearlyIncome,
      savings: runningTotalSavings,
      investments: runningTotalInvestments
    });
  }
  
  // Adjust final values to match current values
  const lastIndex = pastProjections.length - 1;
  if (lastIndex >= 0) {
    pastProjections[lastIndex].savings = currentSavings;
    pastProjections[lastIndex].investments = currentInvestments;
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
    inflationRate
  } = data;
  
  const futureProjections: ProjectionData[] = [];
  
  let runningIncome = currentAnnualIncome;
  let runningSavings = currentSavings;
  let runningInvestments = currentInvestments;
  
  const incomeProjectionYears = Math.min(20, projectionYears);
  
  for (let yearOffset = 1; yearOffset <= projectionYears; yearOffset++) {
    const year = currentYear + yearOffset;
    
    // Income stops after 20 years, but continue projecting savings and investments
    if (yearOffset <= incomeProjectionYears) {
      // Growth-adjusted income
      runningIncome = runningIncome * (1 + incomeGrowthRate / 100);
      
      // Calculate this year's contributions
      const yearlySavings = runningIncome * (savingsPercentage / 100);
      const yearlyInvestments = runningIncome * (investmentPercentage / 100);
      
      // Apply growth to running totals
      runningSavings = runningSavings * (1 + savingsGrowthRate / 100) + yearlySavings;
      runningInvestments = runningInvestments * (1 + investmentsGrowthRate / 100) + yearlyInvestments;
    } else {
      // After income ends, just apply growth rates
      runningSavings = runningSavings * (1 + savingsGrowthRate / 100);
      runningInvestments = runningInvestments * (1 + investmentsGrowthRate / 100);
      runningIncome = 0;
    }
    
    // Apply inflation adjustment to all values
    const inflationFactor = Math.pow(1 - (inflationRate / 100), yearOffset);
    const inflationAdjustedIncome = runningIncome * inflationFactor;
    const inflationAdjustedSavings = runningSavings * inflationFactor;
    const inflationAdjustedInvestments = runningInvestments * inflationFactor;
    
    futureProjections.push({
      year,
      income: inflationAdjustedIncome,
      savings: inflationAdjustedSavings,
      investments: inflationAdjustedInvestments
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
