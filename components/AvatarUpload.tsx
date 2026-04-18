'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { uploadAvatar, deleteAvatar } from '@/lib/avatar';
import { Avatar } from './Avatar';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  displayName: string;
  onUploadSuccess: (url: string) => void;
  onDeleteSuccess: () => void;
}

export function AvatarUpload({
  currentAvatarUrl,
  displayName,
  onUploadSuccess,
  onDeleteSuccess,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, PNG, and GIF images are supported');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const result = await uploadAvatar(file);
      setPreview(null);
      onUploadSuccess(result.avatar_url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Remove your profile photo?')) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteAvatar();
      onDeleteSuccess();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-6">
      <Avatar
        avatarUrl={preview || currentAvatarUrl}
        displayName={displayName}
        size="large"
      />

      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-[#4a7c59] text-white rounded hover:bg-[#3d6548] disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : currentAvatarUrl ? 'Change photo' : 'Upload photo'}
        </button>

        {currentAvatarUrl && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm text-[#8b7355] hover:text-[#6b5535] disabled:opacity-50"
          >
            {deleting ? 'Removing...' : 'Remove photo'}
          </button>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <p className="text-xs text-[#8b7355]">
          JPG, PNG or GIF. Max 10MB.
        </p>
      </div>
    </div>
  );
}
