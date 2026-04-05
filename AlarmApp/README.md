# AlarmApp

A React Native alarm clock application built with Expo SDK 54, featuring Domain-Driven Design (DDD), Event Modeling, SQLite persistence, and PostHog analytics.

## Features

- **Create, edit, and delete alarms** with customizable times, labels, and sounds
- **Recurring alarms** - Set alarms for daily, weekdays, weekends, or custom days
- **Native alarm scheduling** - Uses Android AlarmManager and iOS Local Notifications
- **SQLite persistence** - Alarms persist locally using expo-sqlite
- **Analytics tracking** - PostHog integration for tracking alarm lifecycle events
- **Event-driven architecture** - Domain events flow through an EventBus

## Architecture

### Domain-Driven Design (DDD)

The project follows DDD principles with clear separation of concerns:

```
src/
├── domain/           # Pure business logic (no external dependencies)
│   ├── alarm/
│   │   ├── entities/Alarm.ts       # Alarm aggregate root
│   │   ├── value-objects/          # Time, RepeatPattern, SoundSelection
│   │   ├── events/                 # Domain events (AlarmCreated, etc.)
│   │   └── repositories/           # Repository interfaces
│   └── shared/                     # EventBus, DomainEvent base
├── application/      # Use cases / application services
├── infrastructure/   # External integrations
│   ├── database/     # SQLite setup
│   ├── persistence/  # SQLite repository implementation
│   ├── native/       # Android/iOS alarm schedulers
│   └── analytics/    # PostHog integration
└── presentation/     # React Native UI
```

### Event Modeling

Domain events capture significant occurrences in the alarm lifecycle:

| Event | Description |
|-------|-------------|
| `AlarmCreated` | New alarm created |
| `AlarmUpdated` | Alarm properties changed |
| `AlarmDeleted` | Alarm removed |
| `AlarmTriggered` | Alarm fired |
| `AlarmDismissed` | User dismissed alarm |
| `AlarmSnoozed` | User snoozed alarm |
| `AlarmEnabled` / `AlarmDisabled` | Alarm toggled |

### Event → Analytics Flow

```
User Action → Use Case → Domain Event → Event Bus
                                              ├──→ PostHogAlarmTracker → posthog.capture()
                                              └──→ (future: State updates)
```

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 54 |
| Language | TypeScript |
| State Management | TanStack Query |
| Database | expo-sqlite |
| Analytics | PostHog |
| Android Alarms | AlarmManager |
| iOS Alarms | UNUserNotificationCenter |

## PostHog Events

The following events are tracked:

| Event | Properties |
|-------|------------|
| `alarm_created` | alarm_id, time, is_recurring, repeat_days_count |
| `alarm_updated` | alarm_id, changed_fields |
| `alarm_deleted` | alarm_id |
| `alarm_triggered` | alarm_id, was_in_foreground |
| `alarm_dismissed` | alarm_id, time_to_dismiss_seconds |
| `alarm_snoozed` | alarm_id, snooze_duration_minutes |
| `alarm_enabled` | alarm_id |
| `alarm_disabled` | alarm_id |

## Prerequisites

- Node.js >= 20.19.4
- Android Studio (for Android development)
- Xcode (for iOS development)
- ADB configured for device testing

## Installation

```bash
# Install dependencies
cd AlarmApp
npm install

# Generate native directories
npx expo prebuild
```

## Running

### Android

```bash
npx expo run:android
```

### iOS (Simulator)

```bash
npx expo run:ios
```

## Development Commands

```bash
# TypeScript check
npx tsc --noEmit

# Clear and rebuild
rm -rf android ios && npx expo prebuild
```

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/domain/alarm/entities/` | Alarm entity with business logic |
| `src/domain/alarm/value-objects/` | Immutable value types (Time, RepeatPattern) |
| `src/domain/alarm/events/` | Domain events |
| `src/application/alarm/` | Use cases (create, update, delete alarms) |
| `src/infrastructure/persistence/` | SQLite repository implementation |
| `src/infrastructure/native/` | Platform-specific alarm scheduling |
| `src/infrastructure/analytics/` | PostHog event tracking |
| `src/presentation/screens/` | React Native screens |
| `src/presentation/components/` | Reusable UI components |
| `src/presentation/hooks/` | Custom hooks (useAlarms, etc.) |

## Configuration

### PostHog

Set these environment variables in `.env`:

```
EXPO_PUBLIC_POSTHOG_API_KEY=your_api_key
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Android Permissions

The app requires these permissions (already configured in AndroidManifest.xml):
- `WAKE_LOCK`
- `RECEIVE_BOOT_COMPLETED`
- `SCHEDULE_EXACT_ALARM`
- `USE_EXACT_ALARM`
- `POST_NOTIFICATIONS`
- `USE_FULL_SCREEN_INTENT`

## License

MIT
