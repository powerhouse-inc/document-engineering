import { cn, type WithDifference } from "#scalars";
import { diffSentences, diffWords } from "diff";
import { useMemo } from "react";

interface TextDiffProps extends WithDifference<string> {
  value: string;
  className?: string;
  childrenClassName?: string;
  asLink?: boolean;
  icon?: JSX.Element | null;
}

export const TextDiff = ({
  baseValue,
  value,
  viewMode,
  diffMode = "words",
  className,
  childrenClassName,
  asLink = false,
  icon,
}: TextDiffProps) => {
  const wordsDiff = useMemo(() => {
    return diffMode === "words"
      ? diffWords(baseValue ?? "", value)
      : diffSentences(baseValue ?? "", value);
  }, [baseValue, value, diffMode]);

  const hasAdditions = useMemo(() => {
    return wordsDiff.some((word) => word.added);
  }, [wordsDiff]);

  const hasRemovals = useMemo(() => {
    return wordsDiff.some((word) => word.removed);
  }, [wordsDiff]);

  const bgColor =
    diffMode === "sentences" && (hasAdditions || hasRemovals)
      ? viewMode === "addition"
        ? "bg-green-600/30"
        : viewMode === "removal"
          ? "bg-red-600/30"
          : undefined
      : undefined;

  // render the diff content
  const renderDiffContent = () => {
    return wordsDiff.map((word, index) => {
      return word.added ? (
        viewMode === "addition" || viewMode === "mixed" ? (
          <span
            className={cn(
              (diffMode === "words" || viewMode === "mixed") &&
                "bg-green-600/30",
              childrenClassName,
            )}
            key={`${word.value}-${index}`}
          >
            {word.value}
          </span>
        ) : null
      ) : word.removed ? (
        viewMode === "removal" || viewMode === "mixed" ? (
          <span
            className={cn(
              (diffMode === "words" || viewMode === "mixed") &&
                "bg-red-600/30",
              childrenClassName,
            )}
            key={`${word.value}-${index}`}
          >
            {word.value}
          </span>
        ) : null
      ) : (
        <span
          key={`${word.value}-${index}`}
          className={cn(childrenClassName)}
        >
          {word.value}
        </span>
      );
    });
  };

  return asLink && diffMode === "sentences" ? (
    <div
      className={cn(
        "flex flex-1 items-center gap-2 truncate leading-[18px]",
        bgColor, className,
      )}
    >
      {((viewMode === "addition" && hasAdditions) || (viewMode === "removal" && hasRemovals)) && (
        <>
          {icon && icon}
          <a
            href={viewMode === "removal" ? baseValue : value}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "truncate text-blue-900 hover:underline focus-visible:outline-none",
            )}
          >
            {renderDiffContent()}
          </a>
        </>
      )}
    </div>
  ) : (
    <span className={cn("leading-[18px] text-gray-700", bgColor, className)}>
      {renderDiffContent()}
    </span>
  );
};
