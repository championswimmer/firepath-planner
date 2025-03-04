
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FinancialData } from '@/types';

interface AllocationSectionProps {
  expanded: boolean;
  toggleSection: () => void;
  formData: FinancialData;
  handleAllocationChange: (name: string, value: number[]) => void;
  allocationValid: boolean;
}

const AllocationSection: React.FC<AllocationSectionProps> = ({
  expanded,
  toggleSection,
  formData,
  handleAllocationChange,
  allocationValid,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
        onClick={toggleSection}
      >
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Income Allocation</CardTitle>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </CardHeader>
      
      <div className={cn(
        "transition-all duration-300 ease-apple",
        expanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
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
  );
};

export default AllocationSection;
