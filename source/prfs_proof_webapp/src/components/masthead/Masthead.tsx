"use client";

import React from "react";
import cn from "classnames";
import PrfsAppsPopover from "@taigalabs/prfs-react-lib/src/prfs_apps_popover/PrfsAppsPopover";
import {
  PrfsAppsPopoverLi,
  PrfsAppsPopoverUl,
} from "@taigalabs/prfs-react-lib/src/prfs_apps_popover/Modal";
import { TbCertificate } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbCertificate";
import { TbMathPi } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbMathPi";
import { GrMonitor } from "@react-icons/all-files/gr/GrMonitor";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInBtn from "@/components/prfs_id_sign_in_btn/PrfsIdSignInBtn";
import { useIsTutorial } from "@/hooks/tutorial";
import { useUrls } from "@/hooks/useUrls";

export const MastheadWrapper: React.FC<MastheadWrapperProps> = ({
  children,
  className,
  twoColumn,
  tallHeight,
  smallPadding,
}) => {
  const isTutorial = useIsTutorial();
  return (
    <div
      className={cn(styles.wrapper, className, {
        [styles.isTutorial]: isTutorial,
        [styles.twoColumn]: twoColumn,
        [styles.smallPadding]: smallPadding,
        [styles.tallHeight]: tallHeight,
      })}
    >
      {children}
    </div>
  );
};

export const MastheadLogoArea: React.FC<MastheadProps> = ({ children, className }) => {
  return <div className={cn(styles.logoArea, className)}>{children}</div>;
};

export const MastheadPlaceholder: React.FC<MastheadPlaceholderProps> = ({
  className,
  twoColumn,
  tallHeight,
}) => {
  return (
    <div
      className={cn(styles.placeholder, className, {
        [styles.twoColumn]: twoColumn,
        [styles.tallHeight]: tallHeight,
      })}
    />
  );
};

export const MastheadMain: React.FC<MastheadProps> = ({ className, children }) => {
  return <div className={cn(styles.main, className)}>{children}</div>;
};

export const MastheadRightGroup: React.FC<MastheadProps> = ({
  children,
  className,
  staticPosition,
}) => {
  return (
    <ul className={cn(styles.rightGroup, className, { [styles.staticPosition]: staticPosition })}>
      {children}
    </ul>
  );
};

export const MastheadRightGroupMenu: React.FC<MastheadProps> = ({ children, className }) => {
  return <li className={cn(styles.menu, className)}>{children}</li>;
};

export interface MastheadWrapperProps {
  children: React.ReactNode;
  className?: string;
  twoColumn?: boolean;
  smallPadding?: boolean;
  tallHeight?: boolean;
}

export interface MastheadProps {
  children: React.ReactNode;
  className?: string;
  staticPosition?: boolean;
}

export interface MastheadPlaceholderProps {
  className?: string;
  twoColumn?: boolean;
  tallHeight?: boolean;
}
