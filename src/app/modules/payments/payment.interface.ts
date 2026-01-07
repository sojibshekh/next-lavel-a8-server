/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "@prisma/client/runtime/library";


export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export interface IPayment {

  user: string;                      
  subscriptionId: string;
  transactionId: string;            
  amount: number;                    
  status: PAYMENT_STATUS;
  paymentGatewayData?: any;          
  invoiceUrl?: string;               
  createdAt?: Date;
  updatedAt?: Date;
}