'use client';

import { GetCategories } from '@/infrastructure/categories';
import GetIcons from '@/infrastructure/icons';
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

export interface Dictionary<T> {
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
      className="text-muted-foreground h-5 flex text-sm text-justify stroke-2"
      height="100%"
    />
  );
}

const categoryIconMapping: Dictionary<string> = {};

GetIcons().then((iconsResponse) => {
  GetCategories().then((categoriesResponse) => {
    categoriesResponse.data.forEach((category) => {
      const iconData = iconsResponse.data
        .filter((icon) => icon.id === category.iconId)
        .map((aa) => aa.name)[0];

      categoryIconMapping[category.name] = iconData;
    });
  });
});

export const CategoryIcon: Dictionary<JSX.Element> = {
  Utensils: <IconWrapper IconComponent={Utensils} />,
  HandCoins: <IconWrapper IconComponent={HandCoins} />,
  HomeIcon: <IconWrapper IconComponent={HomeIcon} />,
  Gift: <IconWrapper IconComponent={Gift} />,
  Fuel: <IconWrapper IconComponent={Fuel} />,
  BabyIcon: <IconWrapper IconComponent={BabyIcon} />,
  Plane: <IconWrapper IconComponent={Plane} />,
  HeartIcon: <IconWrapper IconComponent={HeartIcon} />,
};

export const IconIdMap: Dictionary<number> = {
  Utensils: 1,
  HandCoins: 3,
  HomeIcon: 4,
  Gift: 5,
  Fuel: 6,
  BabyIcon: 7,
  Plane: 8,
  HeartIcon: 9,
};

const DefaultCategoryIcon = <IconWrapper IconComponent={HomeIcon} />;

export function GetCategoryIcon(
  key: string,
  show_default: boolean = true,
  className?: string
) {
  const match = CategoryIcon[categoryIconMapping[key]];

  if (match) {
    return <div className={className}>{match}</div>;
  }

  if (show_default) {
    return DefaultCategoryIcon;
  }
}
