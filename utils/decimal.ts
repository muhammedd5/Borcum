export class Decimal {
  private value: string;

  constructor(value: string | number) {
    if (typeof value === 'number') {
      if (!isFinite(value)) {
        throw new Error('Invalid number: must be finite');
      }
      this.value = this.normalizeNumber(value.toString());
    } else {
      this.value = this.normalizeNumber(value);
    }
  }

  private normalizeNumber(str: string): string {
    const cleaned = str.trim();
    if (cleaned === '' || cleaned === 'NaN' || cleaned === 'Infinity' || cleaned === '-Infinity') {
      return '0';
    }
    const num = parseFloat(cleaned);
    if (isNaN(num) || !isFinite(num)) {
      return '0';
    }
    return cleaned;
  }

  static fromString(value: string): Decimal {
    return new Decimal(value);
  }

  static fromNumber(value: number): Decimal {
    return new Decimal(value);
  }

  static zero(): Decimal {
    return new Decimal('0');
  }

  add(other: Decimal): Decimal {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    if (isNaN(a) || isNaN(b)) return Decimal.zero();
    const result = a + b;
    if (!isFinite(result)) return Decimal.zero();
    return new Decimal(result);
  }

  subtract(other: Decimal): Decimal {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    if (isNaN(a) || isNaN(b)) return Decimal.zero();
    const result = a - b;
    if (!isFinite(result)) return Decimal.zero();
    return new Decimal(result);
  }

  multiply(other: Decimal): Decimal {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    if (isNaN(a) || isNaN(b)) return Decimal.zero();
    const result = a * b;
    if (!isFinite(result)) return Decimal.zero();
    return new Decimal(result);
  }

  divide(other: Decimal): Decimal {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    if (isNaN(a) || isNaN(b)) throw new Error('Invalid number in division');
    if (b === 0) throw new Error('Division by zero');
    const result = a / b;
    if (!isFinite(result)) throw new Error('Division result is not finite');
    return new Decimal(result);
  }

  power(exponent: number): Decimal {
    const a = parseFloat(this.value);
    if (isNaN(a)) return Decimal.zero();
    const result = Math.pow(a, exponent);
    if (!isFinite(result)) return Decimal.zero();
    return new Decimal(result);
  }

  abs(): Decimal {
    const a = parseFloat(this.value);
    return new Decimal(Math.abs(a));
  }

  isGreaterThan(other: Decimal): boolean {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    if (isNaN(a) || isNaN(b)) return false;
    return a > b;
  }

  isLessThan(other: Decimal): boolean {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    if (isNaN(a) || isNaN(b)) return false;
    return a < b;
  }

  isEqual(other: Decimal): boolean {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    if (isNaN(a) || isNaN(b)) return false;
    return Math.abs(a - b) < 0.000001;
  }

  isZero(): boolean {
    const a = parseFloat(this.value);
    return Math.abs(a) < 0.000001;
  }

  isNegative(): boolean {
    const a = parseFloat(this.value);
    return a < 0;
  }

  toString(): string {
    const num = parseFloat(this.value);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  }

  toNumber(): number {
    const num = parseFloat(this.value);
    return isNaN(num) ? 0 : num;
  }

  toFixed(decimals: number): string {
    const num = parseFloat(this.value);
    if (isNaN(num)) return '0'.padEnd(decimals + 2, '0');
    return num.toFixed(decimals);
  }
}

export const formatCurrency = (value: string | Decimal, showSymbol: boolean = true): string => {
  const decimal = typeof value === 'string' ? Decimal.fromString(value) : value;
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(decimal.toNumber());
  
  return showSymbol ? `${formatted} ₺` : formatted;
};

export const formatPercentage = (value: string | Decimal): string => {
  const decimal = typeof value === 'string' ? Decimal.fromString(value) : value;
  return `%${decimal.toFixed(2)}`;
};
