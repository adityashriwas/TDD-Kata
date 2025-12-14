"use client";
export default function Textarea({ className = '', ...props }) {
  return (
    <textarea className={`min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${className}`} {...props} />
  );
}
