'use client';

import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    country: string;
    category: string;
    description: string;
    image: string;
    rating: number;
    ratingCount: number;
    views: number;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
    >
      {/* Image */}
      <div className="bg-gradient-to-br from-primary-light to-secondary-light p-8 flex items-center justify-center h-40">
        <span className="text-5xl">{project.image}</span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-dark">{project.name}</h3>
          <span className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full">
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <span>📍 {project.country}</span>
          <span>•</span>
          <span>👁 {project.views.toLocaleString()}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <span className="text-yellow-400">⭐ {project.rating}</span>
          <span className="text-xs text-gray-500">
            ({project.ratingCount} تقييم)
          </span>
        </div>

        {/* Action Button */}
        <Link
          href={`/projects/${project.id}`}
          className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-center block"
        >
          عرض التفاصيل
        </Link>
      </div>
    </motion.div>
  );
}
