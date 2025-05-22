"use client";

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';
import CopyEntryForm from '@/components/CopyEntryForm'; // Import the form component
import { v4 as uuidv4 } from 'uuid'; // For unique file names

type CopyEntry = Database['public']['Tables']['copy_entries']['Row'];
// Omit fields that are auto-generated or not edited in the form
type CopyEntryFormData = Omit<CopyEntry, 'id' | 'created_at' | 'updated_at' | 'serial_number'>;

// Assume storage bucket name
const IMAGE_BUCKET_NAME = 'key-visuals';

export default function CopyEntriesAdminPage() {
  const [entries, setEntries] = useState<CopyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CopyEntry | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('copy_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('データの取得に失敗しました: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // --- Form Handling --- 
  const handleAdd = () => {
    setEditingEntry(null); // Ensure it's a new entry
    setShowForm(true);
    setFormError(null);
  };

  const handleEdit = (entry: CopyEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
    setFormError(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEntry(null);
    setFormError(null);
  };

  // --- Main Submit Logic (Handles Create/Update and Image Upload) ---
  const handleSubmitForm = async (
    formData: CopyEntryFormData,
    files: File[],
    imagesToDelete: string[]
  ) => {
    setFormLoading(true);
    setFormError(null);
    let uploadedImagePaths: string[] = [];

    try {
      // --- 1. Remove images marked for deletion --- 
      if (imagesToDelete.length > 0 && editingEntry) {
          // Storage expects file names/paths within the bucket
          const fileNamesToDelete = imagesToDelete.map(path => path.replace(`${IMAGE_BUCKET_NAME}/`, ''));
          const { error: removeError } = await supabase.storage
              .from(IMAGE_BUCKET_NAME)
              .remove(fileNamesToDelete);
          if (removeError) {
            console.error('Error removing images:', removeError); // Log error
          }
      }

      // --- 2. Upload new images --- 
      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const uniqueFileName = `${uuidv4()}.${fileExt}`;
          const filePath = `${IMAGE_BUCKET_NAME}/${uniqueFileName}`; // Path within the bucket

          const { error: uploadError } = await supabase.storage
            .from(IMAGE_BUCKET_NAME)
            .upload(uniqueFileName, file); // Upload with unique name

          if (uploadError) {
             throw new Error(`画像アップロード失敗: ${uploadError.message}`);
          }
          // Return the path stored in the DB (bucket name + file name)
          return filePath;
        });
        uploadedImagePaths = await Promise.all(uploadPromises);
      }
      
      // --- 3. Prepare final image paths for DB --- 
      // Start with existing paths, filter out those marked for deletion, then add newly uploaded paths
      const existingPathsToKeep = (editingEntry?.key_visual_urls ?? []).filter(
          path => !imagesToDelete.includes(path)
      );
      const finalImagePaths = [...existingPathsToKeep, ...uploadedImagePaths];

      const dataToSave: Omit<CopyEntry, 'id' | 'created_at' | 'serial_number'> & { id?: string } = {
          ...formData,
          key_visual_urls: finalImagePaths, // Use the updated list
          updated_at: new Date().toISOString(), 
      };

      // --- 4. Save to DB (Insert or Update) ---
      if (editingEntry) {
        // Update
         const { error: updateError } = await supabase
           .from('copy_entries')
           .update(dataToSave)
           .eq('id', editingEntry.id);
        if (updateError) throw updateError;

      } else {
        // Insert
         const { error: insertError } = await supabase
            .from('copy_entries')
            .insert(dataToSave);
          if (insertError) throw insertError;
      }
      
      // --- 5. Success: Close form, refetch data ---
      setShowForm(false);
      setEditingEntry(null);
      await fetchEntries(); // Refresh the list

    } catch (err) {
        setFormError(`保存に失敗しました: ${(err instanceof Error ? err.message : String(err))}`);
        // Optional: Attempt to remove successfully uploaded images if DB save fails
        if (uploadedImagePaths.length > 0) {
            // Storage expects file names/paths within the bucket
            const fileNamesToRemove = uploadedImagePaths.map(path => path.replace(`${IMAGE_BUCKET_NAME}/`, ''));
            const { error: removeError } = await supabase.storage.from(IMAGE_BUCKET_NAME).remove(fileNamesToRemove);
             if (removeError) {
                setFormError((prev) => prev + ' \n新規画像クリーンアップ失敗');
            }
        }
    } finally {
        setFormLoading(false);
    }
};


  // --- Delete Logic (Placeholder - needs implementation) ---
  const handleDelete = async (entry: CopyEntry) => {
    if (window.confirm(`ID: ${entry.id.substring(0,8)}... (${entry.headline}) を削除しますか？画像も削除されます。`)) {
      setLoading(true); // Indicate loading during delete
      setError(null);
      try {
        // 1. Delete from DB
        const { error: dbError } = await supabase
          .from('copy_entries')
          .delete()
          .eq('id', entry.id);
        if (dbError) throw dbError;

        // 2. Delete images from Storage
        const imagePathsToRemove = entry.key_visual_urls?.filter(Boolean) ?? [];
        if (imagePathsToRemove.length > 0) {
           // Important: storage.remove expects only the file names/paths within the bucket
           const fileNamesToRemove = imagePathsToRemove.map(path => path.replace(`${IMAGE_BUCKET_NAME}/`, ''));
           const { error: storageError } = await supabase.storage
             .from(IMAGE_BUCKET_NAME)
             .remove(fileNamesToRemove);
           if (storageError) {
             console.error('Error deleting images from storage during entry deletion:', storageError); // Log error or handle differently
           }
        }
        
        await fetchEntries(); // Refresh list
      } catch (err) {
          setError(`削除に失敗しました: ${(err instanceof Error ? err.message : String(err))}`);
      } finally {
          setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">コピー管理</h1>

      {/* Form Modal/Section */} 
      {showForm && (
        <div className="mb-6">
          <CopyEntryForm
            initialData={editingEntry}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            isLoading={formLoading}
          />
          {formError && <p className="text-red-500 mt-2">{formError}</p>}
        </div>
      )}

      {!showForm && (
          <div className="mb-4">
            <button
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading} // Disable while loading initial list
            >
              新規追加
            </button>
          </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Entry List Table */} 
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="w-full bg-gray-100 border-b">
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Headline</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">作成日時</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vol.</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="py-2 px-3 whitespace-nowrap text-sm text-gray-500">{entry.id.substring(0, 8)}...</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{entry.headline || 'N/A'}</td>
                    <td className="py-2 px-3 whitespace-nowrap text-sm text-gray-500">
                      {entry.created_at
                        ? new Date(entry.created_at).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-sm text-gray-500">{entry.serial_number ?? '-'}</td>
                    <td className="py-2 px-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        disabled={showForm} // Disable while form is open
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(entry)}
                        className="text-red-600 hover:text-red-900"
                        disabled={showForm} // Disable while form is open
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 px-3 text-center text-gray-500">データがありません</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 