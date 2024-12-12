export type ThemeType = 'light' | 'dark';

export interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  primary: string;
  card: string;
  cardBorder: string;
  danger: string;
  tabBar: string;
  tabBarInactive: string;
  headerBackground: string;
}

export const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  primary: '#2C3E50',
  card: '#f5f6fa',
  cardBorder: '#E0E0E0',
  danger: '#e74c3c',
  tabBar: '#FFFFFF',
  tabBarInactive: '#95a5a6',
  headerBackground: '#2C3E50',
};

export const darkTheme: Theme = {
  background: '#1a1a1a',
  text: '#FFFFFF',
  textSecondary: '#95a5a6',
  primary: '#3498db',
  card: '#2c2c2c',
  cardBorder: '#404040',
  danger: '#e74c3c',
  tabBar: '#2c2c2c',
  tabBarInactive: '#7F8C8D',
  headerBackground: '#2c2c2c',
};
