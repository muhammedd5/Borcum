import { Decimal } from './decimal';
import { AmortizationRow, InterestType } from '@/types';

export interface LoanCalculationInput {
  principal: string;
  annualInterestRate: string;
  numberOfMonths: number;
  interestType: InterestType;
  startDate?: Date;
}

export interface LoanCalculationResult {
  monthlyPayment: string;
  totalPayment: string;
  totalInterest: string;
  totalPrincipal: string;
  amortizationSchedule: AmortizationRow[];
}

export const calculateFixedInstallmentLoan = (
  input: LoanCalculationInput
): LoanCalculationResult => {
  const principal = Decimal.fromString(input.principal);
  const annualRate = Decimal.fromString(input.annualInterestRate);
  const monthlyRate = annualRate.divide(Decimal.fromString('100')).divide(Decimal.fromString('12'));
  const n = input.numberOfMonths;
  
  if (monthlyRate.isZero()) {
    const monthlyPayment = principal.divide(Decimal.fromNumber(n));
    const schedule: AmortizationRow[] = [];
    let remainingBalance = principal;
    const startDate = input.startDate || new Date();
    
    for (let month = 1; month <= n; month++) {
      remainingBalance = remainingBalance.subtract(monthlyPayment);
      
      if (remainingBalance.isLessThan(Decimal.fromString('0.01'))) {
        remainingBalance = Decimal.zero();
      }
      
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + month);
      
      schedule.push({
        month,
        payment: monthlyPayment.toString(),
        principal: monthlyPayment.toString(),
        interest: '0',
        remainingBalance: remainingBalance.toString(),
        date: paymentDate.toISOString(),
      });
    }
    
    return {
      monthlyPayment: monthlyPayment.toString(),
      totalPayment: principal.toString(),
      totalInterest: '0',
      totalPrincipal: principal.toString(),
      amortizationSchedule: schedule,
    };
  }
  
  const onePlusR = Decimal.fromString('1').add(monthlyRate);
  const onePlusRPowerN = onePlusR.power(n);
  
  const numerator = principal.multiply(monthlyRate).multiply(onePlusRPowerN);
  const denominator = onePlusRPowerN.subtract(Decimal.fromString('1'));
  const monthlyPayment = numerator.divide(denominator);
  
  const schedule: AmortizationRow[] = [];
  let remainingBalance = principal;
  let totalInterestPaid = Decimal.zero();
  let totalPrincipalPaid = Decimal.zero();
  
  const startDate = input.startDate || new Date();
  
  for (let month = 1; month <= n; month++) {
    const interestPayment = remainingBalance.multiply(monthlyRate);
    const principalPayment = monthlyPayment.subtract(interestPayment);
    
    remainingBalance = remainingBalance.subtract(principalPayment);
    totalInterestPaid = totalInterestPaid.add(interestPayment);
    totalPrincipalPaid = totalPrincipalPaid.add(principalPayment);
    
    if (remainingBalance.isLessThan(Decimal.fromString('0.01'))) {
      remainingBalance = Decimal.zero();
    }
    
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + month);
    
    schedule.push({
      month,
      payment: monthlyPayment.toString(),
      principal: principalPayment.toString(),
      interest: interestPayment.toString(),
      remainingBalance: remainingBalance.toString(),
      date: paymentDate.toISOString(),
    });
  }
  
  const totalPayment = monthlyPayment.multiply(Decimal.fromNumber(n));
  
  return {
    monthlyPayment: monthlyPayment.toString(),
    totalPayment: totalPayment.toString(),
    totalInterest: totalInterestPaid.toString(),
    totalPrincipal: totalPrincipalPaid.toString(),
    amortizationSchedule: schedule,
  };
};

