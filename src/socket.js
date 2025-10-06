import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

console.log('Attempting to connect to socket server:', SOCKET_URL);

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true,
  autoConnect: true,
});

// Add connection debugging
socket.on('connect', () => {
  console.log('✅ Socket connected successfully!');
  console.log('Socket ID:', socket.id);
  console.log('Connected to:', socket.io.engine.transport.name);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error);
  console.error('Error details:', {
    message: error.message,
    description: error.description,
    context: error.context,
    type: error.type
  });
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection failed:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Socket reconnection failed permanently');
});

// Browser Notification System
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('🚫 Browser does not support notifications.');
    return false;
  }

  let permission = Notification.permission;

  if (permission === 'default') {
    console.log('🛎️ Requesting notification permission...');
    permission = await Notification.requestPermission();
    console.log('🔔 Permission result:', permission);
  }

  if (permission === 'granted') {
    console.log('✅ Notifications enabled!');
    return true;
  } else {
    console.warn('❌ Notifications blocked. Please enable in browser settings.');
    // Optionally show an in-app banner telling user to enable notifications
    alert('Please enable browser notifications for real-time updates!');
    return false;
  }
};

const showBrowserNotification = (title, message, type = 'info') => {
  // Request permission first
  requestNotificationPermission().then((hasPermission) => {
    if (!hasPermission) {
      console.log('No notification permission, falling back to toast notification');
      showToastNotification(title, message, type);
      return;
    }

    // Show native browser notification
    const options = {
      body: message,
      icon: '/favicon.ico', // You can change this to your app icon
      badge: '/favicon.ico',
      tag: `table-notification-${Date.now()}`, // Unique tag to prevent duplicates
      requireInteraction: false,
      silent: false, // This allows the system sound to play
    };

    // Add different icons based on type
    const icons = {
      success: '🟢',
      info: '🔵',
      warning: '🟡',
      error: '🔴'
    };

    const notification = new Notification(`${icons[type] || 'ℹ️'} ${title}`, options);

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Handle click on notification
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    console.log('Browser notification shown:', title, message);
  });
};

// Toast notification system (fallback)
const showToastNotification = (title, message, type = 'info') => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
    <button class="notification-close">&times;</button>
  `;

  // Add to DOM
  const container = document.getElementById('notification-container') || createNotificationContainer();
  container.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);

  // Close button functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });

  // Play notification sound only on user interaction
  playNotificationSound(type);
};

const createNotificationContainer = () => {
  const container = document.createElement('div');
  container.id = 'notification-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
  `;
  document.body.appendChild(container);
  return container;
};

const playNotificationSound = (type) => {
  // Only play sound if user has interacted with the page
  if (typeof window !== 'undefined' && window.audioContextAllowed) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different notification types
      const frequencies = {
        success: 800,
        warning: 600,
        error: 400,
        info: 1000
      };

      oscillator.frequency.setValueAtTime(frequencies[type] || 600, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio notification not supported or not allowed');
    }
  }
};

// Initialize audio context on first user interaction
const initAudioContext = () => {
  if (typeof window !== 'undefined' && !window.audioContextAllowed) {
    window.audioContextAllowed = true;
  }
};

// Add event listeners for user interaction
if (typeof window !== 'undefined') {
  ['click', 'touchstart', 'keydown'].forEach(event => {
    window.addEventListener(event, initAudioContext, { once: true });
  });
}

// Main notification function that shows both browser and toast notifications
const showNotification = (title, message, type = 'info') => {
  // Show browser notification (with sound)
  showBrowserNotification(title, message, type);

  // Also show toast notification as backup
  showToastNotification(title, message, type);
};

// Table-specific event handlers
socket.on('tableCreated', (table) => {
  console.log('Table created:', table);
  showNotification('Table Created', `Table ${table.tableNumber} has been created`, 'success');

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('tableCreated', { detail: table }));
});

socket.on('tableDeleted', (data) => {
  console.log('Table deleted:', data);
  showNotification('Table Deleted', `Table has been removed`, 'warning');

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('tableDeleted', { detail: data }));
});

