import axios, { AxiosError } from 'axios'

const MTN_BASE_URL = process.env.MTN_BASE_URL ?? 'https://sandbox.momodeveloper.mtn.com'
const SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY ?? ''
const API_USER = process.env.MTN_API_USER ?? ''
const API_KEY = process.env.MTN_API_KEY ?? ''
const ENVIRONMENT = process.env.MTN_ENVIRONMENT ?? 'sandbox'

// MTN sandbox only accepts EUR as currency and specific test phone numbers.
// In production change ENVIRONMENT to "mtncongo", "mtnuganda", etc. and use RWF.
const IS_SANDBOX = ENVIRONMENT === 'sandbox'

function getBasicAuth(): string {
  return Buffer.from(`${API_USER}:${API_KEY}`).toString('base64')
}

export async function getAccessToken(): Promise<string> {
  try {
    const response = await axios.post(
      `${MTN_BASE_URL}/collection/token/`,
      {},
      {
        headers: {
          Authorization: `Basic ${getBasicAuth()}`,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    )
    return response.data.access_token as string
  } catch (err) {
    const axErr = err as AxiosError
    console.error('MTN getAccessToken failed:', axErr.response?.status, axErr.response?.data)
    throw new Error(`MTN auth failed: ${axErr.response?.status} ${JSON.stringify(axErr.response?.data)}`)
  }
}

export interface RequestToPayParams {
  amount: string
  currency: string
  externalId: string
  partyId: string
  payerMessage: string
  payeeNote: string
}

export interface PaymentStatus {
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED'
  reason?: string
  financialTransactionId?: string
}

export async function requestToPay(
  referenceId: string,
  params: RequestToPayParams
): Promise<void> {
  const token = await getAccessToken()

  // MTN sandbox ONLY accepts EUR and the test MSISDN 46733123450.
  // Real production uses RWF and live Rwandan numbers.
  const currency = IS_SANDBOX ? 'EUR' : params.currency
  const partyId  = IS_SANDBOX ? '46733123450' : params.partyId

  try {
    await axios.post(
      `${MTN_BASE_URL}/collection/v1_0/requesttopay`,
      {
        amount: params.amount,
        currency,
        externalId: params.externalId,
        payer: {
          partyIdType: 'MSISDN',
          partyId,
        },
        payerMessage: params.payerMessage,
        payeeNote: params.payeeNote,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': ENVIRONMENT,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (err) {
    const axErr = err as AxiosError
    console.error('MTN requestToPay failed:', axErr.response?.status, axErr.response?.data)
    throw new Error(`MTN requestToPay failed: ${axErr.response?.status} ${JSON.stringify(axErr.response?.data)}`)
  }
}

export async function getPaymentStatus(referenceId: string): Promise<PaymentStatus> {
  const token = await getAccessToken()

  try {
    const response = await axios.get(
      `${MTN_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Target-Environment': ENVIRONMENT,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    )
    const data = response.data
    return {
      status: data.status,
      reason: data.reason,
      financialTransactionId: data.financialTransactionId,
    }
  } catch (err) {
    const axErr = err as AxiosError
    console.error('MTN getPaymentStatus failed:', axErr.response?.status, axErr.response?.data)
    throw new Error(`MTN status failed: ${axErr.response?.status}`)
  }
}
