import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import React from 'react';
import ThemedText from './ThemedText';

const WithTooltip = ({
  tooltipContents,
  children,
}: {
  children: React.ReactNode;
  tooltipContents: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <ThemedText>{tooltipContents}</ThemedText>
      </TooltipContent>
    </Tooltip>
  );
};
export default WithTooltip;
