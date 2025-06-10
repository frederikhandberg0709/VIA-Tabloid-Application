"use client";

import DepartmentTabs from "@/components/DepartmentTabs";
import StoryCard from "@/components/StoryCard";
import StoryForm from "@/components/StoryForm";
import {
  useCreateStory,
  useDeleteStory,
  useSearchStories,
  useStories,
  useUpdateStory,
} from "@/hooks/useStories";
import { Department } from "@/types/story";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Department | "ALL">("ALL");
  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingStory, setEditingStory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allStories = [], isLoading, error } = useStories();
  const { data: searchResults = [] } = useSearchStories(searchQuery);
  const createStoryMutation = useCreateStory();
  const updateStoryMutation = useUpdateStory();
  const deleteStoryMutation = useDeleteStory();

  const stories = searchQuery ? searchResults : allStories;
  const filteredStories =
    activeTab === "ALL"
      ? stories
      : stories.filter((story) => story.department === activeTab);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateStory = async (storyData: any) => {
    try {
      await createStoryMutation.mutateAsync(storyData);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateStory = async (storyData: any) => {
    if (!editingStory?.id) return;

    try {
      await updateStoryMutation.mutateAsync({
        id: editingStory.id,
        story: storyData,
      });
      setEditingStory(null);
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  const handleDeleteStory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      await deleteStoryMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab("ALL");
  };

  const getStoryCounts = () => {
    const counts: Record<Department | "ALL", number> = {
      ALL: stories.length,
      ENGINEERING: 0,
      BUSINESS: 0,
      DESIGN: 0,
      HEALTH: 0,
    };

    stories.forEach((story) => {
      counts[story.department]++;
    });

    return counts;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Stories
          </h1>
          <p className="text-gray-600">
            Please check if the backend is running on port 8080
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VIA Tabloid</h1>
              <p className="text-gray-600">
                Sensational stories from VIA departments
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Add New Story
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Department tabs */}
        <div className="mb-6">
          <DepartmentTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            storyCounts={getStoryCounts()}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onEdit={setEditingStory}
                  onDelete={handleDeleteStory}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery
                    ? "No stories found matching your search."
                    : "No stories yet. Create the first one!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal to create story */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Story</h2>
            <StoryForm
              onSubmit={handleCreateStory}
              onCancel={() => setShowForm(false)}
              isLoading={createStoryMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Modal to edit story */}
      {editingStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Story</h2>
            <StoryForm
              story={editingStory}
              onSubmit={handleUpdateStory}
              onCancel={() => setEditingStory(null)}
              isLoading={updateStoryMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
