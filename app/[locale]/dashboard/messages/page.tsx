// frontend/app/dashboard/messages/page.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useConversations } from '@/lib/chat';
import { ConversationsList } from './components/ConversationsList';
import { ChatThread } from './components/ChatThread';

export default function MessagesPage() {
  const t = useTranslations('dashboard.messages');
  const [activeRelationshipId, setActiveRelationshipId] = useState<string | null>(null);
  const { conversations } = useConversations();

  const activeConversation = conversations.find(
    (c) => c.relationship_id === activeRelationshipId
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="dash-topbar">
        <div className="dash-topbar-title">{t('title')}</div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Conversations Sidebar */}
        <div
          style={{
            borderRight: '1px solid var(--nc-border)',
            background: 'white',
            overflowY: 'auto',
            height: '100%',
          }}
        >
          <ConversationsList
            activeRelationshipId={activeRelationshipId}
            onSelectConversation={setActiveRelationshipId}
          />
        </div>

        {/* Chat Thread */}
        <div style={{ background: '#FAFAF9', height: '100%', overflow: 'hidden' }}>
          {activeConversation ? (
            <ChatThread
              relationshipId={activeConversation.relationship_id}
              otherUserName={activeConversation.other_user_name}
              otherUserAvatar={activeConversation.other_avatar_url}
              otherUserId={activeConversation.other_user_id}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--nc-stone)',
                fontSize: 14,
              }}
            >
              {t('select_conversation')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