export const calculateDecliningBalanceLoan = (
  input: LoanCalculationInput
): LoanCalculationResult => {
  const principal = Decimal.fromString(input.principal);
  const annualRate = Decimal.fromString(input.annualInterestRate);
  const monthlyRate = annualRate.divide(Decimal.fromString('100')).divide(Decimal.fromString('12'));
  const n = input.numberOfMonths;
  
  const principalPayment = principal.divide(Decimal.fromNumber(n));
  
  const schedule: AmortizationRow[] = [];
  let remainingBalance = principal;
  let totalInterestPaid = Decimal.zero();
  let totalPaymentSum = Decimal.zero();
  
  const startDate = input.startDate || new Date();
  
  for (let month = 1; month <= n; month++) {
    const interestPayment = remainingBalance.multiply(monthlyRate);
    const totalMonthlyPayment = principalPayment.add(interestPayment);
    
    remainingBalance = remainingBalance.subtract(principalPayment);
    totalInterestPaid = totalInterestPaid.add(interestPayment);
    totalPaymentSum = totalPaymentSum.add(totalMonthlyPayment);
    
    if (remainingBalance.isLessThan(Decimal.fromString('0.01'))) {
      remainingBalance = Decimal.zero();
    }
    
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + month);
    
    schedule.push({
      month,
      payment: totalMonthlyPayment.toString(),
      principal: principalPayment.toString(),
      interest: interestPayment.toString(),
      remainingBalance: remainingBalance.toString(),
      date: paymentDate.toISOString(),
    });
  }
  
  const firstPayment = schedule.length > 0 ? schedule[0].payment : '0';
  
  return {
    monthlyPayment: firstPayment,
    totalPayment: totalPaymentSum.toString(),
    totalInterest: totalInterestPaid.toString(),
    totalPrincipal: principal.toString(),
    amortizationSchedule: schedule,
  };
};

export const calculateLoan = (input: LoanCalculationInput): LoanCalculationResult => {
  console.log('[Calculations] calculateLoan', { input });
  
  const principal = Decimal.fromString(input.principal);
  const annualRate = Decimal.fromString(input.annualInterestRate);
  
  if (principal.isLessThan(Decimal.fromString('0.01'))) {
    throw new Error('Ana para 0\'dan büyük olmalıdır.');
  }
  
  if (annualRate.isLessThan(Decimal.zero())) {
    throw new Error('Faiz oranı negatif olamaz.');
  }
  
  if (input.numberOfMonths <= 0) {
    throw new Error('Vade süresi 0\'dan büyük olmalıdır.');
  }
  
  if (input.interestType === 'fixed') {
    return calculateFixedInstallmentLoan(input);
  } else {
    return calculateDecliningBalanceLoan(input);
  }
};

export const calculateEarlyPaymentSavings = (
  currentBalance: string,
  annualInterestRate: string,
  remainingMonths: number,
  earlyPaymentAmount: string,
  interestType: InterestType
): { newMonthlyPayment: string; interestSavings: string; monthsSaved: number } => {
  const originalLoan = calculateLoan({
    principal: currentBalance,
    annualInterestRate,
    numberOfMonths: remainingMonths,
    interestType,
  });
  
  const newBalance = Decimal.fromString(currentBalance).subtract(
    Decimal.fromString(earlyPaymentAmount)
  );
  
  if (newBalance.isLessThan(Decimal.zero()) || newBalance.isZero()) {
    return {
      newMonthlyPayment: '0',
      interestSavings: originalLoan.totalInterest,
      monthsSaved: remainingMonths,
    };
  }
  
  const newLoan = calculateLoan({
    principal: newBalance.toString(),
    annualInterestRate,
    numberOfMonths: remainingMonths,
    interestType,
  });
  
  const interestSavings = Decimal.fromString(originalLoan.totalInterest).subtract(
    Decimal.fromString(newLoan.totalInterest)
  );
  
  return {
    newMonthlyPayment: newLoan.monthlyPayment,
    interestSavings: interestSavings.toString(),
    monthsSaved: 0,
  };
};

export const calculateCreditCardMinimumPayment = (
  balance: string,
  monthlyInterestRate: string
): string => {
  const balanceDecimal = Decimal.fromString(balance);
  const rate = Decimal.fromString(monthlyInterestRate).divide(Decimal.fromString('100'));
  
  const interest = balanceDecimal.multiply(rate);
  const principalPercentage = Decimal.fromString('0.02');
  const principalPayment = balanceDecimal.multiply(principalPercentage);
  
  const minimumPayment = interest.add(principalPayment);
  
  const absoluteMinimum = Decimal.fromString('100');
  
  if (balanceDecimal.isLessThan(absoluteMinimum)) {
    return balanceDecimal.toString();
  }
  
  if (minimumPayment.isLessThan(absoluteMinimum)) {
    return absoluteMinimum.toString();
  }
  
  return minimumPayment.toString();
};

