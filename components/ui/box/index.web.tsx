import React from "react";
import { boxStyle } from "./styles";

import type { VariantProps } from "@gluestack-ui/nativewind-utils";

type IBoxProps = React.ComponentPropsWithoutRef<"View"> &
  VariantProps<typeof boxStyle> & { className?: string };

const Box = React.forwardRef<HTMLDivElement, IBoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <View ref={ref} className={boxStyle({ class: className })} {...props} />
    );
  }
);

Box.displayName = "Box";
export { Box };
