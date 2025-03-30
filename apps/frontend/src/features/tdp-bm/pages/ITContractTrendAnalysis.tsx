import React, { useEffect, useState } from 'react';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';

// Register only the necessary Chart.js components
Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface ITContract {
  reference_number?: string;
  procurement_id?: string;
  vendor_name?: string;
  contract_date?: string;
  contract_value?: number;
  original_value?: number;
  amendment_value?: number;
  description_en?: string;
  solicitation_procedure?: string;
  department?: string;
}

const ITContractTrendAnalysis: React.FC = () => {
  const [contracts, setContracts] = useState<ITContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');

  // Date range for analysis
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2025-03-27');

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try loading just the first few chunks initially
        const chunksToLoad = 5; // Start with fewer chunks for testing
        const chunkFiles = Array.from({ length: chunksToLoad }, (_, i) => 
          `/it_contracts_chunks/chunk_${i}.json`
        );

        console.log('Attempting to load chunks:', chunkFiles);

        const chunkPromises = chunkFiles.map(async (file, index) => {
          try {
            const response = await fetch(file);
            if (!response.ok) {
              console.warn(`Chunk ${index} not found: ${file}`);
              return [];
            }
            const data = await response.json();
            console.log(`Successfully loaded chunk ${index} with ${data.length} contracts`);
            return data;
          } catch (err) {
            console.error(`Error loading chunk ${index}:`, err);
            return [];
          }
        });

        const chunks = await Promise.all(chunkPromises);
        const allContracts: ITContract[] = chunks.flat();

        console.log('Total contracts loaded:', allContracts.length);

        // Basic validation - just check for contract_date and any value field
        const filteredContracts = allContracts.filter(contract => {
          if (!contract?.contract_date) {
            console.warn('Contract missing date:', contract);
            return false;
          }

          try {
            const contractDate = new Date(contract.contract_date);
            const isValidDate = !isNaN(contractDate.getTime()) && 
                              contractDate >= startDate && 
                              contractDate <= endDate;
            
            const hasValue = contract.contract_value || 
                           contract.original_value || 
                           contract.amendment_value;

            if (!isValidDate) {
              console.warn('Contract date out of range:', contract.contract_date);
            }
            if (!hasValue) {
              console.warn('Contract missing value fields:', contract);
            }

            return isValidDate && hasValue;
          } catch (e) {
            console.warn('Invalid contract date format:', contract.contract_date);
            return false;
          }
        });

        console.log('Valid contracts after filtering:', filteredContracts.length);

        if (filteredContracts.length === 0) {
          throw new Error(`
            No valid contracts found. Please verify:
            1. Files exist at /it_contracts_chunks/chunk_0.json etc.
            2. Files contain contracts with:
               - contract_date between 2020-01-01 and 2025-03-27
               - At least one value field (contract_value, original_value, or amendment_value)
          `);
        }

        setContracts(filteredContracts);
      } catch (err) {
        console.error('Error in fetchContractData:', err);
        setError(err instanceof Error ? err.message : 'Failed to load contract data');
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, []);

  // Process data for the single chart
  const processChartData = () => {
    const labels: string[] = [];
    const values: number[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      let periodEnd = new Date(currentDate);
      let label = '';

      if (timePeriod === 'monthly') {
        periodEnd.setMonth(currentDate.getMonth() + 1);
        label = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (timePeriod === 'quarterly') {
        periodEnd.setMonth(currentDate.getMonth() + 3);
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        label = `Q${quarter} ${currentDate.getFullYear()}`;
      } else {
        periodEnd.setFullYear(currentDate.getFullYear() + 1);
        label = currentDate.getFullYear().toString();
      }

      // Filter contracts for this period
      const periodContracts = contracts.filter(contract => {
        try {
          const contractDate = new Date(contract.contract_date!);
          return contractDate >= currentDate && contractDate < periodEnd;
        } catch (e) {
          return false;
        }
      });

      // Calculate average value
      const totalValue = periodContracts.reduce((sum, contract) => {
        return sum + (contract.contract_value || contract.original_value || contract.amendment_value || 0);
      }, 0);

      const avgValue = periodContracts.length > 0 ? Math.round(totalValue / periodContracts.length) : 0;

      labels.push(label);
      values.push(avgValue);

      // Move to next period
      currentDate.setTime(periodEnd.getTime());
    }

    return { labels, values };
  };

  // Render the single chart
  useEffect(() => {
    if (contracts.length === 0) return;

    const { labels, values } = processChartData();
    console.log('Chart data:', { labels, values });

    const canvas = document.getElementById('valueTrendChart');
    if (!canvas) return;

    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    // Destroy previous chart
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Average Contract Value (CAD$)',
          data: values,
          borderColor: 'rgba(54, 162, 235, 0.8)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3,
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Average: $${context.raw?.toLocaleString() || '0'}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${Number(value).toLocaleString()}`
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time Period'
            }
          }
        }
      }
    });
  }, [contracts, timePeriod]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading contract data...</p>
        <p className="text-sm text-gray-500 mt-2">Checking chunks 0-4</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Data Loading Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <div className="mt-3 bg-white p-3 rounded border border-red-200">
                <h4 className="font-medium mb-1">Troubleshooting Steps:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Check browser console for detailed errors</li>
                  <li>Verify files exist at: <code>/it_contracts_chunks/chunk_0.json</code> etc.</li>
                  <li>Ensure files contain valid JSON with contract data</li>
                  <li>Check that contracts have dates between 2020-2025 and value fields</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">IT Contract Value Trend</h1>
        <p className="text-gray-600 text-sm">
          {contracts.length.toLocaleString()} contracts analyzed • {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </p>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setTimePeriod('monthly')}
          className={`px-3 py-1 text-xs rounded ${timePeriod === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setTimePeriod('quarterly')}
          className={`px-3 py-1 text-xs rounded ${timePeriod === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Quarterly
        </button>
        <button
          onClick={() => setTimePeriod('yearly')}
          className={`px-3 py-1 text-xs rounded ${timePeriod === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Yearly
        </button>
      </div>

      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        <div className="relative h-64">
          <canvas id="valueTrendChart" />
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          Showing average values for {timePeriod} periods
        </p>
      </div>

      <div className="mt-6 bg-gray-50 p-3 rounded text-sm">
        <h3 className="font-medium mb-1">Data Status:</h3>
        <ul className="space-y-1">
          <li>• Loaded {contracts.length.toLocaleString()} valid contracts</li>
          <li>• From chunks 0-4 in /it_contracts_chunks/</li>
          <li>• Date range: {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default ITContractTrendAnalysis;