import React from "react";
import { Wrench } from "lucide-react";

const WorkInProgress = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6 flex justify-center">
          <Wrench className="h-16 w-16 text-blue-500 dark:text-blue-400 animate-bounce" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Work in Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          We&apos;re currently working on something awesome. Check back soon!
        </p>
        <div className="animate-pulse bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
          <p className="text-blue-600 dark:text-blue-300">
            Expected completion: Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgress;
