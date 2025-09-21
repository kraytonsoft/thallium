import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
export const useConstantSnapPoint = (bottomSheetMinHeight: number): string => {
  const percentage = Math.ceil((bottomSheetMinHeight / height) * 100);
  return `${percentage}%`;
};
