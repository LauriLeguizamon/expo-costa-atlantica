import React from "react";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { hstackStyle } from "./styles";

type IHStackProps = React.ComponentPropsWithoutRef<"View"> &
  VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<React.ElementRef<"View">, IHStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <View
        className={hstackStyle({ space, reversed, class: className })}
        {...props}
        ref={ref}
      />
    );
  }
);

HStack.displayName = "HStack";

export { HStack };
