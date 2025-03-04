import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Wallet, TrendingUp, DollarSign, PiggyBank, ArrowRight, Plus, Minus } from 'lucide-react';
import { FinancialData } from '@/types';
import { validateAllocationPercentages } from '@/utils/financialCalculations';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FinancialFormProps {
  onSubmit: (data: FinancialData) => void;
}

const FinancialForm: React.FC<FinancialFormProps> = ({ onSubmit }) => {
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
      parsedValue = value === '' ? 0 : parseFloat(value);
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Current Finances Section */}
      <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
          onClick={() => toggleSection('currentFinances')}
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Current Financial Status</CardTitle>
          </div>
          {expandedSections.currentFinances ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </CardHeader>
        
        <div className={cn(
          "transition-all duration-300 ease-apple",
          expandedSections.currentFinances ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <CardContent className="pt-6 pb-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="currentSavings" className="font-medium">
                    <PiggyBank className="h-4 w-4 inline mr-1" /> Current Savings
                  </Label>
                  <Badge variant="outline" className="font-mono">Cash & Equivalents</Badge>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="currentSavings"
                    name="currentSavings"
                    type="number"
                    className="pl-10 glass-input"
                    value={formData.currentSavings || ''}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="savingsGrowthRate" className="text-sm">Growth Rate (APR)</Label>
                    <span className="text-sm font-medium">{formData.savingsGrowthRate}%</span>
                  </div>
                  <Slider
                    id="savingsGrowthRate"
                    name="savingsGrowthRate"
                    value={[formData.savingsGrowthRate]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => handleSliderChange("savingsGrowthRate", value)}
                    className="py-2"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="currentInvestments" className="font-medium">
                    <TrendingUp className="h-4 w-4 inline mr-1" /> Current Investments
                  </Label>
                  <Badge variant="outline" className="font-mono">Equity & ETFs</Badge>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="currentInvestments"
                    name="currentInvestments"
                    type="number"
                    className="pl-10 glass-input"
                    value={formData.currentInvestments || ''}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="investmentsGrowthRate" className="text-sm">Expected Growth Rate</Label>
                    <span className="text-sm font-medium">{formData.investmentsGrowthRate}%</span>
                  </div>
                  <Slider
                    id="investmentsGrowthRate"
                    name="investmentsGrowthRate"
                    value={[formData.investmentsGrowthRate]}
                    min={0}
                    max={15}
                    step={0.5}
                    onValueChange={(value) => handleSliderChange("investmentsGrowthRate", value)}
                    className="py-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      
      {/* Income Section */}
      <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
          onClick={() => toggleSection('income')}
        >
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Income Details</CardTitle>
          </div>
          {expandedSections.income ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </CardHeader>
        
        <div className={cn(
          "transition-all duration-300 ease-apple",
          expandedSections.income ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <CardContent className="pt-6 pb-4 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="currentAnnualIncome" className="font-medium">Current Annual Income</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="currentAnnualIncome"
                  name="currentAnnualIncome"
                  type="number"
                  className="pl-10 glass-input"
                  value={formData.currentAnnualIncome || ''}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="incomeGrowthRate" className="text-sm">Expected Year-over-Year Growth</Label>
                <span className="text-sm font-medium">{formData.incomeGrowthRate}%</span>
              </div>
              <Slider
                id="incomeGrowthRate"
                name="incomeGrowthRate"
                value={[formData.incomeGrowthRate]}
                min={0}
                max={10}
                step={0.5}
                onValueChange={(value) => handleSliderChange("incomeGrowthRate", value)}
                className="py-2"
              />
            </div>
          </CardContent>
        </div>
      </Card>
      
      {/* Allocation Section */}
      <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
          onClick={() => toggleSection('allocation')}
        >
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Income Allocation</CardTitle>
          </div>
          {expandedSections.allocation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </CardHeader>
        
        <div className={cn(
          "transition-all duration-300 ease-apple",
          expandedSections.allocation ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <CardContent className="pt-6 pb-4 space-y-6">
            <CardDescription className="pb-2">
              Adjust how your annual income is allocated (must sum to 100%)
            </CardDescription>
            
            <div className={cn(
              "p-3 mb-4 rounded-md text-center text-sm",
              allocationValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            )}>
              Total: {(formData.spendPercentage + formData.savingsPercentage + formData.investmentPercentage).toFixed(1)}%
              {!allocationValid && " (Should be 100%)"}
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="spendPercentage" className="text-sm">Spending</Label>
                  <span className="text-sm font-medium">{formData.spendPercentage.toFixed(1)}%</span>
                </div>
                <Slider
                  id="spendPercentage"
                  name="spendPercentage"
                  value={[formData.spendPercentage]}
                  min={0}
                  max={100}
                  step={0.5}
                  onValueChange={(value) => handleAllocationChange("spendPercentage", value)}
                  className="py-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="savingsPercentage" className="text-sm">Savings</Label>
                  <span className="text-sm font-medium">{formData.savingsPercentage.toFixed(1)}%</span>
                </div>
                <Slider
                  id="savingsPercentage"
                  name="savingsPercentage"
                  value={[formData.savingsPercentage]}
                  min={0}
                  max={100}
                  step={0.5}
                  onValueChange={(value) => handleAllocationChange("savingsPercentage", value)}
                  className="py-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="investmentPercentage" className="text-sm">Investments</Label>
                  <span className="text-sm font-medium">{formData.investmentPercentage.toFixed(1)}%</span>
                </div>
                <Slider
                  id="investmentPercentage"
                  name="investmentPercentage"
                  value={[formData.investmentPercentage]}
                  min={0}
                  max={100}
                  step={0.5}
                  onValueChange={(value) => handleAllocationChange("investmentPercentage", value)}
                  className="py-2"
                />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      
      {/* Inflation Section */}
      <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
          onClick={() => toggleSection('inflation')}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Inflation</CardTitle>
          </div>
          {expandedSections.inflation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </CardHeader>
        
        <div className={cn(
          "transition-all duration-300 ease-apple",
          expandedSections.inflation ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <CardContent className="pt-6 pb-4 space-y-6">
            <CardDescription className="pb-2">
              Expected annual inflation rate for future projections
            </CardDescription>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="inflationRate" className="text-sm">Expected Inflation Rate</Label>
                <span className="text-sm font-medium">{formData.inflationRate}%</span>
              </div>
              <Slider
                id="inflationRate"
                name="inflationRate"
                value={[formData.inflationRate]}
                min={0}
                max={10}
                step={0.1}
                onValueChange={(value) => handleSliderChange("inflationRate", value)}
                className="py-2"
              />
            </div>
          </CardContent>
        </div>
      </Card>
      
      {/* Historical Data Section */}
      <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
          onClick={() => toggleSection('historical')}
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Historical Earnings</CardTitle>
          </div>
          {expandedSections.historical ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </CardHeader>
        
        <div className={cn(
          "transition-all duration-300 ease-apple",
          expandedSections.historical ? "max-h-[600px] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <CardContent className="pt-6 pb-4 space-y-6">
            <CardDescription className="pb-2">
              Enter your first year of earnings and income history
            </CardDescription>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstEarningYear" className="font-medium">First Year of Earnings</Label>
                  <Input
                    id="firstEarningYear"
                    name="firstEarningYear"
                    type="number"
                    className="glass-input"
                    value={formData.firstEarningYear || ''}
                    onChange={handleInputChange}
                    min={1950}
                    max={currentYear - 1}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firstYearEarnings" className="font-medium">First Year's Income</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="firstYearEarnings"
                      name="firstYearEarnings"
                      type="number"
                      className="pl-10 glass-input"
                      value={formData.firstYearEarnings || ''}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
              </div>
              
              {historicalEntries.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h3 className="text-md font-medium">Income for Intermediate Years</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enter income for specific years (leave empty for auto-calculation)
                  </p>
                  
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {historicalEntries.map((entry, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3 items-center">
                        <div className="text-sm font-medium">{entry.year}</div>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            className="pl-10 glass-input"
                            value={entry.amount || ''}
                            onChange={(e) => handleHistoricalChange(index, e.target.value)}
                            placeholder="Optional"
                            min="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
      
      <div className="text-center pt-4 pb-8">
        <Button 
          type="submit" 
          size="lg"
          disabled={!allocationValid}
          className="relative overflow-hidden group w-60 h-12"
        >
          <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-primary group-hover:bg-opacity-80 group-hover:skew-x-12"></span>
          <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-primary/80 group-hover:bg-opacity-90 group-hover:-skew-x-12"></span>
          <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-primary -rotate-12"></span>
          <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-primary rotate-12"></span>
          <span className="relative flex items-center justify-center text-md">
            Generate Financial Projection <ArrowRight className="ml-2 h-5 w-5" />
          </span>
        </Button>
      </div>
    </form>
  );
};

export default FinancialForm;
