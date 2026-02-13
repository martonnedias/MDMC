import React from 'react';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  subtitle: string;
  description: string;
  price: string;
  adBudget: string;
  features: string[];
  highlight?: boolean;
  ctaText: string;
  badge?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  icon_bg?: string;
}

export interface ComboItem {
  name: string;
  includes: string;
  advantage: string;
}

export interface PainPointItem {
  title: string;
  text: string;
}