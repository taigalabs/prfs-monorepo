import React from "react";
import cn from "classnames";

import styles from "./InfiniteScrollComponents.module.scss";

export const InfiniteScrollWrapper: React.FC<TimelineFeedsWrapperProps> = ({
  children,
  innerRef,
  className,
  handleScroll,
}) => {
  return (
    <div className={cn(styles.wrapper, className)} ref={innerRef} onScroll={handleScroll}>
      {children}
    </div>
  );
};

export const InfiniteScrollInner: React.FC<TimelineFeedsMainProps> = ({ children, className }) => {
  return <div className={cn(styles.inner, className)}>{children}</div>;
};

export const InfiniteScrollMain: React.FC<TimelineFeedsMainProps> = ({ children, className }) => {
  return <div className={cn(styles.main, className)}>{children}</div>;
};

export const InfiniteScrollLeft: React.FC<TimelineFeedsMainProps> = ({ children, className }) => {
  return <div className={cn(styles.left, className)}>{children}</div>;
};

export const InfiniteScrollRight: React.FC<TimelineFeedsMainProps> = ({ children, className }) => {
  return <div className={cn(styles.right, className)}>{children}</div>;
};

export const InfiniteScrollRowWrapper = React.forwardRef<any, TimelineFeedsMainProps>(
  ({ children, className, style }, ref) => {
    return (
      <div className={cn(styles.rowWrapper, className)} style={style} ref={ref}>
        {children}
      </div>
    );
  },
);

export const InfiniteScrollRowContainerOuter: React.FC<TimelineFeedsMainProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div className={cn(styles.rowContainerOuter, className)} style={style}>
      {children}
    </div>
  );
};

export const InfiniteScrollRowContainerInner: React.FC<TimelineFeedsMainProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div className={cn(styles.rowContainerInner, className)} style={style}>
      {children}
    </div>
  );
};

export interface TimelineFeedsWrapperProps {
  children: React.ReactNode;
  className?: string;
  innerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleScroll?: () => void;
}

export interface TimelineFeedsMainProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface InfiniteScrollPlaceholderProps {
  className?: string;
}
