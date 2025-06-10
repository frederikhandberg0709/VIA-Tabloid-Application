"use client";
import { Department, DEPARTMENT_LABELS } from "@/types/story";

interface DepartmentTabsProps {
  activeTab: Department | "ALL";
  onTabChange: (tab: Department | "ALL") => void;
  storyCounts?: Record<Department | "ALL", number>;
}

export default function DepartmentTabs({
  activeTab,
  onTabChange,
  storyCounts,
}: DepartmentTabsProps) {
  const tabs = [
    { key: "ALL", label: "All Stories" },
    ...Object.entries(DEPARTMENT_LABELS).map(([key, label]) => ({
      key: key as Department,
      label,
    })),
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(({ key, label }) => {
          const isActive = activeTab === key;
          const count = storyCounts?.[key as Department | "ALL"] || 0;

          return (
            <button
              key={key}
              onClick={() => onTabChange(key as Department | "ALL")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                isActive
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
