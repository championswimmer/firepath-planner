
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Wallet, TrendingUp, DollarSign, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FinancialData } from '@/types';

interface CurrentFinancesSectionProps {
  expanded: boolean;
  toggleSection: () => void;
  formData: FinancialData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (name: string, value: number[]) => void;
}

const CurrentFinancesSection: React.FC<CurrentFinancesSectionProps> = ({
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
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Current Financial Status</CardTitle>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </CardHeader>
      
      <div className={cn(
        "transition-all duration-300 ease-apple",
        expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
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
  );
};

export default CurrentFinancesSection;
