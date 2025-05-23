import React, { useCallback, useId, useMemo } from "react";
import UrlFavicon from "./url-favicon.js";
import { useURLWarnings } from "./useURLWarnings.js";
import { FormDescription } from "../../../../scalars/components/fragments/form-description/form-description.js";
import { FormGroup } from "../../../../scalars/components/fragments/form-group/form-group.js";
import { FormLabel } from "../../../../scalars/components/fragments/form-label/form-label.js";
import { FormMessageList } from "../../../../scalars/components/fragments/form-message/message-list.js";
import { sharedValueTransformers } from "../../../../scalars/lib/shared-value-transformers.js";
import type { InputBaseProps } from "../../../../scalars/components/types.js";
import type { DiffMode, WithDifference } from "../../../../scalars/components/types.js";
import { IconName } from "../../icon/index.js";
import ValueTransformer from "../../../../scalars/components/fragments/value-transformer/index.js";
import { Input } from "../input/index.js";
import { UrlInputDiff } from "./url-input-diff.js";
import { cn } from "../../../../scalars/lib/utils.js";

interface UrlInputWithDifference
  extends Omit<WithDifference<string>, "diffMode"> {
  diffMode?: Extract<DiffMode, "sentences">;
}

type PlatformIcon = IconName | React.ReactElement;

interface UrlInputProps
  extends UrlInputWithDifference, InputBaseProps<string>,
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
      required,
      disabled,
      showWarnings = true,
      warnings: warningsProp,
      errors,
      platformIcons,
      value,
      defaultValue,
      onBlur,

      // diff props
      viewMode = "edition",
      diffMode,
      baseValue,

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

    if (viewMode === "edition") {
      return (
        <FormGroup>
          <FormLabel
            htmlFor={id}
            required={required}
            disabled={disabled}
            hasError={!!errors?.length}
          >
            {label}
          </FormLabel>
          <div className="relative">
            <ValueTransformer transformers={transformers}>
              <Input
                disabled={disabled}
                id={id}
                ref={ref}
                type="url"
                required={required}
                {...props}
                value={value ?? ""}
                onBlur={handleBlur}
                onKeyDown={handleWarningsOnEnter}
                aria-invalid={hasError}
                className={cn(showIcon && "pl-8")}
                data-cast="URLTrim"
              />
            </ValueTransformer>
            <UrlFavicon url={value ?? ""} platformIcons={platformIcons} className="absolute left-2.5 top-0" />
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          {showWarnings && combinedWarnings.length > 0 && (
            <FormMessageList messages={combinedWarnings} type="warning" />
          )}
          {errors && <FormMessageList messages={errors} type="error" />}
        </FormGroup>
      );
    }

    return (
      <UrlInputDiff
        value={value ?? defaultValue ?? ""}
        label={label}
        required={required}
        viewMode={viewMode}
        diffMode={diffMode}
        baseValue={baseValue}
        platformIcons={platformIcons}
      />
    );
  },
);

UrlInput.displayName = "UrlInput";

export {
  UrlInput,
  type PlatformIcon,
  type UrlInputProps,
  type UrlInputWithDifference,
};