export const calculateCreditCardInterestCost = (
  balance: string,
  monthlyInterestRate: string,
  months: number
): string => {
  const balanceDecimal = Decimal.fromString(balance);
  const rate = Decimal.fromString(monthlyInterestRate).divide(Decimal.fromString('100'));
  
  let totalInterest = Decimal.zero();
  let currentBalance = balanceDecimal;
  
  for (let i = 0; i < months; i++) {
    const monthlyInterest = currentBalance.multiply(rate);
    totalInterest = totalInterest.add(monthlyInterest);
    currentBalance = currentBalance.add(monthlyInterest);
  }
  
  return totalInterest.toString();
};

export interface CreditCardPaymentSimulation {
  month: number;
  startingBalance: string;
  interest: string;
  payment: string;
  principal: string;
  endingBalance: string;
  totalInterestPaid: string;
  date: string;
}

export const simulateCreditCardPayments = (
  balance: string,
  monthlyInterestRate: string,
  monthlyPayment: string,
  startDate?: Date
): CreditCardPaymentSimulation[] => {
  const balanceDecimal = Decimal.fromString(balance);
  const rate = Decimal.fromString(monthlyInterestRate).divide(Decimal.fromString('100'));
  const payment = Decimal.fromString(monthlyPayment);
  
  if (payment.isLessThan(Decimal.fromString('0.01'))) {
    throw new Error('Aylık ödeme tutarı 0\'dan büyük olmalıdır.');
  }
  
  const schedule: CreditCardPaymentSimulation[] = [];
  let currentBalance = balanceDecimal;
  let totalInterest = Decimal.zero();
  let month = 1;
  const start = startDate || new Date();
  
  while (currentBalance.isGreaterThan(Decimal.fromString('0.01')) && month <= 360) {
    const startingBalance = currentBalance;
    const interest = currentBalance.multiply(rate);
    const balanceWithInterest = currentBalance.add(interest);
    
    const actualPayment = balanceWithInterest.isLessThan(payment) 
      ? balanceWithInterest 
      : payment;
    
    if (actualPayment.isLessThan(interest) || actualPayment.isEqual(interest)) {
      throw new Error(`Aylık ödeme tutarı (${actualPayment.toString()}) faiz tutarından (${interest.toString()}) büyük olmalıdır. Aksi takdirde borcunuz hiç bitmez.`);
    }
    
    const principal = actualPayment.subtract(interest);
    const endingBalance = balanceWithInterest.subtract(actualPayment);
    
    totalInterest = totalInterest.add(interest);
    
    const paymentDate = new Date(start);
    paymentDate.setMonth(paymentDate.getMonth() + month);
    
    schedule.push({
      month,
      startingBalance: startingBalance.toString(),
      interest: interest.toString(),
      payment: actualPayment.toString(),
      principal: principal.toString(),
      endingBalance: endingBalance.toString(),
      totalInterestPaid: totalInterest.toString(),
      date: paymentDate.toISOString(),
    });
    
    currentBalance = endingBalance;
    month++;
  }
  
  return schedule;
};

export const calculateCreditCardPayoffTime = (
  balance: string,
  monthlyInterestRate: string,
  monthlyPayment: string
): { months: number; totalInterest: string; totalPayment: string } => {
  try {
    const schedule = simulateCreditCardPayments(balance, monthlyInterestRate, monthlyPayment);
    
    if (schedule.length === 0) {
      return {
        months: 0,
        totalInterest: '0',
        totalPayment: '0',
      };
    }
    
    const lastPayment = schedule[schedule.length - 1];
    const totalPayment = schedule.reduce(
      (sum, row) => sum.add(Decimal.fromString(row.payment)),
      Decimal.zero()
    );
    
    return {
      months: schedule.length,
      totalInterest: lastPayment.totalInterestPaid,
      totalPayment: totalPayment.toString(),
    };
  } catch (error) {
    throw error;
  }
};
