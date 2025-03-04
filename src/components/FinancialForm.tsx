
import React from 'react';
import { FinancialData } from '@/types';
import { useFinancialForm } from '@/hooks/use-financial-form';

// Import section components
import CurrentFinancesSection from './financial-form/CurrentFinancesSection';
import IncomeSection from './financial-form/IncomeSection';
import AllocationSection from './financial-form/AllocationSection';
import InflationSection from './financial-form/InflationSection';
import HistoricalDataSection from './financial-form/HistoricalDataSection';
import SubmitButton from './financial-form/SubmitButton';

interface FinancialFormProps {
  onSubmit: (data: FinancialData) => void;
}

const FinancialForm: React.FC<FinancialFormProps> = ({ onSubmit }) => {
  const {
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
  } = useFinancialForm(onSubmit);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Current Finances Section */}
      <CurrentFinancesSection
        expanded={expandedSections.currentFinances}
        toggleSection={() => toggleSection('currentFinances')}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSliderChange={handleSliderChange}
      />
      
      {/* Income Section */}
      <IncomeSection
        expanded={expandedSections.income}
        toggleSection={() => toggleSection('income')}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSliderChange={handleSliderChange}
      />
      
      {/* Allocation Section */}
      <AllocationSection
        expanded={expandedSections.allocation}
        toggleSection={() => toggleSection('allocation')}
        formData={formData}
        handleAllocationChange={handleAllocationChange}
        allocationValid={allocationValid}
      />
      
      {/* Inflation Section */}
      <InflationSection
        expanded={expandedSections.inflation}
        toggleSection={() => toggleSection('inflation')}
        formData={formData}
        handleSliderChange={handleSliderChange}
      />
      
      {/* Historical Data Section */}
      <HistoricalDataSection
        expanded={expandedSections.historical}
        toggleSection={() => toggleSection('historical')}
        formData={formData}
        handleInputChange={handleInputChange}
        historicalEntries={historicalEntries}
        handleHistoricalChange={handleHistoricalChange}
        currentYear={currentYear}
      />
      
      {/* Submit Button */}
      <SubmitButton disabled={!allocationValid} />
    </form>
  );
};

export default FinancialForm;
