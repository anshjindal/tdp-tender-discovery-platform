import React from "react";
import { iconList } from "../_export-helpers";
import styles from "./Icon.module.scss"; 


/**
 * TODO:
 * Performance optimization for:
 * - Rendering
 * - Algorythm
 * - Accessibility
 */
const Icon = ({
  name = "CaretCircleRight", // Default icon
  className,
  size = 24,
  color = "black",
}: IconProps) => {

  // No rendering if the name is not provided
  if (!name) {
    return null;
  }

  // casting the icon by name
  const SvgIcon = iconList[name];

  const noFillIcons = ["Arrow", "Search", "Warning", "Home"];

  const iconProps = {
    className: `${styles.icon} ${className || ""}`,
    width: size,
    height: size,
    role: "img",
    "aria-label": `${name} icon`,
    ...(noFillIcons.includes(name) ? {} : { fill: color }),
  };

  return <SvgIcon {...iconProps} />;
};


export type IconProps = {
  name?: keyof typeof iconList;
  className?: string;
  size?: number;
  color?: string;
};

export default Icon;
