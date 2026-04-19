// frontend/app/dashboard/messages/components/MessageBubble.tsx
'use client';

import type { ChatMessage } from '@/lib/types';
import { format, isToday, isYesterday } from 'date-fns';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return `Ayer ${format(date, 'HH:mm')}`;
    return format(date, 'dd/MM HH:mm');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        marginBottom: 12,
        gap: 8,
      }}
    >
      {!isOwnMessage && message.sender_avatar_url && (
        <img
          src={message.sender_avatar_url}
          alt={message.sender_name}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      )}

      <div
        style={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
        }}
      >
        {!isOwnMessage && (
          <div style={{ fontSize: 11, color: 'var(--nc-stone)', marginBottom: 4 }}>
            {message.sender_name}
          </div>
        )}

        <div
          style={{
            background: isOwnMessage ? 'var(--nc-forest)' : 'white',
            color: isOwnMessage ? 'white' : 'var(--nc-ink)',
            border: isOwnMessage ? 'none' : '1px solid var(--nc-border)',
            borderRadius: 12,
            padding: '10px 14px',
          }}
        >
          {message.message_text && (
            <div style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {message.message_text}
            </div>
          )}

          {message.attachment_url && (
            <div style={{ marginTop: message.message_text ? 8 : 0 }}>
              {message.attachment_content_type?.startsWith('image/') ? (
                <img
                  src={message.attachment_url}
                  alt={message.attachment_filename || 'Attachment'}
                  style={{
                    maxWidth: 300,
                    maxHeight: 300,
                    borderRadius: 8,
                    display: 'block',
                  }}
                />
              ) : (
                <a
                  href={message.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: isOwnMessage ? 'white' : 'var(--nc-terra)',
                    textDecoration: 'underline',
                    fontSize: 13,
                  }}
                >
                  📄 {message.attachment_filename || 'Download file'}
                </a>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: 10,
            color: 'var(--nc-stone)',
            marginTop: 4,
          }}
        >
          {formatTimestamp(message.created_at)}
        </div>
      </div>
    </div>
  );
}
