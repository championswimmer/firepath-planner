
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FinancialData } from '@/types';

interface IncomeSectionProps {
  expanded: boolean;
  toggleSection: () => void;
  formData: FinancialData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (name: string, value: number[]) => void;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({
  expanded,
  toggleSection,
  formData,
  handleInputChange,
  handleSliderChange,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
        onClick={toggleSection}
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Income Details</CardTitle>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </CardHeader>
      
      <div className={cn(
        "transition-all duration-300 ease-apple",
        expanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
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
  );
};

export default IncomeSection;
