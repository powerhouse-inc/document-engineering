import type { DiffMode, WithDifference } from "../../../../scalars/components/types.js";
import { IconName } from "../../icon/index.js";
import type { InputBaseProps } from "../../../../scalars/components/types.js";

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

export type { UrlInputProps, PlatformIcon, UrlInputWithDifference };
