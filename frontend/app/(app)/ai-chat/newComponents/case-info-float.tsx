interface CaseInfoFloatProps {
  serialNumber: string;
  name?: string;
}

export function CaseInfoFloat({ serialNumber, name }: CaseInfoFloatProps) {
  return (
    <div className="fixed left-8 top-24 bg-white/95 dark:bg-gray-800/95 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 w-64">
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Serial Number
        </div>
        <div className="font-semibold">
          {serialNumber}
        </div>
        {name && (
          <>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
              Case Name
            </div>
            <div className="font-semibold">
              {name}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 