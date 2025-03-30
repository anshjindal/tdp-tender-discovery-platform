import React, { useEffect, useState } from 'react';

interface Contract {
  reference_number: string;
  procurement_id: string;
  vendor_name: string | null;
  contract_date: string;
  description_en: string | null;
  contract_value: number;
  department: string | null;
}

type SortOption = 'date-asc' | 'date-desc' | 'value-asc' | 'value-desc' | 'none';

const ContractGrouping: React.FC = () => {
  const [allContracts, setAllContracts] = useState<Contract[]>([]);
  const [displayedContracts, setDisplayedContracts] = useState<Contract[]>([]);
  const [category, setCategory] = useState<'All' | 'Proven Solutions' | 'Services'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('none');

  const contractsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load all chunk files
        const chunks = await Promise.all(
          Array.from({ length: 20 }, (_, i) =>
            fetch(`/it_contracts_chunks/chunk_${i}.json`)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to load chunk ${i}`);
                return res.json();
              })
              .catch(err => {
                console.error(`Error loading chunk ${i}:`, err);
                return [];
              })
          )
        );

        const contracts: Contract[] = chunks.flat();
        
        // Filter out contracts without required data
        const validContracts = contracts.filter(c => 
          c.contract_date && c.contract_value
        );

        if (validContracts.length === 0) {
          setError('No valid contracts found');
          return;
        }

        setAllContracts(validContracts);
      } catch (err) {
        console.error('Error processing contract data:', err);
        setError('Failed to load contract data. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Determine category based on description
  const determineCategory = (description: string | null): 'Proven Solutions' | 'Services' => {
    if (!description) return 'Proven Solutions';
    
    const desc = description.toLowerCase();
    const serviceKeywords = ['service', 'support', 'maintenance', 'consulting', 'training'];
    
    return serviceKeywords.some(kw => desc.includes(kw)) 
      ? 'Services' 
      : 'Proven Solutions';
  };

  const safeSearch = (text: string | null, term: string): boolean => {
    if (!text) return false;
    return text.toLowerCase().includes(term);
  };

  
  const getFilteredContracts = () => {
    let filtered = allContracts;
    
    // Apply category filter
    if (category !== 'All') {
      filtered = filtered.filter(contract => 
        determineCategory(contract.description_en) === category
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(contract =>
        safeSearch(contract.description_en, term) ||
        safeSearch(contract.vendor_name, term) ||
        safeSearch(contract.department, term)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.contract_date).getTime() - new Date(b.contract_date).getTime());
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.contract_date).getTime() - new Date(a.contract_date).getTime());
        break;
      case 'value-asc':
        filtered.sort((a, b) => a.contract_value - b.contract_value);
        break;
      case 'value-desc':
        filtered.sort((a, b) => b.contract_value - a.contract_value);
        break;
      case 'none':
      default:
        // No sorting
        break;
    }
    
    return filtered;
  };

  // Update displayed contracts when filters, sort, or page changes
  useEffect(() => {
    const filtered = getFilteredContracts();
    const startIndex = (currentPage - 1) * contractsPerPage;
    const endIndex = startIndex + contractsPerPage;
    setDisplayedContracts(filtered.slice(startIndex, endIndex));
  }, [category, searchTerm, currentPage, sortOption, allContracts]);

  // Calculate total pages
  const totalFilteredContracts = getFilteredContracts().length;
  const totalPages = Math.ceil(totalFilteredContracts / contractsPerPage);

  // Handle page change
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSort = (option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1); 
  };

  if (loading) return <div className="text-center text-gray-500 p-8">Loading contract data...</div>;
  if (error) return <div className="text-center text-red-500 p-8 bg-red-50 rounded">{error}</div>;
  if (allContracts.length === 0) return <div className="text-center text-gray-500 p-8">No contract data available</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">IT Contracts</h1>
      
      {/* Filters and Sorting */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCategory('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md ${category === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All Contracts
            </button>
            <button
              onClick={() => {
                setCategory('Proven Solutions');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md ${category === 'Proven Solutions' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Proven Solutions
            </button>
            <button
              onClick={() => {
                setCategory('Services');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md ${category === 'Services' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Services
            </button>
          </div>
          
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleSort(sortOption === 'date-asc' ? 'date-desc' : 'date-asc')}
            className={`px-4 py-2 rounded-md ${
              sortOption === 'date-asc' || sortOption === 'date-desc' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Sort by Date {sortOption === 'date-asc' ? '↑' : sortOption === 'date-desc' ? '↓' : ''}
          </button>
          <button
            onClick={() => handleSort(sortOption === 'value-asc' ? 'value-desc' : 'value-asc')}
            className={`px-4 py-2 rounded-md ${
              sortOption === 'value-asc' || sortOption === 'value-desc' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Sort by Value {sortOption === 'value-asc' ? '↑' : sortOption === 'value-desc' ? '↓' : ''}
          </button>
          <button
            onClick={() => handleSort('none')}
            className={`px-4 py-2 rounded-md ${
              sortOption === 'none' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Clear Sort
          </button>
        </div>
      </div>
      
      {/* Contract List */}
      <div className="space-y-4 mb-6">
        {displayedContracts.length > 0 ? (
          displayedContracts.map((contract) => (
            <div key={contract.reference_number} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {contract.description_en || 'No description available'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">Vendor:</span> {contract.vendor_name || 'Unknown vendor'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Department:</span> {contract.department ? contract.department.split('|')[0].trim() : 'Unknown department'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    determineCategory(contract.description_en) === 'Proven Solutions' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {determineCategory(contract.description_en)}
                  </span>
                  <p className="text-sm font-semibold mt-1">
                    ${contract.contract_value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(contract.contract_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Ref: {contract.reference_number} | Proc ID: {contract.procurement_id}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No contracts found matching your criteria
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ‹
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            »
          </button>
        </div>
      )}
      
      {/* Summary */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Page {currentPage} of {totalPages} | Showing {displayedContracts.length} of {totalFilteredContracts} contracts</p>
        {sortOption !== 'none' && (
          <p>Sorted by: {sortOption.replace('-asc', ' (ascending)').replace('-desc', ' (descending)')}</p>
        )}
      </div>
    </div>
  );
};

export default ContractGrouping;