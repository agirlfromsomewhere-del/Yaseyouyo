// Best-effort in-app reminders. Important limitation, disclosed in the UI:
// a free static site with no backend cannot schedule a notification to
// fire while the app is closed — real scheduled push needs a server to
// send it. These only fire while this tab/app is open and in the
// foreground long enough for the check below to run.

export function notificationsSupported() {
  return 'Notification' in window;
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.requestPermission();
}

export function notificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
}

const NUDGE_HOUR = 18; // 6pm local time
const SESSION_FLAG = 'diet-coach-nudged-today';

// Call once per dashboard load. If permission is granted, it's past the
// nudge hour, and nothing has been logged for `dateISO` yet, shows one
// reminder notification (at most once per browser session per day).
export function maybeNudge({ dateISO, hasLoggedToday }) {
  if (notificationPermission() !== 'granted') return;
  if (hasLoggedToday) return;
  if (new Date().getHours() < NUDGE_HOUR) return;
  if (sessionStorage.getItem(SESSION_FLAG) === dateISO) return;

  sessionStorage.setItem(SESSION_FLAG, dateISO);
  new Notification('Diet Coach', {
    body: "You haven't logged any food today. Log it now to stay on track.",
  });
}