socket.on('tablesUpdated', (data) => {
  console.log('Tables updated:', data);
  showNotification('Bulk Update', `${data.tableIds.length} tables updated`, 'info');

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('tablesUpdated', { detail: data }));
});

socket.on('tablesDeleted', (data) => {
  console.log('Tables deleted:', data);
  showNotification('Bulk Delete', `${data.tableIds.length} tables deleted`, 'warning');

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('tablesDeleted', { detail: data }));
});

// Reservation-specific event handlers
socket.on('reservationCreated', (reservation) => {
  console.log('Reservation created:', reservation);
  showNotification('New Reservation', `Reservation created for ${reservation.guestInfo?.name || 'Guest'}`, 'success');

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('reservationCreated', { detail: reservation }));
});

socket.on('reservationStatusChanged', (data) => {
  console.log('Reservation status changed:', data);
  const statusMessages = {
    pending: 'Reservation is pending confirmation',
    confirmed: 'Reservation has been confirmed',
    seated: 'Guests have been seated',
    completed: 'Reservation completed',
    cancelled: 'Reservation cancelled'
  };

  showNotification(
    'Reservation Updated',
    statusMessages[data.status] || `Status changed to ${data.status}`,
    data.status === 'confirmed' ? 'success' : 'info'
  );

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('reservationStatusChanged', { detail: data }));
});

socket.on('reservationDeleted', (data) => {
  console.log('Reservation deleted:', data);
  showNotification('Reservation Deleted', 'A reservation has been cancelled', 'warning');

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('reservationDeleted', { detail: data }));
});

// Professional table status notifications with browser notifications
socket.on('tableStatusChanged', (data) => {
  console.log('Table status changed:', data);

  // Professional messages for different table statuses
  const statusMessages = {
    available: {
      message: `Table ${data.tableNumber} is now available for seating`,
      type: 'success',
      title: 'Table Available'
    },
    reserved: {
      message: `Table ${data.tableNumber} has been reserved`,
      type: 'info',
      title: 'Table Reserved'
    },
    occupied: {
      message: `Table ${data.tableNumber} is currently occupied`,
      type: 'warning',
      title: 'Table Occupied'
    },
    dirty: {
      message: `Table ${data.tableNumber} needs cleaning`,
      type: 'warning',
      title: 'Table Needs Cleaning'
    },
    maintenance: {
      message: `Table ${data.tableNumber} requires maintenance`,
      type: 'error',
      title: 'Maintenance Required'
    },
    out_of_service: {
      message: `Table ${data.tableNumber} is out of service`,
      type: 'error',
      title: 'Table Out of Service'
    }
  };

  const statusInfo = statusMessages[data.status] || {
    message: `Table ${data.tableNumber} status changed to ${data.status}`,
    type: 'info',
    title: 'Table Status Changed'
  };

  showNotification(statusInfo.title, statusInfo.message, statusInfo.type);

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('tableStatusChanged', { detail: data }));
});

socket.on('reservationAssigned', (data) => {
  console.log('Reservation assigned:', data);
  showNotification('Table Assigned', `Table assigned to reservation`, 'success');

  // Trigger custom event for components to listen to
  window.dispatchEvent(new CustomEvent('reservationAssigned', { detail: data }));
});

// Export socket instance and utility functions
export default socket;

// Utility functions for components to use
export const socketUtils = {
  // Join a specific table room for targeted updates
  joinTableRoom: (tableId) => {
    socket.emit('joinTableRoom', tableId);
  },

  // Leave a specific table room
  leaveTableRoom: (tableId) => {
    socket.emit('leaveTableRoom', tableId);
  },

  // Join a specific reservation room for targeted updates
  joinReservationRoom: (reservationId) => {
    socket.emit('joinReservationRoom', reservationId);
  },

  // Leave a specific reservation room
  leaveReservationRoom: (reservationId) => {
    socket.emit('leaveReservationRoom', reservationId);
  },

  // Emit table status change
  emitTableStatusChange: (data) => {
    socket.emit('tableStatusChange', data);
  },

  // Emit reservation assignment
  emitReservationAssigned: (data) => {
    socket.emit('reservationAssigned', data);
  },

  // Emit reservation status change
  emitReservationStatusChange: (data) => {
    socket.emit('reservationStatusChange', data);
  }
};
