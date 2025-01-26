// FilterGroup.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronRight } from "lucide-react";
import { DATE_STRATEGIES, BOOLEAN_STRATEGIES } from "@/utils/constants/search";

interface SearchFilter {
  strategy: string;
  query: string;
  label?: string;
}

interface Group {
  operands: (SearchFilter | Group)[];
  adjacentOperators: ("AND" | "OR")[];
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
  const handleOperatorToggle = (idx: number) => {
    if (!group || level > 0) return; // Only allow toggling at the root level
    
    const oldOp = group.adjacentOperators[idx];
    const newOp = oldOp === "AND" ? "OR" : "AND";
    
    const newAdjacent = [...group.adjacentOperators];
    newAdjacent[idx] = newOp;
    
    onUpdate({
      operands: group.operands,
      adjacentOperators: newAdjacent
    });
  };

  const handleGroupQueries = (idx: number) => {
    if (!group || idx >= group.operands.length - 1) return;

    const leftOperand = group.operands[idx];
    const rightOperand = group.operands[idx + 1];
    const opBetween = group.adjacentOperators[idx];

    const newSubGroup: Group = {
      operands: [leftOperand, rightOperand],
      adjacentOperators: [opBetween],
    };

    const newOperands = [...group.operands];
    newOperands.splice(idx, 2, newSubGroup);

    const newAdjOps = [...group.adjacentOperators];
    newAdjOps.splice(idx, 1);

    onUpdate({
      operands: newOperands,
      adjacentOperators: newAdjOps
    });
  };

  const handleUngroupQueries = (idx: number) => {
    if (!group) return;

    const operand = group.operands[idx];
    if (!("adjacentOperators" in operand)) return;

    const subGroup = operand as Group;
    const left = subGroup.operands[0];
    const right = subGroup.operands[1];
    const opBetween = subGroup.adjacentOperators[0];

    const newOperands = [...group.operands];
    newOperands.splice(idx, 1, left, right);

    const newAdjOps = [...group.adjacentOperators];
    newAdjOps.splice(idx, 0, opBetween);

    onUpdate({
      operands: newOperands,
      adjacentOperators: newAdjOps
    });
  };

  const handleDeleteFilter = (idx: number) => {
    if (!group) return;

    const newOperands = [...group.operands];
    newOperands.splice(idx, 1);

    const newAdjOps = [...group.adjacentOperators];
    newAdjOps.splice(idx, 1);

    if (level > 0 && newOperands.length === 1) {
      onDelete();
      return;
    }

    onUpdate({
      operands: newOperands,
      adjacentOperators: newAdjOps
    });
  };

  const renderFilterText = (filter: SearchFilter): string => {
    if (BOOLEAN_STRATEGIES.has(filter.strategy)) {
      return `${filter.label || filter.strategy} IS TRUE`;
    }
    return `${filter.label || filter.strategy} = "${filter.query}"`;
  };

  const renderGroup = (groupToRender: Group, idx: number) => {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="bg-blue-50 px-3 py-1 rounded border border-blue-200">
          {`(${groupToRender.operands
            .map((op, i) =>
              "adjacentOperators" in op
                ? `(${op.operands
                    .map((child) =>
                      renderFilterText(child as SearchFilter)
                    )
                    .join(` ${op.adjacentOperators[0]} `)})`
                : renderFilterText(op)
            )
            .join(` ${groupToRender.adjacentOperators[0]} `)})`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteFilter(idx)}
          className="h-auto p-1 hover:bg-red-50"
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
        {level === 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUngroupQueries(idx)}
            className="h-auto px-2 py-1"
          >
            Ungroup
          </Button>
        )}
      </span>
    );
  };

  if (!group) return null;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg font-mono text-sm">
      <div className="flex flex-wrap items-center gap-3">
        {group.operands.map((operand, idx) => (
          <span key={idx} className="inline-flex items-center gap-3">
            {/* Show operator toggle only at root level */}
            {level === 0 && idx > 0 && (
              <Button
                variant="outline"
                size="sm"
                className={`font-medium min-w-[50px] px-3 py-1 h-auto bg-gray-100 ${
                  group.adjacentOperators[idx - 1] === "AND"
                    ? "text-green-700 hover:bg-green-100"
                    : "text-orange-700 hover:bg-orange-100"
                }`}
                onClick={() => handleOperatorToggle(idx - 1)}
              >
                {group.adjacentOperators[idx - 1]}
              </Button>
            )}

            {/* Render the operand */}
            {"adjacentOperators" in operand ? (
              renderGroup(operand, idx)
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded text-gray-900">
                  {renderFilterText(operand)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFilter(idx)}
                  className="h-auto p-1 hover:bg-red-50"
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </span>
            )}

            {/* Show group button only at root level and only between two individual terms */}
            {level === 0 && 
             idx < group.operands.length - 1 && 
             !("adjacentOperators" in group.operands[idx]) &&
             !("adjacentOperators" in group.operands[idx + 1]) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGroupQueries(idx)}
                className="h-auto px-2 py-1"
              >
                Group
              </Button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;