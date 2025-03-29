import React from "react";

interface Contract {
  id: number;
  name: string;
  category: "Proven Solutions" | "Services";
}

const contracts: Contract[] = [
  { id: 1, name: "Cloud Security Suite", category: "Proven Solutions" },
  { id: 2, name: "Enterprise Support Services", category: "Services" },
];

const ContractGrouping: React.FC = () => {
  const provenSolutions = contracts.filter(contract => contract.category === "Proven Solutions");
  const services = contracts.filter(contract => contract.category === "Services");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">IT Contracts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Proven Solutions</h2>
          <ul className="list-disc pl-5">
            {provenSolutions.map(contract => (
              <li key={contract.id} className="text-gray-700">{contract.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-green-600 mb-4">Services</h2>
          <ul className="list-disc pl-5">
            {services.map(contract => (
              <li key={contract.id} className="text-gray-700">{contract.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContractGrouping;
