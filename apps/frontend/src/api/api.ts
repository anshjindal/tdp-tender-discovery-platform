import axios from 'axios'

/**
 * Base URL for API endpoints
 * @constant {string}
 */
const API_BASE_URL = 'http://localhost:3000'
const PDF_ANALYSIS_URL = 'http://localhost:4500'

/**
 * Interface defining the structure of a tender notice
 */
export interface TenderNoticeInterface {
  'title-titre-eng': string
  'tenderStatus-appelOffresStatut-eng': string
  'gsinDescription-nibsDescription-eng': string
  'unspscDescription-eng': string
  'noticeType-avisType-eng': string
  'procurementMethod-methodeApprovisionnement-eng': string
  'selectionCriteria-criteresSelection-eng': string
  'limitedTenderingReason-raisonAppelOffresLimite-eng': string
  'tradeAgreements-accordsCommerciaux-eng': string
  'regionsOfOpportunity-regionAppelOffres-eng': string
  'regionsOfDelivery-regionsLivraison-eng': string
  'contractingEntityName-nomEntitContractante-eng': string
  'contractingEntityAddressLine-ligneAdresseEntiteContractante-eng': string
  'contractingEntityAddressCity-entiteContractanteAdresseVille-eng': string
  'contractingEntityAddressProvince-entiteContractanteAdresseProvince-eng': string
  'contractingEntityAddressCountry-entiteContractanteAdressePays-eng': string
  'endUserEntitiesName-nomEntitesUtilisateurFinal-eng': string
  'endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng': string
  'contactInfoAddressLine-contactInfoAdresseLigne-eng': string
  'contactInfoCity-contacterInfoVille-eng': string
  'contactInfoProvince-contacterInfoProvince-eng': string
  'contactInfoCountry-contactInfoPays-eng': string
  'noticeURL-URLavis-eng': string
  'attachment-piecesJointes-eng': string
  'tenderDescription-descriptionAppelOffres-eng': string
}

/**
 * Get AI completion
 * @returns {Promise<any>} Completion response data
 */
export const getCompletion = async () => {
  const response = await axios.post(`${API_BASE_URL}/api/completion`)
  return response.data
}

/**
 * Retrieve open tender notices from database
 * @returns {Promise<TenderNoticeInterface[]>} Array of tender notices
 */
export const getOpenTenderNoticesFromDB = async () => {
  const response = await axios.get(`${API_BASE_URL}/getOpenTenderNoticesFromDB`)
  return response.data
}

/**
 * Generate leads based on form data
 * @param {any} formData - Form data for lead generation
 * @returns {Promise<any>} Generated leads data
 */
export const generateLeads = async (formData: any) => {
  const response = await axios.post(`${API_BASE_URL}/generateLeads`, formData)
  return response.data
}

/**
 * Redirect to open tender notices page
 */
export const getOpenTenderNotices = () => {
  window.location.href = `${API_BASE_URL}/getOpenTenderNotices`
}

/**
 * Get filtered tender notices from database
 * @returns {Promise<TenderNoticeInterface[]>} Filtered tender notices
 */
export const getFilteredTenderNoticesFromDB = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/getFilteredTenderNoticesFromDB`
  )
  return response.data
}

/**
 * Filter open tender notices based on prompt
 * @param {string} prompt - Filter criteria
 * @returns {Promise<TenderNoticeInterface[]>} Filtered tender notices
 */
export const filterOpenTenderNotices = async (prompt: string) => {
  const response = await axios.post(`${API_BASE_URL}/filterOpenTenderNotices`, {
    prompt,
  })
  return response.data
}

/**
 * Save open tender notices to database
 * @returns {Promise<any>} Operation result
 */
export const getOpenTenderNoticesToDB = async () => {
  const response = await axios.post(`${API_BASE_URL}/getOpenTenderNoticesToDB`)
  return response.data
}

/**
 * Analyze PDF document
 * @param {FormData} formData - Form data containing PDF file
 * @returns {Promise<any>} Analysis results
 */
export const analyzePdf = async (formData: FormData) => {
  const response = await axios.post(`${PDF_ANALYSIS_URL}/analyze_pdf`, formData)
  return response.data
}

/**
 * Get RFP analysis
 * @param {any} rfpData - RFP data to analyze
 * @returns {Promise<any>} Analysis results
 */
export const getRfpAnalysis = async (rfpData: any) => {
  const response = await axios.post(`${API_BASE_URL}/getRfpAnalysis`, rfpData)
  return response.data
}
