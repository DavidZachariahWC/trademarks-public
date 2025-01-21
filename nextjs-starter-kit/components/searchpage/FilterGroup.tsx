import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { DATE_STRATEGIES, BOOLEAN_STRATEGIES } from "@/utils/constants/search";

interface SearchFilter {
  strategy: string;
  query: string;
  label?: string;
}

interface Group {
  operator: "AND" | "OR";
  operands: (SearchFilter | Group)[];
}

interface FilterGroupProps {
  group: Group | null;
  onUpdate: (group: Group) => void;
  onDelete: () => void;
  level: number;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  group,
  onUpdate,
  onDelete,
  level,
}) => {
  const handleOperatorToggle = (index: number, currentOperator: "AND" | "OR") => {
    if (!group) return;

    // If the operand at `index` is itself a sub-group, toggle *that* group's operator
    if ("operator" in group.operands[index]) {
      const subGroup = group.operands[index] as Group;
      const newOperator: "AND" | "OR" = currentOperator === "AND" ? "OR" : "AND";
      const newSubGroup = {
        ...subGroup,
        operator: newOperator,
      };
      const newOperands = [...group.operands];
      newOperands[index] = newSubGroup;
      onUpdate({ ...group, operands: newOperands });
    } else {
      // Otherwise, toggle the operator on this entire group
      const newOperator: "AND" | "OR" = currentOperator === "AND" ? "OR" : "AND";
      onUpdate({ ...group, operator: newOperator });
    }
  };

  const handleGroupQueries = (index: number, currentOperator: "AND" | "OR") => {
    if (!group || index <= 0) return;

    // Create a new sub-group with the current operator
    const newGroup: Group = {
      operator: currentOperator,
      operands: [group.operands[index - 1], group.operands[index]],
    };

    // Update the parent group's operands
    const newOperands = [...group.operands];
    newOperands.splice(index - 1, 2, newGroup);
    onUpdate({ ...group, operands: newOperands });
  };

  const handleUngroupQueries = (index: number) => {
    if (!group) return;

    const operand = group.operands[index];
    if (!("operator" in operand)) return; // Not a group => nothing to do

    // Replace that sub-group with its children
    const newOperands = [...group.operands];
    newOperands.splice(index, 1, ...operand.operands);
    onUpdate({ ...group, operands: newOperands });
  };

  const handleDeleteFilter = (index: number) => {
    if (!group) return;
    const updatedOperands = group.operands.filter((_, i) => i !== index);

    // If we're inside a sub-group (level > 0) and after deletion only 1 remains,
    // remove this entire sub-group and bubble up that sole operand instead.
    if (level > 0 && updatedOperands.length === 1) {
      onDelete();
      return;
    }

    onUpdate({ ...group, operands: updatedOperands });
  };

  const renderFilterText = (filter: SearchFilter): string => {
    if (BOOLEAN_STRATEGIES.has(filter.strategy)) {
      return `${filter.label || filter.strategy} IS TRUE`;
    }
    return `${filter.label || filter.strategy} = "${filter.query}"`;
  };

  const renderOperatorControls = (index: number) => {
    // If this is the *first* item, there's no preceding operator to toggle
    if (!group || index === 0) return null;

    const operand = group.operands[index];
    // If this operand is a sub-group, it has its own operator
    const currentOperator = "operator" in operand ? operand.operator : group.operator;

    return (
      <span className="inline-flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className={`font-medium min-w-[50px] px-3 py-1 h-auto bg-gray-100 hover:bg-gray-200 ${
            currentOperator === "AND"
              ? "text-green-700 hover:text-green-800"
              : "text-orange-700 hover:text-orange-800"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleOperatorToggle(index, currentOperator);
          }}
        >
          {currentOperator}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-auto px-3 py-1 min-w-[70px] bg-gray-100 hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            if ("operator" in operand) {
              handleUngroupQueries(index);
            } else {
              handleGroupQueries(index, currentOperator);
            }
          }}
        >
          {"operator" in operand ? "Ungroup" : "Group"}
        </Button>
      </span>
    );
  };

  const renderFilter = (filter: SearchFilter, index: number) => {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="bg-gray-100 px-3 py-1 rounded text-gray-900">
          {renderFilterText(filter)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteFilter(index)}
          className="h-auto p-1 hover:bg-red-50"
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </span>
    );
  };

  const renderGroup = (groupToRender: Group, index: number) => {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="bg-blue-50 px-3 py-1 rounded border border-blue-200">
          {`(${groupToRender.operands
            .map((op) =>
              "operator" in op
                ? `(${op.operands
                    .map((child) =>
                      renderFilterText(child as SearchFilter)
                    )
                    .join(` ${op.operator} `)})`
                : renderFilterText(op)
            )
            .join(` ${groupToRender.operator} `)})`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteFilter(index)}
          className="h-auto p-1 hover:bg-red-50"
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </span>
    );
  };

  if (!group) return null;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg font-mono text-sm">
      <div className="flex flex-wrap items-center gap-3">
        {group.operands.map((operand, idx) => (
          <span key={idx} className="inline-flex items-center gap-3">
            {renderOperatorControls(idx)}
            {"operator" in operand ? (
              renderGroup(operand, idx)
            ) : (
              renderFilter(operand, idx)
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;