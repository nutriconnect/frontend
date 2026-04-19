// frontend/lib/chat.ts
import useSWR from 'swr';
import { api } from './api';
import type { ChatMessage, Conversation, UploadAttachmentResponse } from './types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080';

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getConversations(): Promise<{ conversations: Conversation[] }> {
  return api.get('/chat/conversations');
}

export async function getChatHistory(
  relationshipId: string,
  limit = 50,
  before?: string,
): Promise<{ messages: ChatMessage[]; has_more: boolean }> {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (before) params.append('before', before);
  return api.get(`/chat/${relationshipId}/messages?${params}`);
}

export async function uploadChatAttachment(
  relationshipId: string,
  file: File,
): Promise<UploadAttachmentResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/${relationshipId}/upload`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Upload failed');
  }

  return res.json();
}

export async function sendChatMessage(
  relationshipId: string,
  data: {
    message_text?: string;
    attachment_url?: string;
    attachment_filename?: string;
    attachment_size_bytes?: number;
    attachment_content_type?: string;
  },
): Promise<{ message: ChatMessage }> {
  return api.post(`/chat/${relationshipId}/send`, data);
}

export async function markMessagesAsRead(
  relationshipId: string,
  lastReadMessageId: string,
): Promise<void> {
  return api.put(`/chat/${relationshipId}/read`, {
    last_read_message_id: lastReadMessageId,
  });
}

// ─── SWR Hooks ────────────────────────────────────────────────────────────────

export function useConversations() {
  const { data, error, mutate } = useSWR('/chat/conversations', getConversations);

  return {
    conversations: data?.conversations || [],
    isLoading: !error && !data,
    error,
    mutate,
  };
}

export function useChatMessages(relationshipId: string | null) {
  const { data, error, mutate } = useSWR(
    relationshipId ? `/chat/${relationshipId}/messages` : null,
    () => getChatHistory(relationshipId!, 50),
  );

  return {
    messages: data?.messages || [],
    hasMore: data?.has_more || false,
    isLoading: !error && !data,
    error,
    mutate,
  };
}
