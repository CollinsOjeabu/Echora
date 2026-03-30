// Added React import to fix 'Cannot find namespace React' error for the React.ReactNode type
import React from 'react';

export interface AgentState {
  id: string;
  name: string;
  platform: 'LinkedIn' | 'Twitter';
  status: 'monitoring' | 'researching' | 'composing' | 'analyzing' | 'idle';
  activity: string;
  lastUpdate: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export enum ThemeVariant {
  PREMIUM = 'premium',
  ENERGETIC = 'energetic'
}