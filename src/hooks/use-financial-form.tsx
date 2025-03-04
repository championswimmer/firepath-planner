import { useState, useEffect } from 'react';
import { FinancialData } from '@/types';
import { validateAllocationPercentages } from '@/utils/financialCalculations';
import { toast } from '@/hooks/use-toast';

export const useFinancialForm = (onSubmit: (data: FinancialData) => void) => {
  const currentYear = new Date().getFullYear();
  
  // Form sections expand/collapse state
  const [expandedSections, setExpandedSections] = useState({
    currentFinances: true,
    income: false,
    allocation: false,
    inflation: false,
    historical: false,
  });
  
  // Form data state
  const [formData, setFormData] = useState<FinancialData>({
    currentSavings: 10000,
    savingsGrowthRate: 1.5,
    currentInvestments: 50000,
    investmentsGrowthRate: 7,
    
    currentAnnualIncome: 75000,
    incomeGrowthRate: 3,
    
    spendPercentage: 70,
    savingsPercentage: 10,
    investmentPercentage: 20,
    
    inflationRate: 2.5,
    
    firstEarningYear: currentYear - 5,
    firstYearEarnings: 50000,
    historicalEarnings: [],
  });
  
  // State for historical earnings entries
  const [historicalEntries, setHistoricalEntries] = useState<{year: number; amount: number}[]>([]);
  
  // Validation for allocation percentages
  const [allocationValid, setAllocationValid] = useState(true);
  
  // Effect to validate allocation percentages
  useEffect(() => {
    const { spendPercentage, savingsPercentage, investmentPercentage } = formData;
    setAllocationValid(validateAllocationPercentages(spendPercentage, savingsPercentage, investmentPercentage));
  }, [formData.spendPercentage, formData.savingsPercentage, formData.investmentPercentage]);
  
  // Fill historical entries on first render
  useEffect(() => {
    const { firstEarningYear } = formData;
    const entries = [];
    
    // Add an entry for each year between firstEarningYear and currentYear
    for (let year = firstEarningYear + 1; year < currentYear; year++) {
      entries.push({ year, amount: 0 });
    }
    
    setHistoricalEntries(entries);
  }, [formData.firstEarningYear]);
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: number | string = value;
    
    // Convert to number for numerical fields
    if (name !== 'name') {
      parsedValue = value === '' ? 0 : Number(parseFloat(value));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    // Special case for firstEarningYear to update historical entries
    if (name === 'firstEarningYear') {
      const newYear = parseInt(value);
      if (!isNaN(newYear)) {
        const entries = [];
        for (let year = newYear + 1; year < currentYear; year++) {
          // Try to preserve existing entries
          const existingEntry = historicalEntries.find(entry => entry.year === year);
          entries.push({ year, amount: existingEntry ? existingEntry.amount : 0 });
        }
        setHistoricalEntries(entries);
      }
    }
  };
  
  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };
  
  // Handle allocation slider changes with validation
  const handleAllocationChange = (name: string, value: number[]) => {
    const newValue = value[0];
    const change = newValue - formData[name as keyof FinancialData] as number;
    
    // Update the named percentage
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Adjust the other percentages to maintain 100% total
    if (name === 'spendPercentage') {
      // Distribute change proportionally between savings and investment
      const totalOther = formData.savingsPercentage + formData.investmentPercentage;
      if (totalOther === 0) {
        // If both are zero, split evenly
        setFormData(prev => ({
          ...prev,
          savingsPercentage: prev.savingsPercentage - change / 2,
          investmentPercentage: prev.investmentPercentage - change / 2
        }));
      } else {
        // Otherwise, distribute proportionally
        const savingsRatio = formData.savingsPercentage / totalOther;
        const investmentRatio = formData.investmentPercentage / totalOther;
        
        setFormData(prev => ({
          ...prev,
          savingsPercentage: Math.max(0, prev.savingsPercentage - change * savingsRatio),
          investmentPercentage: Math.max(0, prev.investmentPercentage - change * investmentRatio)
        }));
      }
    } else if (name === 'savingsPercentage') {
      // Adjust investment percentage
      setFormData(prev => ({
        ...prev,
        investmentPercentage: Math.max(0, prev.investmentPercentage - change)
      }));
    } else if (name === 'investmentPercentage') {
      // Adjust savings percentage
      setFormData(prev => ({
        ...prev,
        savingsPercentage: Math.max(0, prev.savingsPercentage - change)
      }));
    }
  };
  
  // Handle historical earnings changes
  const handleHistoricalChange = (index: number, value: string) => {
    const newEntries = [...historicalEntries];
    newEntries[index].amount = value === '' ? 0 : parseFloat(value);
    setHistoricalEntries(newEntries);
  };
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allocationValid) {
      toast({
        title: "Allocation percentages must sum to 100%",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare the data with historical earnings
    const completeData: FinancialData = {
      ...formData,
      historicalEarnings: historicalEntries.filter(entry => entry.amount > 0)
    };
    
    onSubmit(completeData);
    
    toast({
      title: "Financial projection generated",
      description: "Your FIRE journey has been calculated.",
    });
  };

  return {
    currentYear,
    expandedSections,
    formData,
    historicalEntries,
    allocationValid,
    handleInputChange,
    handleSliderChange,
    handleAllocationChange,
    handleHistoricalChange,
    toggleSection,
    handleSubmit
  };
};
