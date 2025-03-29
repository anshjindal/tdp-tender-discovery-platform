import { useState } from 'react'
import ContractGrouping from './ContactGrouping'

const BmMain = () => {

  return (
    <>
        <h1>Bechmarking Module</h1>

    {/* Render the ContractGrouping component */}
    <div className="mt-10">
        <ContractGrouping />
      </div>

    </>
  )
}

export default BmMain
