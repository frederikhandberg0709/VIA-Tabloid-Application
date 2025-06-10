"use client";

import { DEPARTMENT_LABELS, Story } from "@/types/story";

interface StoryCardProps {
  story: Story;
  onEdit?: (story: Story) => void;
  onDelete?: (id: number) => void;
}

export default function StoryCard({ story, onEdit, onDelete }: StoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {DEPARTMENT_LABELS[story.department]}
        </span>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(story)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
          )}
          {onDelete && story.id && (
            <button
              onClick={() => onDelete(story.id!)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
        {story.headline}
      </h3>

      <p className="text-gray-700 mb-4 line-clamp-3">{story.content}</p>

      {story.createdAt && (
        <div className="text-sm text-gray-500">
          {formatDate(story.createdAt)}
        </div>
      )}
    </div>
  );
}
