export class Decimal {
  private value: string;

  constructor(value: string | number) {
    if (typeof value === 'number') {
      this.value = value.toFixed(20).replace(/\.?0+$/, '');
    } else {
      this.value = value;
    }
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
    return new Decimal((a + b).toFixed(20));
  }

  subtract(other: Decimal): Decimal {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    return new Decimal((a - b).toFixed(20));
  }

  multiply(other: Decimal): Decimal {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    return new Decimal((a * b).toFixed(20));
  }

  divide(other: Decimal): Decimal {
    const a = parseFloat(this.value);
    const b = parseFloat(other.value);
    if (b === 0) throw new Error('Division by zero');
    return new Decimal((a / b).toFixed(20));
  }

  power(exponent: number): Decimal {
    const a = parseFloat(this.value);
    return new Decimal(Math.pow(a, exponent).toFixed(20));
  }

  isGreaterThan(other: Decimal): boolean {
    return parseFloat(this.value) > parseFloat(other.value);
  }

  isLessThan(other: Decimal): boolean {
    return parseFloat(this.value) < parseFloat(other.value);
  }

  isEqual(other: Decimal): boolean {
    return parseFloat(this.value) === parseFloat(other.value);
  }

  isZero(): boolean {
    return parseFloat(this.value) === 0;
  }

  toString(): string {
    const num = parseFloat(this.value);
    return num.toFixed(2);
  }

  toNumber(): number {
    return parseFloat(this.value);
  }

  toFixed(decimals: number): string {
    return parseFloat(this.value).toFixed(decimals);
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
