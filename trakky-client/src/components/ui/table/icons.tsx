'use client';

import {
  Fuel,
  Gift,
  HandCoins,
  Plane,
  Utensils,
  HomeIcon,
  LucideIcon,
  BabyIcon,
  HeartIcon,
} from 'lucide-react';

interface Dictionary<T> {
  [Key: string]: T;
}

interface IconProps {
  IconComponent: LucideIcon;
}

function IconWrapper({ IconComponent }: IconProps) {
  return (
    <IconComponent
      strokeWidth={1}
      alignmentBaseline="middle"
      className="text-muted-foreground flex text-sm text-justify mt-1"
      height="100%"
    />
  );
}

export const CategoryIcon: Dictionary<JSX.Element> = {
  General: <IconWrapper IconComponent={Utensils} />,
  Bills: <IconWrapper IconComponent={HandCoins} />,
  Home: <IconWrapper IconComponent={HomeIcon} />,
  Personal: <IconWrapper IconComponent={Gift} />,
  Transport: <IconWrapper IconComponent={Fuel} />,
  Froppy: <IconWrapper IconComponent={BabyIcon} />,
  Travel: <IconWrapper IconComponent={Plane} />,
  HeartIcon: <IconWrapper IconComponent={HeartIcon} />,
};

export const DefaultCategoryIcon = <IconWrapper IconComponent={HomeIcon} />;
