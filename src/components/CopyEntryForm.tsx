"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import type { Database } from '@/lib/database.types';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

type CopyEntry = Database['public']['Tables']['copy_entries']['Row'];
// Omit fields that are auto-generated or not edited in the form
type CopyEntryFormData = Omit<CopyEntry, 'id' | 'created_at' | 'updated_at' | 'serial_number'>;

interface CopyEntryFormProps {
  initialData: Partial<CopyEntry> | null; // null for create, existing data for edit
  onSubmit: (formData: CopyEntryFormData, files: File[], imagesToDelete: string[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Helper to get public URL for preview (adjust bucket name and logic if needed)
function getPreviewUrl(path: string): string | null {
  if (!path) return null;
  // Assuming paths are like 'key-visuals/image.jpg' and bucket is public
  // Or if you have signed URLs already, they should work directly
  if (path.startsWith('http')) return path; // If already a full URL (e.g., signed URL)
  
  // Construct public URL if path is just the bucket path
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucketName = 'key-visuals'; // Make sure this matches
  if (supabaseUrl && path.startsWith(bucketName + '/')) {
      return `${supabaseUrl}/storage/v1/object/public/${path}`;
  }
  // Fallback or handle other cases
  return null; 
}

export default function CopyEntryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CopyEntryFormProps) {
  const [formData, setFormData] = useState<Partial<CopyEntryFormData>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImagePaths, setExistingImagePaths] = useState<string[]>([]); // For edit mode
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // Track paths to delete
  const [previews, setPreviews] = useState<string[]>([]); // For new file previews
  const [serialNumber, setSerialNumber] = useState<number | null>(null); // serial_number 用 state

  useEffect(() => {
    // Initialize form with initialData or defaults
    const dataToEdit: Partial<CopyEntryFormData> = {
      headline: initialData?.headline ?? '',
      explanation: initialData?.explanation ?? '',
      copy_text: initialData?.copy_text ?? '',
      advertiser: initialData?.advertiser ?? '',
      copywriter: initialData?.copywriter ?? '',
      year_created: initialData?.year_created ?? null,
      awards: initialData?.awards ?? '',
      tags: initialData?.tags ?? [],
      source: initialData?.source ?? '',
      publish_at: initialData?.publish_at ? initialData.publish_at.split('T')[0] : null,
      status: initialData?.status ?? 'draft',
      key_visual_urls: initialData?.key_visual_urls ?? [],
      youtube_url: initialData?.youtube_url ?? '',
      industry_tags: initialData?.industry_tags ?? [],
      category_tags: initialData?.category_tags ?? [],
    };
    setFormData(dataToEdit);
    setExistingImagePaths(initialData?.key_visual_urls?.filter(Boolean) ?? []);
    setImagesToDelete([]); // Reset images to delete
    setSelectedFiles([]); // Clear file input on initial load/change
    setPreviews([]); // Clear previews
    setSerialNumber(initialData?.serial_number ?? null); // 初期データをセット
  }, [initialData]);

  // Generate previews for selected files
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }
    const objectUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // Free memory when the component is unmounted
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (type === 'number') {
      processedValue = value === '' ? null : parseInt(value, 10);
    }
    if (name === 'tags' || name === 'industry_tags' || name === 'category_tags') {
      processedValue = value.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    if (type === 'date' && value === '') {
        processedValue = null;
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Handle marking existing images for deletion
  const handleImageDeleteToggle = (path: string) => {
    setImagesToDelete(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit: CopyEntryFormData = {
        // Ensure all required fields are present or have defaults
        headline: formData.headline || 'Untitled', 
        explanation: formData.explanation || '',
        copy_text: formData.copy_text || '',
        advertiser: formData.advertiser || '',
        copywriter: formData.copywriter || null,
        year_created: formData.year_created || null,
        awards: formData.awards || null,
        tags: formData.tags || [],
        source: formData.source || null,
        publish_at: formData.publish_at ? new Date(formData.publish_at).toISOString() : null,
        status: formData.status || 'draft',
        key_visual_urls: [], // Placeholder, set in onSubmit
        youtube_url: formData.youtube_url || null,
        industry_tags: formData.industry_tags || [],
        category_tags: formData.category_tags || [],
    };
    await onSubmit(dataToSubmit, selectedFiles, imagesToDelete);
  };

  // Basic form structure - needs styling and more fields
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded bg-gray-50 shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{initialData?.id ? 'コピー編集' : 'コピー新規追加'}</h2>

      {/* Serial Number (Read Only) */}
      <div>
        <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">
          Vol. No. (自動採番)
        </label>
        <input
          type="number"
          id="serial_number"
          name="serial_number"
          value={serialNumber ?? ''}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Text Fields */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700">Headline <span className="text-red-500">*</span></label>
            <input type="text" id="headline" name="headline" value={formData.headline || ''} onChange={handleChange} className="mt-1 input-field" required />
          </div>
          <div>
            <label htmlFor="copy_text" className="block text-sm font-medium text-gray-700">Copy Text</label>
            <input type="text" id="copy_text" name="copy_text" value={formData.copy_text || ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
           <div>
            <label htmlFor="advertiser" className="block text-sm font-medium text-gray-700">Advertiser</label>
            <input type="text" id="advertiser" name="advertiser" value={formData.advertiser || ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label htmlFor="copywriter" className="block text-sm font-medium text-gray-700">Copywriter</label>
            <input type="text" id="copywriter" name="copywriter" value={formData.copywriter || ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
           <div>
            <label htmlFor="year_created" className="block text-sm font-medium text-gray-700">Year Created</label>
            <input type="number" id="year_created" name="year_created" value={formData.year_created ?? ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label htmlFor="awards" className="block text-sm font-medium text-gray-700">Awards</label>
            <input type="text" id="awards" name="awards" value={formData.awards || ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
           <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (カンマ区切り)</label>
            <input type="text" id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
           <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
            <input type="text" id="source" name="source" value={typeof formData.source === 'string' ? formData.source : ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label htmlFor="publish_at" className="block text-sm font-medium text-gray-700">Publish Date</label>
            <input type="date" id="publish_at" name="publish_at" value={formData.publish_at || ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
           <div>
             <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
             <select id="status" name="status" value={formData.status || 'draft'} onChange={handleChange} className="mt-1 input-field" >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700">YouTube動画URL（任意）</label>
            <input type="text" id="youtube_url" name="youtube_url" value={formData.youtube_url || ''} onChange={handleChange} className="mt-1 input-field" placeholder="https://www.youtube.com/watch?v=..." />
          </div>
          <div>
            <label htmlFor="industry_tags" className="block text-sm font-medium text-gray-700">業種タグ (カンマ区切り)</label>
            <input type="text" id="industry_tags" name="industry_tags" value={Array.isArray(formData.industry_tags) ? formData.industry_tags.join(', ') : ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label htmlFor="category_tags" className="block text-sm font-medium text-gray-700">カテゴリタグ (カンマ区切り)</label>
            <input type="text" id="category_tags" name="category_tags" value={Array.isArray(formData.category_tags) ? formData.category_tags.join(', ') : ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
      </div>

      {/* Text Areas */} 
      <div className="space-y-4">
          <div>
            <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">Explanation</label>
            <textarea id="explanation" name="explanation" rows={5} value={formData.explanation || ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
      </div>
      
      {/* --- Image Management --- */}
      <div className="mt-6 pt-6 border-t">
        <label className="block text-sm font-medium text-gray-700 mb-2">キービジュアル管理</label>
        
        {/* Existing Images */} 
        {existingImagePaths.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">既存の画像 (削除するにはチェック):</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingImagePaths.map((path) => {
                const previewUrl = getPreviewUrl(path);
                const isMarkedForDeletion = imagesToDelete.includes(path);
                return (
                  <div key={path} className={`relative border rounded-lg overflow-hidden ${isMarkedForDeletion ? 'opacity-50 border-red-400' : ''}`}>
                    {previewUrl ? (
                       <img src={previewUrl} alt="Existing visual" className="w-full h-24 object-cover" />
                    ): (
                       <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500">プレビュー不可</div>
                    )}
                    <div className="absolute top-1 right-1">
                      <input 
                        type="checkbox"
                        checked={isMarkedForDeletion}
                        onChange={() => handleImageDeleteToggle(path)}
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        title="削除する"
                      />
                    </div>
                     <p className="text-[10px] p-1 truncate text-gray-500" title={path}>{path.split('/').pop()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload New Images */} 
        <div className="mb-4">
             <label htmlFor="imageUpload" className="block text-xs font-medium text-gray-600 mb-1">新しい画像を追加 (複数可):</label>
            <input
              id="imageUpload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* New Image Previews */} 
         {previews.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">新規追加プレビュー:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((previewUrl, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <img src={previewUrl} alt={`New visual preview ${index + 1}`} className="w-full h-24 object-cover" />
                  <p className="text-[10px] p-1 truncate text-gray-500" title={selectedFiles[index]?.name}>{selectedFiles[index]?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* --- End Image Management --- */}

      {/* Action Buttons */} 
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary" > キャンセル </button>
        <button type="submit" disabled={isLoading} className="btn-primary" >
          {isLoading ? '保存中...' : (initialData?.id ? '更新' : '追加')}
        </button>
      </div>
       {/* Add this to your globals.css or a style tag if not already defined */} 
       <style jsx global>{`
        .input-field {
          display: block;
          width: 100%;
          border-radius: 0.375rem; /* rounded-md */
          border: 1px solid #d1d5db; /* border-gray-300 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          padding: 0.5rem 0.75rem; /* py-2 px-3 */
          font-size: 0.875rem; /* sm:text-sm */
          line-height: 1.25rem;
        }
        .input-field:focus {
          border-color: #6366f1; /* focus:border-indigo-500 */
          outline: 2px solid transparent;
          outline-offset: 2px;
           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); /* focus:ring-indigo-500 focus:ring-opacity-50 */
        }
        .btn-primary {
            display: inline-flex; justify-content: center; padding: 0.5rem 1rem; border: 1px solid transparent; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; line-height: 1.25rem; font-medium: 600; border-radius: 0.375rem; color: white; background-color: #4f46e5; /* bg-indigo-600 */
        }
        .btn-primary:hover { background-color: #4338ca; /* hover:bg-indigo-700 */ }
        .btn-primary:focus { outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary {
           display: inline-flex; justify-content: center; padding: 0.5rem 1rem; border: 1px solid #d1d5db; /* border-gray-300 */ box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; line-height: 1.25rem; font-medium: 600; border-radius: 0.375rem; color: #374151; /* text-gray-700 */ background-color: white;
        }
         .btn-secondary:hover { background-color: #f9fafb; /* hover:bg-gray-50 */ }
        .btn-secondary:focus { outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); }
         .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </form>
  );
} 