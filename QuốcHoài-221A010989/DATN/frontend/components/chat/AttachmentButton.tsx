'use client';

import React, { useRef } from 'react';
import { Paperclip, Image as ImageIcon } from 'lucide-react';

export interface AttachmentButtonProps {
  onAttach: (attachment: { type: 'image' | 'file'; url: string; name: string }) => void;
}

export function AttachmentButton({ onAttach }: AttachmentButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const fakeUrl = isImage
      ? URL.createObjectURL(file)
      : 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop';

    onAttach({
      type: isImage ? 'image' : 'file',
      url: fakeUrl,
      name: file.name,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-xl text-foreground/50 hover:text-primary hover:bg-secondary transition-colors"
        title="Đính kèm tệp / ảnh"
      >
        <Paperclip className="w-4 h-4" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
