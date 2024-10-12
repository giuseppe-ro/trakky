'use client';

import { Endpoint } from '@/constants';
import { Client, GetIcons } from '@/infrastructure/client-injector';
import { Category } from '@/models/dtos';
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
      className="text-muted-foreground h-8 w-6 flex text-sm text-justify stroke-2"
    />
  );
}

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

export async function GetCategoryIconMapping() {
  const mapping: Dictionary<string> = {};

  const iconsResponse = await GetIcons();
  const { data } = await Client.Get(Endpoint.Categories);

  const categoriesResponse = data as Category[];

  categoriesResponse.forEach((category) => {
    const iconData = iconsResponse.data
      .filter((icon) => icon.id === category.iconId)
      .map((icon) => icon.name)[0];

    mapping[category.name] = iconData;
  });

  return mapping;
}

interface GetCategoryIconProps {
  key: string;
  mapping: Dictionary<string>;
  show_default?: boolean;
  className?: string;
}

export function GetCategoryIcon({
  key,
  mapping,
  show_default,
  className,
}: GetCategoryIconProps) {
  const match = CategoryIcon[mapping[key]];

  if (match) {
    return <div className={className}>{match}</div>;
  }

  if (show_default) {
    return DefaultCategoryIcon;
  }
}

GetCategoryIcon.defaultProps = {
  show_default: true,
  className: null,
};
