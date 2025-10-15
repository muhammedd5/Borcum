/// <reference path="../../test-globals.d.ts" />
import { 
  calculateFixedInstallmentLoan, 
  calculateDecliningBalanceLoan,
  calculateEarlyPaymentSavings,
  calculateCreditCardMinimumPayment,
} from '../calculations';
import { Decimal } from '../decimal';

describe('Hesaplama Motoru Testleri', () => {
  describe('Sabit Taksitli Kredi (Anuitet)', () => {
    it('100.000 TL, %2 aylık faiz, 12 ay için doğru hesaplama yapmalı', () => {
      const result = calculateFixedInstallmentLoan({
        principal: '100000',
        annualInterestRate: '24',
        numberOfMonths: 12,
        interestType: 'fixed',
      });

      expect(result.amortizationSchedule).toHaveLength(12);
      expect(parseFloat(result.monthlyPayment)).toBeGreaterThan(9000);
      expect(parseFloat(result.totalInterest)).toBeGreaterThan(13000);
      
      const lastRow = result.amortizationSchedule[11];
      expect(parseFloat(lastRow.remainingBalance)).toBeLessThan(1);
    });

    it('Amortisman tablosunda kalan bakiye azalmalı', () => {
      const result = calculateFixedInstallmentLoan({
        principal: '50000',
        annualInterestRate: '18',
        numberOfMonths: 6,
        interestType: 'fixed',
      });

      for (let i = 1; i < result.amortizationSchedule.length; i++) {
        const current = parseFloat(result.amortizationSchedule[i].remainingBalance);
        const previous = parseFloat(result.amortizationSchedule[i - 1].remainingBalance);
        expect(current).toBeLessThan(previous);
      }
    });
  });

  describe('Azalan Bakiye Kredisi', () => {
    it('100.000 TL, %2 aylık faiz, 12 ay için doğru hesaplama yapmalı', () => {
      const result = calculateDecliningBalanceLoan({
        principal: '100000',
        annualInterestRate: '24',
        numberOfMonths: 12,
        interestType: 'declining',
      });

      expect(result.amortizationSchedule).toHaveLength(12);
      
      const firstPayment = parseFloat(result.amortizationSchedule[0].payment);
      const lastPayment = parseFloat(result.amortizationSchedule[11].payment);
      expect(firstPayment).toBeGreaterThan(lastPayment);
      
      const lastRow = result.amortizationSchedule[11];
      expect(parseFloat(lastRow.remainingBalance)).toBeLessThan(1);
    });

    it('Her ay aynı anapara ödemesi yapılmalı', () => {
      const result = calculateDecliningBalanceLoan({
        principal: '60000',
        annualInterestRate: '20',
        numberOfMonths: 10,
        interestType: 'declining',
      });

      const expectedPrincipal = 60000 / 10;
      
      result.amortizationSchedule.forEach(row => {
        expect(Math.abs(parseFloat(row.principal) - expectedPrincipal)).toBeLessThan(0.01);
      });
    });
  });

  describe('Erken Ödeme Tasarrufu', () => {
    it('Erken ödeme ile faiz tasarrufu hesaplamalı', () => {
      const savings = calculateEarlyPaymentSavings(
        '50000',
        '24',
        12,
        '10000',
        'fixed'
      );

      expect(parseFloat(savings.interestSavings)).toBeGreaterThan(0);
      expect(parseFloat(savings.newMonthlyPayment)).toBeLessThan(
        parseFloat(calculateFixedInstallmentLoan({
          principal: '50000',
          annualInterestRate: '24',
          numberOfMonths: 12,
          interestType: 'fixed',
        }).monthlyPayment)
      );
    });

    it('Tam ödeme yapılırsa tüm faiz tasarrufu sağlanmalı', () => {
      const savings = calculateEarlyPaymentSavings(
        '30000',
        '18',
        6,
        '30000',
        'fixed'
      );

      expect(parseFloat(savings.newMonthlyPayment)).toBe(0);
      expect(parseFloat(savings.interestSavings)).toBeGreaterThan(0);
      expect(savings.monthsSaved).toBe(6);
    });
  });

  describe('Kredi Kartı Minimum Ödeme', () => {
    it('Faiz + %2 anapara = minimum ödeme', () => {
      const balance = '10000';
      const rate = '3';
      const minimum = calculateCreditCardMinimumPayment(balance, rate);
      
      const interest = 10000 * 0.03;
      const principal = 10000 * 0.02;
      const expected = interest + principal;
      
      expect(parseFloat(minimum)).toBeCloseTo(expected, 2);
    });

    it('Minimum ödeme 100 TL\'den az olmamalı', () => {
      const minimum = calculateCreditCardMinimumPayment('3000', '3');
      expect(parseFloat(minimum)).toBeGreaterThanOrEqual(100);
    });
    
    it('Bakiye 100 TL\'den azsa, bakiyenin tamamı minimum ödeme olmalı', () => {
      const minimum = calculateCreditCardMinimumPayment('50', '3');
      expect(parseFloat(minimum)).toBe(50);
    });
  });

  describe('Decimal Sınıfı', () => {
    it('Toplama işlemi doğru çalışmalı', () => {
      const a = new Decimal('100.50');
      const b = new Decimal('50.25');
      const result = a.add(b);
      expect(result.toFixed(2)).toBe('150.75');
    });

    it('Çıkarma işlemi doğru çalışmalı', () => {
      const a = new Decimal('100.50');
      const b = new Decimal('50.25');
      const result = a.subtract(b);
      expect(result.toFixed(2)).toBe('50.25');
    });

    it('Çarpma işlemi doğru çalışmalı', () => {
      const a = new Decimal('10.5');
      const b = new Decimal('2');
      const result = a.multiply(b);
      expect(result.toFixed(2)).toBe('21.00');
    });

    it('Bölme işlemi doğru çalışmalı', () => {
      const a = new Decimal('100');
      const b = new Decimal('4');
      const result = a.divide(b);
      expect(result.toFixed(2)).toBe('25.00');
    });

    it('Sıfıra bölme hatası vermeli', () => {
      const a = new Decimal('100');
      const b = new Decimal('0');
      expect(() => a.divide(b)).toThrow('Division by zero');
    });
  });
});
