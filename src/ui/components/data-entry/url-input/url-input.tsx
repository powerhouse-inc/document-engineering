import React, { useCallback, useId, useMemo } from "react";
import UrlFavicon from "./url-favicon.js";
import { useURLWarnings } from "./useURLWarnings.js";
import { FormDescription } from "../../../../scalars/components/fragments/form-description/index.js";
import { FormMessageList } from "../../../../scalars/components/fragments/form-message/index.js";
import { FormGroup } from "../../../../scalars/components/fragments/form-group/form-group.js";
import { FormLabel } from "../../../../scalars/components/fragments/form-label/form-label.js";
import { IconName } from "../../icon/index.js";
import { InputBaseProps } from "../../../../scalars/components/types.js";
import { sharedValueTransformers } from "../../../../scalars/lib/shared-value-transformers.js";
import ValueTransformer from "../../../../scalars/components/fragments/value-transformer/value-transformer.js";
import { cn } from "../../../../scalars/lib/index.js";
import { Input } from "../input/input.js";

type PlatformIcon = IconName | React.ReactElement;

interface UrlInputProps
  extends InputBaseProps<string>,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "pattern" | "value" | "defaultValue" | "name" | "maxLength"
    > {
  showWarnings?: boolean;
  platformIcons?: Record<string, PlatformIcon>;
}

const UrlInput = React.forwardRef<HTMLInputElement, UrlInputProps>(
  (
    {
      label,
      description,
      showWarnings = true,
      warnings: warningsProp,
      errors,
      platformIcons,
      value,
      onBlur,
      // onChange,

      ...props
    },
    ref,
  ) => {
    const idGenerated = useId();
    const id = props.id ?? idGenerated;
    const hasError = !!errors?.length;
    const { warnings, checkForWarnings } = useURLWarnings(value ?? "");
    const showIcon = Object.keys(platformIcons ?? {}).length > 0;

    const combinedWarnings = useMemo(() => {
      return [...(warningsProp ?? []), ...warnings];
    }, [warningsProp, warnings]);

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        checkForWarnings();
        onBlur?.(event);
      },
      [checkForWarnings, onBlur],
    );

    const handleWarningsOnEnter = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          checkForWarnings();
        }
      },
      [checkForWarnings],
    );

    // prevent url from having trailing spaces
    const transformers = useMemo(
      () => [sharedValueTransformers.trimOnBlur()],
      [],
    );

    return (
      <FormGroup>
        <FormLabel
          htmlFor={id}
          required={props.required}
          disabled={props.disabled}
          hasError={!!errors?.length}
        >
          {label}
        </FormLabel>
        <div className="relative">
          <ValueTransformer transformers={transformers}>
            <Input
              id={id}
              ref={ref}
              type="url"
              {...props}
              value={value ?? ""}
              // onChange={onChange}
              onBlur={handleBlur}
              onKeyDown={handleWarningsOnEnter}
              aria-invalid={hasError}
              className={cn(showIcon && "pl-8")}
              data-cast="URLTrim"
            />
          </ValueTransformer>
          <UrlFavicon url={value ?? ""} platformIcons={platformIcons} />
        </div>
        {description && <FormDescription>{description}</FormDescription>}
        {showWarnings && combinedWarnings.length > 0 && (
          <FormMessageList messages={combinedWarnings} type="warning" />
        )}
        {errors && <FormMessageList messages={errors} type="error" />}
      </FormGroup>
    );
  },
);

UrlInput.displayName = "UrlInput";

export { UrlInput, type PlatformIcon, type UrlInputProps };
