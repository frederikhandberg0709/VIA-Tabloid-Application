"use client";

import { Department, DEPARTMENT_LABELS, Story } from "@/types/story";
import { useEffect, useState } from "react";

interface StoryFormProps {
  story?: Story;
  onSubmit: (story: Omit<Story, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function StoryForm({
  story,
  onSubmit,
  onCancel,
  isLoading,
}: StoryFormProps) {
  const [formData, setFormData] = useState({
    headline: "",
    content: "",
    department: Department.ENGINEERING,
  });

  useEffect(() => {
    if (story) {
      setFormData({
        headline: story.headline,
        content: story.content,
        department: story.department,
      });
    }
  }, [story]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="headline"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Headline *
        </label>
        <input
          type="text"
          id="headline"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          required
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter a sensational headline..."
        />
      </div>

      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Department *
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.entries(DEPARTMENT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Story Content *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us the sensational story..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : story ? "Update Story" : "Create Story"}
        </button>
      </div>
    </form>
  );
}
