import React from "react";
import { cardStyle } from "./styles";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";

type ICardProps = React.ComponentPropsWithoutRef<"View"> &
  VariantProps<typeof cardStyle>;

const Card = React.forwardRef<HTMLDivElement, ICardProps>(
  ({ className, size = "md", variant = "elevated", ...props }, ref) => {
    return (
      <View
        className={cardStyle({ size, variant, class: className })}
        {...props}
        ref={ref}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
