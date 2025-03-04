
export interface FinancialData {
  // Current financial status
  currentSavings: number;
  savingsGrowthRate: number;
  currentInvestments: number;
  investmentsGrowthRate: number;
  
  // Income data
  currentAnnualIncome: number;
  incomeGrowthRate: number;
  
  // Allocation percentages
  spendPercentage: number;
  savingsPercentage: number;
  investmentPercentage: number;
  
  // Inflation
  inflationRate: number;
  
  // Historical data
  firstEarningYear: number;
  firstYearEarnings: number;
  historicalEarnings: { year: number; amount: number }[];
}

export interface ProjectionData {
  year: number;
  income: number;
  savings: number;
  investments: number;
  spending?: number; // Add optional spending for detailed reports
}

export interface ChartData {
  past: ProjectionData[];
  future: ProjectionData[];
}
