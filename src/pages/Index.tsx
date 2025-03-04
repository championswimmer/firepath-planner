
import React, { useState } from 'react';
import { FinancialData, ChartData } from '@/types';
import FinancialForm from '@/components/FinancialForm';
import FinancialChart from '@/components/FinancialChart';
import { calculateProjections } from '@/utils/financialCalculations';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  
  const handleFormSubmit = (data: FinancialData) => {
    const projections = calculateProjections(data);
    setChartData(projections);
    
    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 md:px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent z-0"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-16 animate-slide-up">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Financial Independence
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Plan Your Path to <span className="text-primary">FIRE</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              Create a customized financial roadmap to achieve Financial Independence and Retire Early. 
              Visualize your journey with powerful projections based on your personal financial data.
            </p>
          </div>
        </div>
      </section>
      
      {/* Form Section */}
      <section className="py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-semibold">Enter Your Financial Details</h2>
            <p className="text-muted-foreground mt-2">
              Provide your current financial information to generate personalized projections
            </p>
          </div>
          
          <FinancialForm onSubmit={handleFormSubmit} />
        </div>
      </section>
      
      {/* Results Section */}
      {chartData && (
        <section id="results-section" className="py-16 px-4 md:px-6 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold">Your FIRE Projection</h2>
              <p className="text-muted-foreground mt-2">
                Based on your inputs, here's how your financial future could unfold
              </p>
            </div>
            
            <FinancialChart data={chartData} />
            
            <div className="mt-16 text-center">
              <Separator className="mb-8" />
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-medium mb-4">What These Projections Mean</h3>
                <p className="text-muted-foreground mb-4">
                  The charts above show how your income, savings, and investments could evolve over time based on your current financial situation and future projections.
                </p>
                <p className="text-muted-foreground">
                  The FIRE point represents when your investments can potentially generate enough passive income (using the 4% rule) to cover your annual expenses, allowing you to become financially independent.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            This FIRE calculator is for illustrative purposes only. Always consult with a financial advisor before making investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
