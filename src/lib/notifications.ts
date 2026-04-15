/**
 * Notification trigger functions for BrickToken.
 * Each function combines the email service with the appropriate template.
 */

import { sendEmail } from './email'
import {
  purchaseConfirmation,
  yieldDistribution,
  kycApproved,
  kycRejected,
  welcomeEmail,
  sellOrderFilled,
} from './email-templates'

export async function notifyPurchase(
  investorEmail: string,
  data: {
    investorName: string
    propertyName: string
    tokens: number
    amount: number
    date: string
  }
) {
  return sendEmail({
    to: investorEmail,
    subject: 'Compra confirmada — BrickToken',
    html: purchaseConfirmation(data),
  })
}

export async function notifyYieldDistribution(
  investorEmail: string,
  data: {
    investorName: string
    propertyName: string
    amount: number
    period: string
  }
) {
  return sendEmail({
    to: investorEmail,
    subject: 'Rendimiento distribuido — BrickToken',
    html: yieldDistribution(data),
  })
}

export async function notifyKycApproved(
  investorEmail: string,
  data: {
    investorName: string
  }
) {
  return sendEmail({
    to: investorEmail,
    subject: 'Identidad verificada — BrickToken',
    html: kycApproved(data),
  })
}

export async function notifyKycRejected(
  investorEmail: string,
  data: {
    investorName: string
    reason?: string
  }
) {
  return sendEmail({
    to: investorEmail,
    subject: 'Verificacion rechazada — BrickToken',
    html: kycRejected(data),
  })
}

export async function notifyWelcome(
  investorEmail: string,
  data: {
    investorName: string
  }
) {
  return sendEmail({
    to: investorEmail,
    subject: 'Bienvenido a BrickToken',
    html: welcomeEmail(data),
  })
}

export async function notifySellOrderFilled(
  investorEmail: string,
  data: {
    investorName: string
    propertyName: string
    tokens: number
    amount: number
  }
) {
  return sendEmail({
    to: investorEmail,
    subject: 'Orden de venta completada — BrickToken',
    html: sellOrderFilled(data),
  })
}
