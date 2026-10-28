import React, { useState } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import CreateGroupModal from '../components/chat/CreateGroupModal';
import CreateAnnouncementModal from '../components/chat/CreateAnnouncementModal';
import NewDirectModal from '../components/chat/NewDirectModal';
import { SocketProvider } from '../context/SocketContext';
import { CallProvider } from '../context/CallContext';
import CallModal from '../components/calls/CallModal';

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [showNewDirect, setShowNewDirect] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);

  const handleRoomCreated = (room) => {
    setActiveRoom(room);
  };

  return (
    <SocketProvider>
      <CallProvider>
        <div className="-mx-3 flex h-[calc(100vh-7rem)] min-h-[24rem] overflow-hidden rounded-xl border border-gray-200 shadow-lg sm:-mx-6 sm:h-[calc(100vh-8rem)] lg:-mx-8">
          <ChatSidebar
            activeRoom={activeRoom}
            onSelectRoom={(room) => setActiveRoom(room)}
            onNewDirect={() => setShowNewDirect(true)}
            onCreateGroup={() => setShowNewGroup(true)}
            onCreateAnnouncement={() => setShowNewAnnouncement(true)}
          />
          <ChatWindow room={activeRoom} onBack={() => setActiveRoom(null)} />
        </div>
        <CallModal />
      </CallProvider>

      {showNewDirect && (
        <NewDirectModal
          onClose={() => setShowNewDirect(false)}
          onCreated={handleRoomCreated}
        />
      )}

      {showNewGroup && (
        <CreateGroupModal
          onClose={() => setShowNewGroup(false)}
          onCreated={handleRoomCreated}
        />
      )}

      {showNewAnnouncement && (
        <CreateAnnouncementModal
          onClose={() => setShowNewAnnouncement(false)}
          onCreated={handleRoomCreated}
        />
      )}
    </SocketProvider>
  );
};

export default Chat;
