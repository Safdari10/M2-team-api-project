import { CarValueRequest, CarValueResponse, ErrorResponse, QuoteResponse } from '../types/car';

const API_BASE_URL = 'http://localhost:4000/api';

// API 1: Calculate Car Value
export async function calculateCarValue(data: CarValueRequest): Promise<CarValueResponse> {
  try {
    console.log('Sending request to:', `${API_BASE_URL}/v1/car-value`);
    console.log('Request data:', data);

    const response = await fetch(`${API_BASE_URL}/v1/car-value`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData?.error || 'Failed to calculate car value');
    }

    return response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// API 2: Calculate Risk Rating
export async function calculateRiskRating(claimHistory: string): Promise<{ risk_rating: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/v2/risk-rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claim_history: claimHistory }),
    });

    if (!response.ok) {
      throw new Error('Failed to calculate risk rating');
    }

    return response.json();
  } catch (error) {
    throw new Error('Failed to calculate risk rating');
  }
}

// API 3: Calculate Insurance Quote
export async function calculateQuote(carValue: number, riskRating: number): Promise<QuoteResponse> {
  try {
    console.log('Sending quote request:', { car_value: carValue, risk_rating: riskRating });
    
    const response = await fetch(`${API_BASE_URL}/v3/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        car_value: carValue, 
        risk_rating: riskRating 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Quote response:', data);
    return data;
  } catch (error) {
    console.error('Error calculating quote:', error);
    throw error;
  }
}