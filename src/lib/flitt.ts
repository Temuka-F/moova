// Flitt Payment Gateway Integration for TBC Bank
// Documentation: https://docs.flitt.com

interface FlittConfig {
  merchantId: string
  secretKey: string
}

interface CreatePaymentParams {
  orderId: string
  amount: number
  currency?: string
  description: string
  customerEmail: string
  customerPhone?: string
  callbackUrl: string
  successUrl: string
  failUrl: string
  lang?: 'ka' | 'en' | 'ru'
}

interface FlittPaymentResponse {
  paymentId: string
  checkoutUrl: string
  status: string
}

interface PaymentStatus {
  orderId: string
  paymentId: string
  status: 'created' | 'processing' | 'approved' | 'declined' | 'expired' | 'reversed'
  amount: number
  currency: string
  cardMask?: string
  transactionId?: string
}

class FlittClient {
  private merchantId: string
  private secretKey: string
  private baseUrl = 'https://api.flitt.com/api'

  constructor(config: FlittConfig) {
    this.merchantId = config.merchantId
    this.secretKey = config.secretKey
  }

  private async request<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        ...data,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Flitt API error')
    }

    return response.json()
  }

  // Create a new payment
  async createPayment(params: CreatePaymentParams): Promise<FlittPaymentResponse> {
    const data = {
      order_id: params.orderId,
      amount: Math.round(params.amount * 100), // Convert to tetri (cents)
      currency: params.currency || 'GEL',
      order_desc: params.description,
      sender_email: params.customerEmail,
      sender_phone: params.customerPhone,
      response_url: params.callbackUrl,
      result_url: params.successUrl,
      error_url: params.failUrl,
      lang: params.lang || 'ka',
    }

    const response = await this.request<{
      payment_id: string
      checkout_url: string
      response_status: string
    }>('/checkout/url', data)

    return {
      paymentId: response.payment_id,
      checkoutUrl: response.checkout_url,
      status: response.response_status,
    }
  }

  // Check payment status
  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    const response = await this.request<{
      order_id: string
      payment_id: string
      order_status: string
      amount: number
      currency: string
      masked_card?: string
      tran_id?: string
    }>('/status/order', { order_id: orderId })

    return {
      orderId: response.order_id,
      paymentId: response.payment_id,
      status: response.order_status as PaymentStatus['status'],
      amount: response.amount / 100, // Convert from tetri to GEL
      currency: response.currency,
      cardMask: response.masked_card,
      transactionId: response.tran_id,
    }
  }

  // Refund a payment
  async refundPayment(orderId: string, amount?: number): Promise<{ status: string }> {
    const data: Record<string, unknown> = { order_id: orderId }
    if (amount) {
      data.amount = Math.round(amount * 100)
    }

    return this.request('/reverse/order', data)
  }

  // Capture a pre-authorized payment
  async capturePayment(orderId: string, amount: number): Promise<{ status: string }> {
    return this.request('/capture/order', {
      order_id: orderId,
      amount: Math.round(amount * 100),
    })
  }

  // Generate signature for callback verification
  generateSignature(data: Record<string, string>): string {
    const crypto = require('crypto')
    const sortedKeys = Object.keys(data).sort()
    const signString = sortedKeys.map(key => data[key]).join('|') + '|' + this.secretKey
    return crypto.createHash('sha1').update(signString).digest('hex')
  }

  // Verify callback signature
  verifyCallback(data: Record<string, string>, signature: string): boolean {
    return this.generateSignature(data) === signature
  }
}

// Create Flitt client instance
export const flitt = new FlittClient({
  merchantId: process.env.FLITT_MERCHANT_ID!,
  secretKey: process.env.FLITT_SECRET_KEY!,
})

// Calculate platform fee (15%)
export function calculateServiceFee(amount: number): number {
  return Math.round(amount * 0.15 * 100) / 100
}

// Calculate host payout (85%)
export function calculateHostPayout(amount: number): number {
  return Math.round(amount * 0.85 * 100) / 100
}

// Format price in GEL
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ka-GE', {
    style: 'currency',
    currency: 'GEL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export type { CreatePaymentParams, FlittPaymentResponse, PaymentStatus }
