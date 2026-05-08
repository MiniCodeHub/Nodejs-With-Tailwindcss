import { useState } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
}

export default function App() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Message',
      message: 'You received a new message from Alex.',
      read: false,
    },
    {
      id: 2,
      title: 'Project Updated',
      message: 'Dashboard UI has been updated.',
      read: false,
    },
    {
      id: 3,
      title: 'Payment Successful',
      message: 'Your subscription payment was completed.',
      read: true,
    },
  ]);

  // Mark single notification as read
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      
      <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Notifications
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              {unreadCount} unread notification
              {unreadCount !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
          >
            Mark All Read
          </button>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`p-5 cursor-pointer transition ${
                notification.read
                  ? 'bg-gray-800'
                  : 'bg-gray-700/60 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                
                <div>
                  <h2 className="text-white font-semibold">
                    {notification.title}
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    {notification.message}
                  </p>
                </div>

                {/* Unread Dot */}
                {!notification.read && (
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}