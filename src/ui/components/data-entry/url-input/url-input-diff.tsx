import { FormGroup } from "../../../../scalars/components/fragments/form-group/form-group.js";
import { FormLabel } from "../../../../scalars/components/fragments/form-label/form-label.js";
import { SplittedInputDiff } from "../input/splitted-input-diff.js";
import type { UrlInputProps, UrlInputWithDifference } from "./url-input.js";

interface UrlInputDiffProps extends UrlInputWithDifference {
  value: string;
  label: UrlInputProps["label"];
  required: UrlInputProps["required"];
  platformIcons: UrlInputProps["platformIcons"];
}

const UrlInputDiff = ({
  value = "",
  label,
  required,
  viewMode,
  diffMode = "sentences",
  baseValue = "",
  platformIcons,
}: UrlInputDiffProps) => {
  return (
    <FormGroup>
      {label && (
        <FormLabel disabled={true} required={required}>
          {label}
        </FormLabel>
      )}
      <SplittedInputDiff
        baseValue={baseValue}
        value={value}
        viewMode={viewMode}
        diffMode={diffMode}
        asLink={true}
        platformIcons={platformIcons}
      />
    </FormGroup>
  );
};

export { UrlInputDiff };
